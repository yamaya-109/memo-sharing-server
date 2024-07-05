const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Supabaseクライアントの初期化
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// メモの取得
app.get('/api/memos', async (req, res) => {
    const { data, error } = await supabase.from('memos').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// メモの追加
app.post('/api/memos', async (req, res) => {
    const { title, content } = req.body;
    const { data, error } = await supabase.from('memos').insert([{ title, content }]);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// メモの更新
app.put('/api/memos', async (req, res) => {
    const { id, title, content } = req.body;
    const { data, error } = await supabase
        .from('memos')
        .update({ title, content })
        .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// メモの削除
app.delete('/api/memos', async (req, res) => {
    const { id } = req.query;
    const { data, error } = await supabase.from('memos').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
