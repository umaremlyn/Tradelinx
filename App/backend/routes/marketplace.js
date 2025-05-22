const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const multer = require('multer');
const path = require('path');

// Configure multer for product image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /marketplace/products - Supplier uploads a product
router.post('/products', upload.array('images', 5), async (req, res) => {
  const { userId, name, description, price } = req.body;
  if (!userId || !name || !price) {
    return res.status(400).json({ error: 'userId, name, and price are required.' });
  }
  // Upload images to Supabase Storage
  let imageUrls = [];
  if (req.files) {
    for (const file of req.files) {
      const { data, error } = await supabase.storage.from('product-images').upload(
        `products/${userId}_${Date.now()}_${file.originalname}`,
        file.buffer,
        { contentType: file.mimetype }
      );
      if (error) return res.status(500).json({ error: error.message });
      imageUrls.push(data.path);
    }
  }
  // Insert product into DB (table: products)
  const { data, error } = await supabase.from('products').insert([
    {
      user_id: userId,
      name,
      description,
      price: parseFloat(price),
      image_urls: imageUrls,
      created_at: new Date().toISOString()
    }
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Product uploaded.', product: data[0] });
});

// GET /marketplace/products - Buyers explore products
router.get('/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ products: data });
});

// GET /marketplace/products/:id - Get product details
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Product not found.' });
  res.json({ product: data });
});

module.exports = router;
