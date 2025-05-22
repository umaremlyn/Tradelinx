const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads (store in memory for Supabase upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /onboarding/supplier - Supplier onboarding (business name, docs, licenses)
router.post('/supplier', upload.fields([
  { name: 'cacCertificate', maxCount: 1 },
  { name: 'licenses', maxCount: 5 }
]), async (req, res) => {
  const { userId, businessName, regulated } = req.body;
  if (!userId || !businessName) {
    return res.status(400).json({ error: 'userId and businessName are required.' });
  }
  // Upload CAC certificate to Supabase Storage
  let cacUrl = null;
  if (req.files['cacCertificate']) {
    const file = req.files['cacCertificate'][0];
    const { data, error } = await supabase.storage.from('documents').upload(
      `cac/${userId}_${Date.now()}${path.extname(file.originalname)}`,
      file.buffer,
      { contentType: file.mimetype }
    );
    if (error) return res.status(500).json({ error: error.message });
    cacUrl = data.path;
  }
  // Upload licenses if regulated
  let licenseUrls = [];
  if (regulated && req.files['licenses']) {
    for (const file of req.files['licenses']) {
      const { data, error } = await supabase.storage.from('documents').upload(
        `licenses/${userId}_${Date.now()}${path.extname(file.originalname)}`,
        file.buffer,
        { contentType: file.mimetype }
      );
      if (error) return res.status(500).json({ error: error.message });
      licenseUrls.push(data.path);
    }
  }
  // Insert onboarding application into DB (table: supplier_applications)
  const { data, error } = await supabase.from('supplier_applications').insert([
    {
      user_id: userId,
      business_name: businessName,
      cac_certificate_url: cacUrl,
      license_urls: licenseUrls,
      regulated: !!regulated,
      status: 'pending',
      submitted_at: new Date().toISOString()
    }
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Application submitted for review.' });
});

module.exports = router;
