// Admin Panel uchun API (CRUD)
const Product = require('../models/Product');
const Order = require('../models/Order');
const { makeAdminToken, checkAdminPassword } = require('../middlewares/auth.middleware');

async function login(req, res) {
  const { password } = req.body || {};
  if (!password || !checkAdminPassword(password)) {
    return res.status(401).json({ error: "Parol noto'g'ri" });
  }
  res.json({ token: makeAdminToken() });
}

// ---------- Buyurtmalar ----------

async function listOrders(req, res) {
  const orders = await Order.findAll({ status: req.query.status });
  res.json({ orders });
}

async function updateOrderStatus(req, res) {
  const { status } = req.body || {};
  if (!Order.STATUSES.includes(status)) {
    return res.status(400).json({ error: "Noto'g'ri holat" });
  }
  const order = await Order.updateStatus(req.params.id, status);
  res.json({ order });
}

// ---------- Mahsulotlar ----------

function toPrice(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Math.round(Number(String(value).replace(/\s/g, '')));
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

function parseProduct(body = {}) {
  const errors = [];
  const name = String(body.name || '').trim().slice(0, 100);
  if (!name) errors.push('Pizza nomini kiriting');

  const newPrice = toPrice(body.newPrice);
  if (!newPrice || Number.isNaN(newPrice)) errors.push("Yangi narxni to'g'ri kiriting");

  const oldPrice = toPrice(body.oldPrice);
  if (Number.isNaN(oldPrice)) errors.push("Eski narxni to'g'ri kiriting");

  let ingredients = body.ingredients;
  if (typeof ingredients === 'string') ingredients = ingredients.split(/[,\n]/);
  ingredients = Array.isArray(ingredients)
    ? ingredients.map((s) => String(s).trim()).filter(Boolean).slice(0, 30)
    : [];

  const data = {
    name,
    description: String(body.description || '').trim().slice(0, 1000),
    ingredients,
    imageUrl: String(body.imageUrl || '').trim().slice(0, 1000) || '/images/pizza-default.svg',
    category: String(body.category || '').trim().slice(0, 50) || 'Boshqa',
    newPrice,
    oldPrice: oldPrice || null,
  };
  return { data, errors };
}

async function listProducts(req, res) {
  const products = await Product.findAll();
  res.json({ products });
}

async function createProduct(req, res) {
  const { data, errors } = parseProduct(req.body);
  if (errors.length) return res.status(400).json({ error: errors[0] });
  const product = await Product.create(data);
  res.status(201).json({ product });
}

async function updateProduct(req, res) {
  const { data, errors } = parseProduct(req.body);
  if (errors.length) return res.status(400).json({ error: errors[0] });
  const product = await Product.update(req.params.id, data);
  res.json({ product });
}

async function deleteProduct(req, res) {
  await Product.remove(req.params.id);
  res.json({ ok: true });
}

function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Rasm tanlanmadi' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
}

module.exports = {
  login,
  listOrders,
  updateOrderStatus,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
