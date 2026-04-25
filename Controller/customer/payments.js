const crypto = require('crypto');
const https = require('https');
const config = require('../../config');

function ensureRazorpayConfigured(res) {
  if (config.razorpay.enabled) return true;
  res.status(503).json({ error: 'Razorpay is not configured on the server' });
  return false;
}

function callRazorpay(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const auth = Buffer.from(`${config.razorpay.keyId}:${config.razorpay.keySecret}`).toString('base64');

    const req = https.request(
      {
        hostname: 'api.razorpay.com',
        path,
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (response) => {
        let raw = '';
        response.on('data', (chunk) => {
          raw += chunk;
        });
        response.on('end', () => {
          const parsed = raw ? JSON.parse(raw) : {};
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(parsed);
            return;
          }
          reject(new Error(parsed.error?.description || parsed.error?.reason || 'Razorpay request failed'));
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function createOrder(req, res) {
  if (!ensureRazorpayConfigured(res)) return;

  try {
    const amount = Number(req.body.amount);
    const currency = String(req.body.currency || 'INR').trim().toUpperCase();
    const receipt = String(req.body.receipt || '').trim() || `rcpt_${Date.now()}`;

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }

    const razorpayOrder = await callRazorpay('/v1/orders', {
      amount: Math.round(amount),
      currency,
      receipt
    });

    return res.json({
      key: config.razorpay.keyId,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (err) {
    console.error('createOrder error:', err.message);
    return res.status(502).json({ error: err.message || 'Unable to create Razorpay order' });
  }
}

async function verifyOrder(req, res) {
  if (!ensureRazorpayConfigured(res)) return;

  try {
    const razorpay_order_id = String(req.body.razorpay_order_id || '').trim();
    const razorpay_payment_id = String(req.body.razorpay_payment_id || '').trim();
    const razorpay_signature = String(req.body.razorpay_signature || '').trim();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'razorpay_order_id, razorpay_payment_id and razorpay_signature are required' });
    }

    const expected = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Invalid payment signature' });
    }

    return res.json({ verified: true });
  } catch (err) {
    console.error('verifyOrder error:', err.message);
    return res.status(500).json({ error: 'Unable to verify payment' });
  }
}

module.exports = { createOrder, verifyOrder };
