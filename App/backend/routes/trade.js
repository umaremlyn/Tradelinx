const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// POST /marketplace/trades - Initiate a trade (buyer requests to buy a product)
router.post('/trades', async (req, res) => {
  const { buyerId, productId, quantity, message } = req.body;
  if (!buyerId || !productId || !quantity) {
    return res.status(400).json({ error: 'buyerId, productId, and quantity are required.' });
  }
  // Insert trade request into DB (table: trades)
  const { data, error } = await supabase.from('trades').insert([
    {
      buyer_id: buyerId,
      product_id: productId,
      quantity: parseInt(quantity),
      message: message || '',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Trade initiated.', trade: data[0] });
});

// GET /marketplace/trades/:id - Get trade details
router.get('/trades/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('trades').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Trade not found.' });
  res.json({ trade: data });
});

// POST /marketplace/trades/:id/mark-paid - Mark trade as paid (escrow simulation)
router.post('/trades/:id/mark-paid', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('trades')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Trade marked as paid.', trade: data[0] });
});

// POST /marketplace/trades/:id/request-escrow - Request escrow for a trade
router.post('/trades/:id/request-escrow', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('trades')
    .update({ status: 'escrow_requested', escrow_requested_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Escrow requested.', trade: data[0] });
});

module.exports = router;
