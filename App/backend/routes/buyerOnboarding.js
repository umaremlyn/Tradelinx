const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// POST /onboarding/buyer - Buyer onboarding (business or legal name)
router.post('/buyer', async (req, res) => {
  const { userId, name } = req.body;
  if (!userId || !name) {
    return res.status(400).json({ error: 'userId and name are required.' });
  }
  // Insert buyer onboarding info into DB (table: buyer_profiles)
  const { data, error } = await supabase.from('buyer_profiles').insert([
    {
      user_id: userId,
      name,
      onboarded_at: new Date().toISOString()
    }
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Buyer onboarding complete.' });
});

module.exports = router;
