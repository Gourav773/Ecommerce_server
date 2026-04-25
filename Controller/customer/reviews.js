const { query, ensureTable } = require('../../utils/db');

async function ensureReviewsTable() {
  await ensureTable(`
    CREATE TABLE IF NOT EXISTS tbl_product_reviews (
      review_id INT NOT NULL AUTO_INCREMENT,
      customer_id INT NOT NULL,
      pid VARCHAR(64) NOT NULL,
      rating INT NOT NULL,
      review_text TEXT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (review_id),
      INDEX idx_pid (pid),
      INDEX idx_customer (customer_id)
    ) ENGINE=InnoDB;
  `);
}

async function addReview(req, res) {
  try {
    await ensureReviewsTable();

    const pid = String(req.body.pid || '').trim();
    const rating = Number(req.body.rating);
    const review_text = String(req.body.review_text || '').trim();

    if (!pid) return res.status(400).json({ error: 'pid is required' });
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: 'rating must be 1-5' });

    await query(
      'INSERT INTO tbl_product_reviews (customer_id, pid, rating, review_text) VALUES (?,?,?,?)',
      [req.customer.id, pid, rating, review_text || null]
    );

    return res.status(201).json({ message: 'Review added' });
  } catch (err) {
    console.error('addReview error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { addReview };
