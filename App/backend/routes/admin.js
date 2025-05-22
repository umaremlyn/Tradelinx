const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// GET /admin/suppliers - List all supplier applications (pending, approved, rejected)
router.get('/suppliers', async (req, res) => {
  const { status } = req.query; // optional: filter by status
  let query = supabase.from('supplier_applications').select('*');
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ applications: data });
});

// POST /admin/suppliers/:id/approve - Approve a supplier application
router.post('/suppliers/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('supplier_applications')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Supplier approved.', application: data });
});

// POST /admin/suppliers/:id/reject - Reject a supplier application
router.post('/suppliers/:id/reject', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const { data, error } = await supabase.from('supplier_applications')
    .update({ status: 'rejected', rejection_reason: reason || '', reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Supplier rejected.', application: data });
});

module.exports = router;
