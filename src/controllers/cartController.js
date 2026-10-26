// Mijoz (Mini App) API
const config = require('../config/default');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { sendOrderConfirmation } = require('./botController');

const MAX_QTY = 50;

function publicUser(user) {
  if (!user) return null;
  return { id: user.id, telegramId: user.telegramId, name: user.name, username: user.username, phone: user.phone };
}

async function getProducts(req, res) {
  const products = await Product.findAll();
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  res.json({ products, categories });
}

function getConfig(req, res) {
  res.json({ upsell: config.upsell });
}

async function getMe(req, res) {
  const user = await User.upsertFromTelegram(req.tgUser);
  res.json({ user: publicUser(user) });
}

async function getMyOrders(req, res) {
  const user = await User.findByTelegramId(req.tgUser.id);
  if (!user) return res.json({ orders: [] });
  const orders = await Order.findByUserId(user.id);
  res.json({ orders });
}

function toCoord(value, limit) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : null;
}

async function createOrder(req, res) {
  const { items, withUpsell, phone, address, latitude, longitude, comment } = req.body || {};

  // 1) Savatchani tekshirish
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Savatcha bo'sh" });
  }
  const qtyById = new Map();
  for (const item of items) {
    const id = Number(item?.productId);
    const qty = Math.floor(Number(item?.quantity));
    if (!Number.isInteger(id) || id <= 0 || !Number.isFinite(qty) || qty <= 0) continue;
    qtyById.set(id, Math.min(MAX_QTY, (qtyById.get(id) || 0) + qty));
  }
  if (qtyById.size === 0) return res.status(400).json({ error: "Savatcha bo'sh" });

  // 2) Narxlarni bazadan olamiz (mijoz yuborgan narxga ishonmaymiz)
  const products = await Product.findManyByIds([...qtyById.keys()]);
  if (products.length !== qtyById.size) {
    return res.status(400).json({ error: "Ba'zi mahsulotlar endi mavjud emas. Savatchani yangilang." });
  }
  const orderItems = products.map((p) => ({
    productId: p.id,
    name: p.name,
    price: p.newPrice,
    quantity: qtyById.get(p.id),
    imageUrl: p.imageUrl,
  }));
  if (withUpsell) {
    orderItems.push({
      productId: null,
      name: config.upsell.name,
      price: config.upsell.price,
      quantity: 1,
      imageUrl: config.upsell.imageUrl,
      isUpsell: true,
    });
  }
  const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // 3) Aloqa va manzil
  const cleanPhone = User.normalizePhone(phone);
  if (cleanPhone.replace(/\D/g, '').length < 9) {
    return res.status(400).json({ error: "Telefon raqamini to'g'ri kiriting" });
  }
  const lat = toCoord(latitude, 90);
  const lng = toCoord(longitude, 180);
  const hasCoords = lat !== null && lng !== null;
  const cleanAddress = String(address || '').trim().slice(0, 500);
  if (!cleanAddress && !hasCoords) {
    return res.status(400).json({ error: 'Yetkazib berish manzilini kiriting' });
  }

  // 4) Saqlash
  const user = await User.upsertFromTelegram(req.tgUser);
  await User.update(user.id, { phone: cleanPhone });

  const order = await Order.create({
    userId: user.id,
    items: orderItems,
    totalPrice,
    phone: cleanPhone,
    location: cleanAddress || `📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    latitude: hasCoords ? lat : null,
    longitude: hasCoords ? lng : null,
    comment: String(comment || '').trim().slice(0, 500) || null,
  });

  // 5) Bot orqali mijozga xabar (javobni kutib o'tirmaymiz)
  sendOrderConfirmation(req.tgUser.id, order).catch((err) =>
    console.warn(`⚠️  Mijozga xabar yuborilmadi (#${order.id}):`, err.message)
  );

  console.log(`🆕 Yangi buyurtma #${order.id} — ${order.user?.name || 'Mijoz'}, ${totalPrice} so'm`);
  res.status(201).json({ ok: true, order });
}

module.exports = { getProducts, getConfig, getMe, getMyOrders, createOrder };
