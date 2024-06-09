const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)");
});

app.use(bodyParser.json());
app.use(cors());

// CRUD operations
app.get('/tasks', (req, res) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;
    db.run("INSERT INTO tasks (title) VALUES (?)", [title], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, title });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tasks WHERE id = ?", id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
