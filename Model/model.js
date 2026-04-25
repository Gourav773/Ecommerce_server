require('dotenv').config();
var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 10,
    user: process.env.DB_USER || "root",
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "",
    port: process.env.DB_PORT || "3306",
    database: process.env.DB_NAME || "ecommerce"
});

connection.getConnection(function(err, conn) {
    if (err) {
        console.log("DB Connection Error:", err.sqlMessage || err.message);
    } else {
        console.log("Connection Pool Established");
        conn.release();
    }
});

module.exports = connection;