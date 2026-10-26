// Admin Panel API yo'llari: /api/admin/...
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const config = require('../config/default');
const admin = require('../controllers/adminController');
const { adminLocalOnly, adminAuth } = require('../middlewares/auth.middleware');

fs.mkdirSync(config.paths.uploads, { recursive: true });

const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, config.paths.uploads),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ALLOWED[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    const err = new Error('Faqat JPG, PNG, WEBP yoki GIF rasm yuklash mumkin');
    err.status = 400;
    cb(err);
  },
});

const router = express.Router();

router.use(adminLocalOnly);
router.post('/login', admin.login);

router.use(adminAuth);
router.get('/orders', admin.listOrders);
router.patch('/orders/:id/status', admin.updateOrderStatus);

router.get('/products', admin.listProducts);
router.post('/products', admin.createProduct);
router.put('/products/:id', admin.updateProduct);
router.delete('/products/:id', admin.deleteProduct);

router.post('/upload', upload.single('image'), admin.uploadImage);

module.exports = router;
