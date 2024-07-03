import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('memos')
            .select('*');

        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json(data);
        }
    } else if (req.method === 'POST') {
        const { title, content } = req.body;
        const { data, error } = await supabase
            .from('memos')
            .insert([{ title, content }]);

        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(201).json(data[0]);
        }
    } else if (req.method === 'PUT') {
        const { id } = req.query;
        const { title, content } = req.body;
        const { data, error } = await supabase
            .from('memos')
            .update({ title, content })
            .eq('id', id);

        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json(data[0]);
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        const { data, error } = await supabase
            .from('memos')
            .delete()
            .eq('id', id);

        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(204).end();
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
