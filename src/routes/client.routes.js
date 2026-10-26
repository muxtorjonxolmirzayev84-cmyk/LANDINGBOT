// Mini App uchun API yo'llari: /api/client/...
const express = require('express');
const cart = require('../controllers/cartController');
const { telegramAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/products', cart.getProducts);
router.get('/config', cart.getConfig);
router.get('/me', telegramAuth, cart.getMe);
router.get('/orders', telegramAuth, cart.getMyOrders);
router.post('/orders', telegramAuth, cart.createOrder);

module.exports = router;
