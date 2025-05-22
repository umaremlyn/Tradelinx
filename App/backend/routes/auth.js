const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, role, businessName } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required.' });
  }
  // Sign up user in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { role, businessName }
  });
  if (error) return res.status(400).json({ error: error.message });
  // Optionally, insert user profile in a separate table
  res.status(201).json({ user: data.user });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  // Client should handle token removal; this is a placeholder
  res.json({ message: 'Logged out (client should remove token).' });
});

module.exports = router;
