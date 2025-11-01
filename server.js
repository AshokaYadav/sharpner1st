const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Request received:", req.url);

  // ✅ Set header for plain text response
  res.setHeader("Content-Type", "text/plain");

  if (req.url === "/home") {
    res.write("Welcome home");
  } else if (req.url === "/about") {
    res.write("Welcome to About Us page");
  } else if (req.url === "/node") {
    res.write("Welcome to my Node Js project");
  } else {
    res.write("404 Page Not Found, bhai 😅");
  }

  res.end();
});

server.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
