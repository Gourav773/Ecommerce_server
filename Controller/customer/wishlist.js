const { query, ensureTable } = require('../../utils/db');

async function ensureWishlistTable() {
  await ensureTable(`
    CREATE TABLE IF NOT EXISTS tbl_customer_wishlist (
      wishlist_id INT NOT NULL AUTO_INCREMENT,
      customer_id INT NOT NULL,
      pid VARCHAR(64) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (wishlist_id),
      UNIQUE KEY uq_customer_pid (customer_id, pid),
      INDEX idx_customer (customer_id)
    ) ENGINE=InnoDB;
  `);
}

async function getWishlist(req, res) {
  try {
    await ensureWishlistTable();
    const rows = await query(
      `SELECT w.wishlist_id, w.pid, w.created_at,
              p.pname, p.price, p.discount, p.quantity as stock, p.regno,
              (SELECT image FROM tbl_retailer_product_images i WHERE i.pid=p.pid LIMIT 1) AS image
       FROM tbl_customer_wishlist w
       LEFT JOIN tbl_retailer_products p ON p.pid = w.pid
       WHERE w.customer_id=?
       ORDER BY w.created_at DESC`,
      [req.customer.id]
    );
    return res.json(rows);
  } catch (err) {
    console.error('getWishlist error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function addWishlist(req, res) {
  try {
    await ensureWishlistTable();
    const pid = String(req.body.pid || '').trim();
    if (!pid) return res.status(400).json({ error: 'pid is required' });

    await query(
      `INSERT INTO tbl_customer_wishlist (customer_id, pid) VALUES (?,?)
       ON DUPLICATE KEY UPDATE created_at = created_at`,
      [req.customer.id, pid]
    );

    return res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error('addWishlist error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function removeWishlist(req, res) {
  try {
    await ensureWishlistTable();
    const pid = String(req.params.pid || '').trim();
    if (!pid) return res.status(400).json({ error: 'pid is required' });

    await query('DELETE FROM tbl_customer_wishlist WHERE customer_id=? AND pid=?', [req.customer.id, pid]);
    return res.json({ message: 'Removed' });
  } catch (err) {
    console.error('removeWishlist error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getWishlist, addWishlist, removeWishlist };
