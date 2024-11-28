const Mysql = require("mysql2");

const connection = Mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "nodedb",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + connection.threadId);
});

module.exports = connection;
