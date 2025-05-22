const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// POST /marketplace/messages - Send a message (buyer to supplier or vice versa)
router.post('/messages', async (req, res) => {
  const { senderId, receiverId, productId, content } = req.body;
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ error: 'senderId, receiverId, and content are required.' });
  }
  const { data, error } = await supabase.from('messages').insert([
    {
      sender_id: senderId,
      receiver_id: receiverId,
      product_id: productId || null,
      content,
      sent_at: new Date().toISOString(),
      flagged: false
    }
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Message sent.', data: data[0] });
});

// GET /marketplace/messages?user1=...&user2=... - Get conversation between two users
router.get('/messages', async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) {
    return res.status(400).json({ error: 'user1 and user2 are required.' });
  }
  const { data, error } = await supabase.from('messages')
    .select('*')
    .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`)
    .order('sent_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ messages: data });
});

module.exports = router;
