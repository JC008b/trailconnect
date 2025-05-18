const express = require('express');
const db = require('./db');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoints API
app.get('/api/trails', (req, res) => {
  db.all('SELECT * FROM trails', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.get('/api/trails/:id', (req, res) => {
  db.get('SELECT * FROM trails WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json(err);
    res.json(row);
  });
});

app.post('/api/trails', (req, res) => {
  const { name, description, location, difficulty } = req.body;
  db.run(
    'INSERT INTO trails (name, description, location, difficulty) VALUES (?, ?, ?, ?)',
    [name, description, location, difficulty],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/trails/:id', (req, res) => {
  const { name, description, location, difficulty } = req.body;
  db.run(
    'UPDATE trails SET name=?, description=?, location=?, difficulty=? WHERE id=?',
    [name, description, location, difficulty, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

app.delete('/api/trails/:id', (req, res) => {
  db.run('DELETE FROM trails WHERE id=?', [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
