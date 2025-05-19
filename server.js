const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

const db = new sqlite3.Database("./trailconnect.db");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS trails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      difficulty TEXT,
      description TEXT,
      lat REAL,
      lng REAL
    )
  `);
});

app.get("/api/trails", (req, res) => {
  db.all("SELECT * FROM trails", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/trails", (req, res) => {
  const { name, difficulty, description, lat, lng } = req.body;
  db.run(
    "INSERT INTO trails (name, difficulty, description, lat, lng) VALUES (?, ?, ?, ?, ?)",
    [name, difficulty, description, lat, lng],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

