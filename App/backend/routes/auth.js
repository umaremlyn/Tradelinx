const express = require('express');
const router = express.Router();
const { supabaseAnon, supabaseAdmin } = require('../config/supabaseClient');

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, role, name, phone, address, businessName } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required.' });
  }
  // Use businessName if provided, else fallback to name
  const profileName = businessName || name || '';
  // Sign up user in Supabase Auth (public signup)
  const { data, error } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        name: profileName,
        phone: phone || '',
        address: address || ''
      }
    }
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ user: data.user });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  // Client should handle token removal; this is a placeholder
  res.json({ message: 'Logged out (client should remove token).' });
});

module.exports = router;
