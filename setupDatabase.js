// setupDatabase.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./memo_sharing.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
});

db.close();
