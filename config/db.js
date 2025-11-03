const mysql = require("mysql2");

// Connect to MySQL (without selecting DB first)
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // 👈 apna MySQL password daal
});

connection.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");

  // Create database if not exists
  connection.query("CREATE DATABASE IF NOT EXISTS todo_db", (err) => {
    if (err) throw err;
    console.log("📂 Database 'todo_db' created or already exists");

    // Switch to that database
    connection.changeUser({ database: "todo_db" }, (err) => {
      if (err) throw err;
      console.log("🔄 Using database 'todo_db'");

      // Create todos table
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
  });
});

module.exports = connection;
