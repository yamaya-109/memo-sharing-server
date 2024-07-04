require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all memos
app.get('/api/memos', async (req, res) => {
    const { data, error } = await supabase
        .from('memos')
        .select('*');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
});

// Add a new memo
app.post('/api/memos', async (req, res) => {
    const { title, content } = req.body;
    const { data, error } = await supabase
        .from('memos')
        .insert([{ title, content }]);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
});

// Update a memo
app.put('/api/memos', async (req, res) => {
    const { id, title, content } = req.body;
    const { data, error } = await supabase
        .from('memos')
        .update({ title, content })
        .eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
});

// Delete a memo
app.delete('/api/memos', async (req, res) => {
    const { id } = req.query;
    const { data, error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
