const crypto = require('crypto');
const { query, ensureTable, columnExists } = require('../../utils/db');

async function ensureOrderColumns() {
  // Add customer_id column to existing retailer orders table if missing
  const exists = await columnExists('tbl_retailer_orders', 'customer_id').catch(() => false);
  if (!exists) {
    try {
      await query('ALTER TABLE tbl_retailer_orders ADD COLUMN customer_id INT NULL AFTER orderid');
    } catch (err) {
      // ignore if no privileges or already exists
      console.warn('Could not add customer_id column:', err.message);
    }
  }

  // Optional: store order group id
  const groupExists = await columnExists('tbl_retailer_orders', 'order_group_id').catch(() => false);
  if (!groupExists) {
    try {
      await query('ALTER TABLE tbl_retailer_orders ADD COLUMN order_group_id VARCHAR(64) NULL AFTER customer_id');
    } catch (err) {
      console.warn('Could not add order_group_id column:', err.message);
    }
  }

  // Ensure cart table exists if customer uses checkout from cart
  await ensureTable(`
    CREATE TABLE IF NOT EXISTS tbl_customer_cart (
      cart_id INT NOT NULL AUTO_INCREMENT,
      customer_id INT NOT NULL,
      pid VARCHAR(64) NOT NULL,
      quantity INT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NULL,
      PRIMARY KEY (cart_id),
      UNIQUE KEY uq_customer_pid (customer_id, pid),
      INDEX idx_customer (customer_id)
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

function generateOrderId() {
  return 'ORD-' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

async function getMyOrders(req, res) {
  try {
    await ensureOrderColumns();
    const rows = await query(
      `SELECT * FROM tbl_retailer_orders
       WHERE customer_id = ?
       ORDER BY order_date DESC`,
      [req.customer.id]
    ).catch(async () => {
      // fallback if customer_id column doesn't exist
      return [];
    });

    return res.json(rows);
  } catch (err) {
    console.error('getMyOrders error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function placeOrder(req, res) {
  try {
    await ensureOrderColumns();

    const payment_method =
  String(req.body.payment_method || 'cod').toLowerCase() === 'online'
    ? 'online'
    : 'cod';
    const payment_verified = req.body.payment_verified === true;
    const payment_status = payment_method === 'online'
      ? (payment_verified ? 'paid' : 'unpaid')
      : 'unpaid';
    const payment_reference = String(req.body.payment_reference || '').trim();

    const address = req.body.address || {};
    const customer_name = String(address.name || req.body.customer_name || '').trim();
    const customer_email = String(req.body.customer_email || '').trim().toLowerCase();
    const customer_phone = String(address.mobile || req.body.customer_phone || '').trim();
    const customer_address = String(address.address_line || req.body.customer_address || '').trim();

    if (!customer_name || !customer_phone || !customer_address) {
      return res.status(400).json({ error: 'address (name, mobile, address_line) is required' });
    }

    // Load cart items
    const cartItems = await query(
      `SELECT c.pid, c.quantity,
              p.pname, p.regno, p.price, p.discount, p.quantity as stock
       FROM tbl_customer_cart c
       JOIN tbl_retailer_products p ON p.pid = c.pid
       WHERE c.customer_id=?`,
      [req.customer.id]
    );

    if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

    const orderid = generateOrderId();
    const order_group_id = orderid; // keep same for grouping

    // Insert each line as one row in tbl_retailer_orders
    for (const item of cartItems) {
      // const qty = Number(item.quantity);
      // const unitPrice = Number(item.price || 0);
      // const discount = Number(item.discount || 0);
      // const unitAfterDiscount = Math.max(0, unitPrice - discount);
      // const total = unitAfterDiscount * qty;
      const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const qty = toNumber(item.quantity);
const unitPrice = toNumber(item.price);
const discount = toNumber(item.discount);

if (qty <= 0) {
  throw new Error("Invalid quantity");
}

const unitAfterDiscount = Math.max(0, unitPrice - discount);
const total = unitAfterDiscount * qty;

if (!Number.isFinite(total)) {
  throw new Error("Invalid total calculation");
}

      await query(
        `INSERT INTO tbl_retailer_orders
         (orderid, customer_id, order_group_id, regno, pid, pname, customer_name, customer_email, customer_phone, customer_address, quantity, unit_price, total_price, status, payment_method, payment_status, order_date, delivery_date, notes)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NULL,'')`,
        [
          orderid,
          req.customer.id,
          order_group_id,
          item.regno,
          item.pid,
          item.pname,
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          qty,
          unitAfterDiscount,
          total,
          'pending',
          payment_method,
          payment_status
        ]
      );

      if (payment_reference) {
        await query(
          'UPDATE tbl_retailer_orders SET notes=? WHERE orderid=? AND pid=?',
          [`payment_reference:${payment_reference}`, orderid, item.pid]
        );
      }

      // Reduce stock
      await query('UPDATE tbl_retailer_products SET quantity = GREATEST(0, quantity - ?) WHERE pid=?', [qty, item.pid]);
    }

    // Clear cart
    await query('DELETE FROM tbl_customer_cart WHERE customer_id=?', [req.customer.id]);

    return res.status(201).json({ message: 'Order placed', orderid });
  } catch (err) {
    console.error('placeOrder error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getMyOrders, placeOrder };
