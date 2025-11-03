const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // 🏠 Home route — show form + previous messages
  if (url === "/") {
    fs.readFile("message.txt", { encoding: "utf-8" }, (err, data) => {
      const messages = data ? data.split("\n").filter(Boolean).reverse().join("<br>") : "";

      res.setHeader("Content-Type", "text/html");
      res.write(`
        <html>
          <head><title>Enter Message</title></head>
          <body style="font-family: sans-serif; margin: 40px;">
            <h2>Previous Messages:</h2>
            <p>${messages || "No messages yet!"}</p>
            <hr/>
            <form action="/message" method="POST">
              <input type="text" name="message" placeholder="Enter your message" required />
              <button type="submit">Send</button>
            </form>
          </body>
        </html>
      `);
      res.end();
    });
  }

  // 📨 Handle form submit (POST request)
  else if (url === "/message" && method === "POST") {
    const body = [];

    // 🔹 collect data chunks (Buffer)
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    // 🔹 when all data received
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1].replace(/\+/g, " ");

      // ✍️ Write message to file (append at bottom)
      fs.appendFile("message.txt", message + "\n", (err) => {
        if (err) console.log("Error writing file:", err);
      });

      // 🔁 Redirect back to home page
      res.statusCode = 302;
      res.setHeader("Location", "/");
      res.end();
    });
  }

  // ❌ Default route
  else {
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>404 Not Found</h1>");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
