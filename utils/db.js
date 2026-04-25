const connection = require("../Model/model");

function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function ensureTable(createTableSql) {
  await query(createTableSql);
}

async function columnExists(tableName, columnName) {
  const rows = await query(
    "SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
    [tableName, columnName]
  );
  return Number(rows?.[0]?.cnt || 0) > 0;
}

module.exports = { query, ensureTable, columnExists };
