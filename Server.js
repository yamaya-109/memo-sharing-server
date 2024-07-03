// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const db = new sqlite3.Database('./memo_sharing.db');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/memos', (req, res) => {
    db.all('SELECT * FROM memos', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/memos', (req, res) => {
    const { title, content } = req.body;
    db.run('INSERT INTO memos (title, content) VALUES (?, ?)', [title, content], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, title, content });
    });
});

app.put('/memos/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    db.run('UPDATE memos SET title = ?, content = ? WHERE id = ?', [title, content, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id, title, content });
    });
});

app.delete('/memos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM memos WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(204).send();
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
