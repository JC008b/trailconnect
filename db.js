const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('trailconnect.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS trails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    location TEXT,
    difficulty TEXT
  )`);
});

module.exports = db;
