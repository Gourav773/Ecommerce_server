require('dotenv').config();
const mysql = require('mysql');

function getArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find(a => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

const email = getArg('email');
const mobileRaw = getArg('mobile');
const mobile = String(mobileRaw || '').replace(/\D/g, '');

if (!email || !mobile) {
  console.error('Usage: node set-admin-mobile.js --email=someone@example.com --mobile=9999999999');
  process.exit(1);
}

const connection = mysql.createConnection({
  user: process.env.DB_USER || 'root',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || '3306',
  database: process.env.DB_NAME || 'ecommerce'
});

connection.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }

  connection.query(
    'UPDATE tbl_admin_user SET mobile = ? WHERE email = ? LIMIT 1',
    [mobile, email],
    (err, result) => {
      if (err) {
        console.error('Update failed:', err.sqlMessage || err.message);
        connection.end();
        process.exit(1);
      }
      if (result.affectedRows === 0) {
        console.error('No admin user found for email:', email);
        connection.end();
        process.exit(1);
      }
      console.log('Admin mobile updated for', email, '=>', mobile);
      connection.end();
    }
  );
});
