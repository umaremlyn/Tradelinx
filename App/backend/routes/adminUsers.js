const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// GET /admin/messages - List all conversations/messages (optionally filter by flagged)
router.get('/messages', async (req, res) => {
  const { flagged } = req.query;
  let query = supabase.from('messages').select('*');
  if (flagged === 'true') query = query.eq('flagged', true);
  const { data, error } = await query.order('sent_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ messages: data });
});

// POST /admin/messages/:id/flag - Flag a message for review
router.post('/messages/:id/flag', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('messages')
    .update({ flagged: true })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Message flagged.', messageData: data[0] });
});

// GET /admin/users - List all users (optionally filter by role or flagged)
router.get('/users', async (req, res) => {
  const { role, flagged } = req.query;
  let query = supabase.from('users').select('*');
  if (role) query = query.eq('role', role);
  if (flagged === 'true') query = query.eq('flagged', true);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ users: data });
});

// POST /admin/users/:id/flag - Flag a user account
router.post('/users/:id/flag', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('users')
    .update({ flagged: true })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'User flagged.', user: data[0] });
});

// POST /admin/users/:id/role - Change a user's role
router.post('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'Role is required.' });
  const { data, error } = await supabase.from('users')
    .update({ role })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'User role updated.', user: data[0] });
});

module.exports = router;
