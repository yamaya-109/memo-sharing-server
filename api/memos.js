const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./memo_sharing.db');

export default function handler(req, res) {
    if (req.method === 'GET') {
        db.all('SELECT * FROM memos', (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json(rows);
        });
    } else if (req.method === 'POST') {
        const { title, content } = req.body;
        db.run('INSERT INTO memos (title, content) VALUES (?, ?)', [title, content], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID, title, content });
        });
    } else if (req.method === 'PUT') {
        const { id } = req.query;
        const { title, content } = req.body;
        db.run('UPDATE memos SET title = ?, content = ? WHERE id = ?', [title, content, id], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json({ id, title, content });
        });
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        db.run('DELETE FROM memos WHERE id = ?', id, function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(204).end();
        });
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
