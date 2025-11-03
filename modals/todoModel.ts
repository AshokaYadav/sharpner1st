const db = require("../config/db");

const Todo = {
  getAll: (callback) => {
    db.query("SELECT * FROM todos", callback);
  },

  add: (task, callback) => {
    db.query("INSERT INTO todos (task) VALUES (?)", [task], callback);
  },
};

module.exports = Todo;
