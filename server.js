const htpp = require("http");

const server = htpp.createServer((req, res) => {
  console.log("Server running");
});

server.listen(5000);
