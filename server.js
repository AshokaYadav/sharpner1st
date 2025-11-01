// server.js
const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Response header: 200 OK, plain text
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Hello");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
