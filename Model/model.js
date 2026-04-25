// require('dotenv').config();
// var mysql = require('mysql');

// var connection = mysql.createPool({
//     connectionLimit: 10,
//     user: process.env.DB_USER || "root",
//     host: process.env.DB_HOST || "localhost",
//     password: process.env.DB_PASSWORD || "",
//     port: process.env.DB_PORT || "3306",
//     database: process.env.DB_NAME || "ecommerce"
// });

// connection.getConnection(function(err, conn) {
//     if (err) {
//         console.log("DB Connection Error:", err.sqlMessage || err.message);
//     } else {
//         console.log("Connection Pool Established");
//         conn.release();
//     }
// });

// module.exports = connection;

// config/db.js
// config/db.jsrequire('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error("❌ DB Error:", err.message);
  } else {
    console.log("✅ DB Connected");
    conn.release();
  }
});

module.exports = connection;