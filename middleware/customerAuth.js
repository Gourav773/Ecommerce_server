const jwt = require('jsonwebtoken');
const config = require('../config');

function customerAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const payload = jwt.verify(token, config.jwt.secret);
    if (!payload || !payload.customerId) return res.status(401).json({ error: 'Unauthorized' });

    req.customer = { id: payload.customerId, email: payload.email || null, mobile: payload.mobile || null };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = { customerAuth };
