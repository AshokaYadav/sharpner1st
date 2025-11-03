const http = require("http");
const fs = require("fs");
const { URL } = require("url");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // 🏠 Home route — show all todos
  if (url === "/") {
    fs.readFile("todos.txt", "utf-8", (err, data) => {
      const todos = data ? data.split("\n").filter(Boolean) : [];

      res.setHeader("Content-Type", "text/html");
      res.write(`
        <html>
          <head><title>Todo App</title></head>
          <body style="font-family:sans-serif; margin:40px;">
            <h1> My Todo List</h1>
            
            ${todos.length > 0 ? "<ul>" + todos.map((t, i) => `
              <li>
                ${t} 
                <form action="/delete" method="POST" style="display:inline;">
                  <input type="hidden" name="index" value="${i}">
                  <button type="submit" style="margin-left:10px;"> Remove</button>
                </form>
              </li>
            `).join("") + "</ul>" : "<p>No todos yet!</p>"}
            
            <hr/>
            <form action="/add" method="POST">
              <input type="text" name="todo" placeholder="Enter a new todo" required/>
              <button type="submit"> Add Todo</button>
            </form>
          </body>
        </html>
      `);
      res.end();
    });
  }

  // ➕ Add new todo
  else if (url === "/add" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const newTodo = decodeURIComponent(parsedBody.split("=")[1]);

      fs.appendFile("todos.txt", newTodo + "\n", (err) => {
        if (err) console.log("Error adding todo:", err);
      });

      res.statusCode = 302;
      res.setHeader("Location", "/");
      res.end();
    });
  }

  // ❌ Delete a todo by index
  else if (url === "/delete" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const index = parseInt(parsedBody.split("=")[1]);

      fs.readFile("todos.txt", "utf-8", (err, data) => {
        const todos = data ? data.split("\n").filter(Boolean) : [];
        if (index >= 0 && index < todos.length) {
          todos.splice(index, 1); // remove that todo
        }

        fs.writeFile("todos.txt", todos.join("\n"), (err) => {
          if (err) console.log("Error deleting todo:", err);
        });

        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  }

  // ❌ 404 fallback
  else {
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>404 - Page Not Found</h1>");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000/");
});
