const express = require("express");
const bodyParser = require("body-parser");

const db = require("./mysqlConnection");
const logEvents = require("./logEvents2.0");
const EventEmitter = require("events");

class Emitter extends EventEmitter {}
const myEmitter = new Emitter();
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = 3000;

const app = express();

app.use((req, res, next) => {
  console.log(req.url);
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");
  next();
});

app.use(bodyParser.json());

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error fetching tasks");
      return;
    }
    res.json(results);
  });
});

app.get("/tasks/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM tasks where id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error fetching tasks");
      return;
    }
    res.json(results);
  });
});

app.post("/tasks", (req, res) => {
  const { name, description, points } = req.body;
  db.query(
    "INSERT INTO tasks (name, description, status, points, created_at, updated_at) VALUES (?, ?, 1, ?, ?, ?)",
    [name, description, points, new Date(), new Date()],
    (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(400).send("Error creating Task");
        return;
      }
      res.status(201).send("Task created successfully");
    }
  );
});

app.put("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const { name, description, points } = req.body;
  db.query(
    "UPDATE tasks SET name = ?, description = ?, points = ?, updated_at = ? where id = ?",
    [name, description, points, new Date(), id],
    (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(400).send("Error creating Task");
        return;
      }
      res.status(201).send("Task updated successfully");
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM tasks where id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error fetching tasks");
      return;
    }
    res.status(201).send("Task deleted successfully");
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
