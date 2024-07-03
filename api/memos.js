const mysql = require('mysql2/promise');

let connection;

async function connectToDatabase() {
    if (!connection) {
        connection = await mysql.createConnection(process.env.DATABASE_URL);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS memos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
    return connection;
}

export default async function handler(req, res) {
    const conn = await connectToDatabase();

    if (req.method === 'GET') {
        const [rows] = await conn.execute('SELECT * FROM memos');
        res.status(200).json(rows);
    } else if (req.method === 'POST') {
        const { title, content } = req.body;
        const [result] = await conn.execute('INSERT INTO memos (title, content) VALUES (?, ?)', [title, content]);
        res.status(201).json({ id: result.insertId, title, content });
    } else if (req.method === 'PUT') {
        const { id } = req.query;
        const { title, content } = req.body;
        await conn.execute('UPDATE memos SET title = ?, content = ? WHERE id = ?', [title, content, id]);
        res.status(200).json({ id, title, content });
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        await conn.execute('DELETE FROM memos WHERE id = ?', [id]);
        res.status(204).end();
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
