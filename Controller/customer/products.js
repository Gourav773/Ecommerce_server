const { query } = require('../../utils/db');

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function listProducts(req, res) {
  try {
    const q = String(req.query.q || '').trim();
    const categoryId = String(req.query.categoryId || '').trim();
    const subcategoryId = String(req.query.subcategoryId || '').trim();
    const minPrice = req.query.minPrice !== undefined ? toNumber(req.query.minPrice, 0) : null;
    const maxPrice = req.query.maxPrice !== undefined ? toNumber(req.query.maxPrice, 0) : null;

    const page = Math.max(1, toNumber(req.query.page, 1));
    const limit = Math.min(50, Math.max(1, toNumber(req.query.limit, 12)));
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    if (q) {
      where.push('(p.pname LIKE ? OR p.brand_name LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    if (subcategoryId) {
      where.push('p.Subcategoryid = ?');
      params.push(subcategoryId);
    }

    if (categoryId) {
      where.push('sc.Pcategoryid = ?');
      params.push(categoryId);
    }

    if (minPrice !== null) {
      where.push('CAST(p.price AS DECIMAL(10,2)) >= ?');
      params.push(minPrice);
    }
    if (maxPrice !== null) {
      where.push('CAST(p.price AS DECIMAL(10,2)) <= ?');
      params.push(maxPrice);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countRows = await query(
      `SELECT COUNT(*) AS total
       FROM tbl_retailer_products p
       LEFT JOIN tbl_admin_subcategory sc ON sc.Subcategoryid = p.Subcategoryid
       ${whereSql}`,
      params
    );

    const total = Number(countRows?.[0]?.total || 0);

    const items = await query(
      `SELECT
        p.pid, p.pname, p.price, p.discount, p.quantity, p.brand_name, p.Subcategoryid, p.regno,
        sc.Subcategoryname,
        c.Pcategoryid AS Categoryid,
        c.Categoryname,
        (
          SELECT image FROM tbl_retailer_product_images i
          WHERE i.pid = p.pid
          LIMIT 1
        ) AS image
      FROM tbl_retailer_products p
      LEFT JOIN tbl_admin_subcategory sc ON sc.Subcategoryid = p.Subcategoryid
      LEFT JOIN tbl_admin_product_category c ON c.Pcategoryid = sc.Pcategoryid
      ${whereSql}
      ORDER BY p.pid DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return res.json({ page, limit, total, items });
  } catch (err) {
    console.error('listProducts error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getProduct(req, res) {
  try {
    const pid = String(req.params.pid || '').trim();
    if (!pid) return res.status(400).json({ error: 'pid is required' });

    const rows = await query(
      `SELECT
        p.*, sc.Subcategoryname, sc.Pcategoryid,
        c.Categoryname
       FROM tbl_retailer_products p
       LEFT JOIN tbl_admin_subcategory sc ON sc.Subcategoryid = p.Subcategoryid
       LEFT JOIN tbl_admin_product_category c ON c.Pcategoryid = sc.Pcategoryid
       WHERE p.pid = ?
       LIMIT 1`,
      [pid]
    );

    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    const product = rows[0];

    const description = await query('SELECT * FROM tbl_retailer_product_description WHERE pid=? LIMIT 1', [pid]);
    const images = await query('SELECT imgid, image, description, colour FROM tbl_retailer_product_images WHERE pid=?', [pid]);

    // Active offers for this subcategory
    const offers = await query(
      `SELECT offerid, offername, percentage_discount, flat_discount, upto_discount, valid_from, valid_to, terms_and_condition, status
       FROM tbl_admin_offer
       WHERE Subcategoryid = ? AND status = 'active'
       AND (valid_from IS NULL OR valid_from <= CURDATE())
       AND (valid_to IS NULL OR valid_to >= CURDATE())`,
      [product.Subcategoryid]
    );

    const ratingAgg = await query(
      `SELECT COUNT(*) AS count, AVG(rating) AS avg
       FROM tbl_product_reviews
       WHERE pid = ?`,
      [pid]
    ).catch(() => [{ count: 0, avg: null }]);

    const reviews = await query(
      `SELECT r.review_id, r.rating, r.review_text, r.created_at,
              c.name AS customer_name
       FROM tbl_product_reviews r
       LEFT JOIN tbl_customer c ON c.customer_id = r.customer_id
       WHERE r.pid = ?
       ORDER BY r.created_at DESC
       LIMIT 20`,
      [pid]
    ).catch(() => []);

    return res.json({
      product,
      description: description[0] || null,
      images,
      offers,
      rating: {
        count: Number(ratingAgg?.[0]?.count || 0),
        avg: ratingAgg?.[0]?.avg !== null ? Number(ratingAgg[0].avg) : null
      },
      reviews
    });
  } catch (err) {
    console.error('getProduct error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function listCategories(req, res) {
  try {
    const rows = await query('SELECT * FROM tbl_admin_product_category ORDER BY Categoryname ASC');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function listSubcategories(req, res) {
  try {
    const categoryId = String(req.query.categoryId || '').trim();
    const params = [];
    const where = categoryId ? 'WHERE Pcategoryid=?' : '';
    if (categoryId) params.push(categoryId);
    const rows = await query(`SELECT * FROM tbl_admin_subcategory ${where} ORDER BY Subcategoryname ASC`, params);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { listProducts, getProduct, listCategories, listSubcategories };
