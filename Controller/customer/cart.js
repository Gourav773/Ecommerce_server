const { query, ensureTable } = require('../../utils/db');

async function ensureCartTable() {
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
}

async function getCart(req, res) {
  try {
    await ensureCartTable();
    const rows = await query(
      `SELECT c.cart_id, c.pid, c.quantity,
              p.pname, p.price, p.discount, p.quantity as stock, p.regno, p.Subcategoryid,
              (SELECT image FROM tbl_retailer_product_images i WHERE i.pid=p.pid LIMIT 1) AS image
       FROM tbl_customer_cart c
       LEFT JOIN tbl_retailer_products p ON p.pid = c.pid
       WHERE c.customer_id=?
       ORDER BY c.updated_at DESC, c.created_at DESC`,
      [req.customer.id]
    );
    return res.json(rows);
  } catch (err) {
    console.error('getCart error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function addToCart(req, res) {
  try {
    await ensureCartTable();
    const pid = String(req.body.pid || '').trim();
    const quantity = Math.max(1, Number(req.body.quantity || 1));
    if (!pid) return res.status(400).json({ error: 'pid is required' });

    await query(
      `INSERT INTO tbl_customer_cart (customer_id, pid, quantity, updated_at)
       VALUES (?,?,?,NOW())
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), updated_at=NOW()`,
      [req.customer.id, pid, quantity]
    );

    return res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    console.error('addToCart error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function updateCartItem(req, res) {
  try {
    await ensureCartTable();
    const pid = String(req.params.pid || '').trim();
    const quantity = Number(req.body.quantity);
    if (!pid) return res.status(400).json({ error: 'pid is required' });
    if (!Number.isFinite(quantity) || quantity < 1) return res.status(400).json({ error: 'quantity must be >= 1' });

    await query('UPDATE tbl_customer_cart SET quantity=?, updated_at=NOW() WHERE customer_id=? AND pid=?', [quantity, req.customer.id, pid]);
    return res.json({ message: 'Updated' });
  } catch (err) {
    console.error('updateCartItem error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function removeCartItem(req, res) {
  try {
    await ensureCartTable();
    const pid = String(req.params.pid || '').trim();
    if (!pid) return res.status(400).json({ error: 'pid is required' });
    await query('DELETE FROM tbl_customer_cart WHERE customer_id=? AND pid=?', [req.customer.id, pid]);
    return res.json({ message: 'Removed' });
  } catch (err) {
    console.error('removeCartItem error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function clearCart(req, res) {
  try {
    await ensureCartTable();
    await query('DELETE FROM tbl_customer_cart WHERE customer_id=?', [req.customer.id]);
    return res.json({ message: 'Cleared' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
