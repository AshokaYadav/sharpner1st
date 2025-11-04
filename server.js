const http = require("http");
const fs = require("fs");
const db = require("./config/db");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // 🏠 Home page — show form + todos list
  if (url === "/") {
    db.query("SELECT * FROM todos", (err, results) => {
      if (err) throw err;

      let todosHTML = results
        .map(
          (todo) => `
            <li>
              ${todo.id}. ${todo.task}
              <form action="/delete" method="POST" style="display:inline;">
                <input type="hidden" name="id" value="${todo.id}" />
                <button type="submit">Delete</button>
              </form>
            </li>
             <li>
              ${todo.id}. ${todo.task}
              <form action="/delete" method="POST" style="display:inline;">
                <input type="hidden" name="id" value="${todo.id}" />
                <button type="submit">Delete</button>
              </form>
            </li>
          `
        )
        .join("");

      const html = `
        <html>
        <head><title>Todo List</title></head>
        <body>
          <h1>My Todo List</h1>
          <form action="/add" method="POST">
            <input type="text" name="task" placeholder="Enter a task" required />
            <button type="submit">Add</button>
          </form>
          <ul>${todosHTML}</ul>
        </body>
        </html>
      `;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    });
  }

  // ➕ Add todo
  else if (url === "/add" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const params = new URLSearchParams(body);
      const task = params.get("task");

      db.query("INSERT INTO todos (task) VALUES (?)", [task], (err) => {
        if (err) throw err;
        res.writeHead(302, { Location: "/" });
        res.end();
      });
    });
  }

  // 🗑️ Delete todo
  else if (url === "/delete" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const params = new URLSearchParams(body);
      const id = params.get("id");

      db.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
        if (err) throw err;
        console.log(`🗑️ Deleted todo with id ${id}`);
        res.writeHead(302, { Location: "/" });
        res.end();
      });
    });
  }

  // ❌ Any other route
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(4000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});



