const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// POST /api/waitlist - Add email to waitlist
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required.' });
  }
  // Insert into waitlist table (create in Supabase if not exists)
  const { error } = await supabase.from('waitlist').insert([{ email, joined_at: new Date().toISOString() }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Added to waitlist.' });
});

module.exports = router;
