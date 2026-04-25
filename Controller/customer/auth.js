const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { query, ensureTable } = require('../../utils/db');
const { sendSms } = require('../../services/sms');

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

async function ensureCustomerTables() {
  await ensureTable(`
    CREATE TABLE IF NOT EXISTS tbl_customer (
      customer_id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(191) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      status ENUM('active','inactive') NOT NULL DEFAULT 'active',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NULL,
      PRIMARY KEY (customer_id),
      UNIQUE KEY uq_customer_email (email),
      UNIQUE KEY uq_customer_mobile (mobile)
    ) ENGINE=InnoDB;
  `);

  await ensureTable(`
    CREATE TABLE IF NOT EXISTS tbl_customer_otp (
      id INT NOT NULL AUTO_INCREMENT,
      customer_id INT NOT NULL,
      purpose ENUM('login','reset') NOT NULL,
      otp_hash VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_customer_purpose_created (customer_id, purpose, created_at),
      INDEX idx_expires (expires_at)
    ) ENGINE=InnoDB;
  `);

  await ensureTable(`
    CREATE TABLE IF NOT EXISTS tbl_customer_address (
      address_id INT NOT NULL AUTO_INCREMENT,
      customer_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      address_line VARCHAR(255) NOT NULL,
      city VARCHAR(80) NOT NULL,
      state VARCHAR(80) NOT NULL,
      country VARCHAR(80) NOT NULL DEFAULT 'India',
      pin VARCHAR(12) NOT NULL,
      is_default TINYINT(1) NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (address_id),
      INDEX idx_customer (customer_id)
    ) ENGINE=InnoDB;
  `);
}

function normalizeMobile(mobile) {
  if (!mobile) return '';
  return String(mobile).replace(/\D/g, '');
}

function generateNumericOtp(length) {
  const len = Number(length) || 6;
  const min = Math.pow(10, len - 1);
  const max = Math.pow(10, len) - 1;
  return String(crypto.randomInt(min, max + 1));
}

function signToken(customer) {
  return jwt.sign(
    { customerId: customer.customer_id, email: customer.email, mobile: customer.mobile },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

async function register(req, res) {
  try {
    await ensureCustomerTables();

    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const mobile = normalizeMobile(req.body.mobile);
    const password = String(req.body.password || '');

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: 'name, email, mobile, password are required' });
    }

    const existing = await query('SELECT customer_id FROM tbl_customer WHERE email=? OR mobile=? LIMIT 1', [email, mobile]);
    if (existing.length) {
      return res.status(409).json({ error: 'Account already exists' });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const result = await query('INSERT INTO tbl_customer (name, email, mobile, password_hash) VALUES (?,?,?,?)', [name, email, mobile, hash]);

    const customer = {
      customer_id: result.insertId,
      name,
      email,
      mobile,
      status: 'active'
    };

    const token = signToken(customer);
    return res.status(201).json({ message: 'Registered', token, customer });
  } catch (err) {
    console.error('Customer register error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function login(req, res) {
  try {
    await ensureCustomerTables();

    const identifier = String(req.body.email || req.body.mobile || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!identifier || !password) {
      return res.status(400).json({ error: 'email/mobile and password are required' });
    }

    const mobile = normalizeMobile(identifier);
    const rows = await query(
      'SELECT customer_id, name, email, mobile, password_hash, status FROM tbl_customer WHERE (email=? OR mobile=?) LIMIT 1',
      [identifier, mobile]
    );

    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const customer = rows[0];
    if (customer.status !== 'active') return res.status(403).json({ error: 'Account inactive' });

    const ok = await bcrypt.compare(password, customer.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(customer);
    const { password_hash, ...safeCustomer } = customer;
    return res.json({ message: 'Login ok', token, customer: safeCustomer });
  } catch (err) {
    console.error('Customer login error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function me(req, res) {
  try {
    await ensureCustomerTables();
    const rows = await query('SELECT customer_id, name, email, mobile, status, created_at FROM tbl_customer WHERE customer_id=? LIMIT 1', [req.customer.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function otpRequest(req, res) {
  try {
    await ensureCustomerTables();

    const purpose = (req.body.purpose === 'login' ? 'login' : 'reset');
    const mobile = normalizeMobile(req.body.mobile);
    if (!mobile) return res.status(400).json({ error: 'mobile is required' });

    const customers = await query('SELECT customer_id, mobile FROM tbl_customer WHERE mobile=? AND status=\'active\' LIMIT 1', [mobile]);
    if (!customers.length) return res.status(404).json({ error: 'Account not found' });

    const customerId = customers[0].customer_id;

    // Rate limit (simple): enforce min seconds between requests
    const recent = await query(
      'SELECT created_at FROM tbl_customer_otp WHERE customer_id=? AND purpose=? ORDER BY created_at DESC LIMIT 1',
      [customerId, purpose]
    );
    if (recent.length) {
      const last = new Date(recent[0].created_at).getTime();
      const now = Date.now();
      const diffSec = Math.floor((now - last) / 1000);
      if (diffSec < config.otp.minSecondsBetweenRequests) {
        return res.status(429).json({ error: `Please wait ${config.otp.minSecondsBetweenRequests - diffSec}s` });
      }
    }

    const otp = generateNumericOtp(config.otp.length);
    const otpHash = await bcrypt.hash(otp, saltRounds);
    const expiresAt = new Date(Date.now() + config.otp.expiresMinutes * 60 * 1000);

    await query(
      'INSERT INTO tbl_customer_otp (customer_id, purpose, otp_hash, expires_at) VALUES (?,?,?,?)',
      [customerId, purpose, otpHash, expiresAt]
    );

    await sendSms({
      to: mobile,
      message: `Your OTP is ${otp}. It is valid for ${config.otp.expiresMinutes} minutes.`
    });

    const payload = { message: 'OTP sent' };
    if (config.otp.debugReturnOtp) payload.otp = otp;
    return res.json(payload);
  } catch (err) {
    console.error('Customer otpRequest error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function otpVerify(req, res) {
  try {
    await ensureCustomerTables();

    const purpose = (req.body.purpose === 'login' ? 'login' : 'reset');
    const mobile = normalizeMobile(req.body.mobile);
    const otp = String(req.body.otp || '').trim();

    if (!mobile || !otp) return res.status(400).json({ error: 'mobile and otp are required' });

    const customers = await query('SELECT customer_id, name, email, mobile, status FROM tbl_customer WHERE mobile=? LIMIT 1', [mobile]);
    if (!customers.length) return res.status(404).json({ error: 'Account not found' });
    const customer = customers[0];
    if (customer.status !== 'active') return res.status(403).json({ error: 'Account inactive' });

    const rows = await query(
      `SELECT id, otp_hash, expires_at FROM tbl_customer_otp
       WHERE customer_id=? AND purpose=? AND used_at IS NULL AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [customer.customer_id, purpose]
    );

    if (!rows.length) return res.status(400).json({ error: 'OTP expired or not found' });

    const row = rows[0];
    const ok = await bcrypt.compare(otp, row.otp_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid OTP' });

    await query('UPDATE tbl_customer_otp SET used_at=NOW() WHERE id=?', [row.id]);

    if (purpose === 'login') {
      const token = signToken(customer);
      return res.json({ message: 'OTP verified', token });
    }

    // reset password flow: require newPassword
    const newPassword = String(req.body.newPassword || '');
    if (!newPassword) return res.status(400).json({ error: 'newPassword is required' });

    const hash = await bcrypt.hash(newPassword, saltRounds);
    await query('UPDATE tbl_customer SET password_hash=?, updated_at=NOW() WHERE customer_id=?', [hash, customer.customer_id]);

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Customer otpVerify error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { register, login, me, otpRequest, otpVerify, ensureCustomerTables };
