const mysql = require("mysql2");

// 🔹 Connect directly to your Railway MySQL
const connection = mysql.createConnection({
  host: "yamabiko.proxy.rlwy.net", // from Railway
  user: "root", // from Railway
  password: "LaVxqFLSduvRTeAYltuKFruPCJWxmoWX", // from Railway
  database: "railway", // from Railway
  port: 25893, // from Railway
});

connection.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to Railway MySQL");

  // 🔹 Create todos table if it doesn't exist
  const createTable = `
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task VARCHAR(255) NOT NULL
    )
  `;
  connection.query(createTable, (err) => {
    if (err) throw err;
    console.log("✅ Table 'todos' ready!");
  });
});

module.exports = connection;
