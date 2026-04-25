require('dotenv').config();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
  user: process.env.DB_USER || "root",
  host: process.env.DB_HOST || "localhost",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || "3306",
  database: process.env.DB_NAME || "ecommerce"
});

const ADMIN_NAME = "Gourav Yadav";
const ADMIN_EMAIL = "gourav003yadav@gmail.com";
const ADMIN_PASSWORD = "Gourav2003";

async function seed() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  connection.connect((err) => {
    if (err) {
      console.error("DB connection failed:", err.message);
      process.exit(1);
    }

    // Check if admin already exists
    connection.query("SELECT uid FROM tbl_admin_user WHERE email = ?", [ADMIN_EMAIL], (err, rows) => {
      if (err) {
        console.error("Query error:", err.sqlMessage);
        connection.end();
        process.exit(1);
      }

      if (rows.length > 0) {
        // Update existing admin password & status
        connection.query(
          "UPDATE tbl_admin_user SET name = ?, password = ?, status = 'active' WHERE email = ?",
          [ADMIN_NAME, hash, ADMIN_EMAIL],
          (err) => {
            if (err) console.error("Update error:", err.sqlMessage);
            else console.log("\n  Admin password reset successfully!\n");
            printCredentials();
            connection.end();
          }
        );
      } else {
        // Get next uid
        connection.query("SELECT IFNULL(MAX(uid), 0) + 1 AS nextId FROM tbl_admin_user", (err, result) => {
          if (err) {
            console.error("Query error:", err.sqlMessage);
            connection.end();
            process.exit(1);
          }
          const nextUid = result[0].nextId;
          const data = {
            uid: nextUid,
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hash,
            mobile: "0000000000",
            aadhaar: String(nextUid).padStart(12, '0'),
            status: "active"
          };
          connection.query("INSERT INTO tbl_admin_user SET ?", data, (err) => {
            if (err) console.error("Insert error:", err.sqlMessage);
            else console.log("\n  Admin user created successfully!\n");
            printCredentials();
            connection.end();
          });
        });
      }
    });
  });
}

function printCredentials() {
  console.log("  ================================");
  console.log("  Email:    " + ADMIN_EMAIL);
  console.log("  Password: " + ADMIN_PASSWORD);
  console.log("  ================================\n");
}

seed();
