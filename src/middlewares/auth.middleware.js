// Validatsiya: Telegram Mini App ma'lumotlari va Admin Panel kirishi
const crypto = require('crypto');
const config = require('../config/default');

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a || ''));
  const bufB = Buffer.from(String(b || ''));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

/** So'rov shu kompyuterning o'zidan (ngrok orqali emas) kelganini tekshiradi */
function isLocalRequest(req) {
  const host = String(req.headers.host || '').toLowerCase();
  const hostname = host.startsWith('[') ? host.slice(0, host.indexOf(']') + 1) : host.split(':')[0];
  const isLocalHost = ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
  const forwarded = req.headers['x-forwarded-for'] || req.headers['x-forwarded-host'] || req.headers.forwarded;
  return isLocalHost && !forwarded;
}

function computeHash(params, botToken, excluded) {
  const pairs = [];
  for (const [key, value] of params.entries()) {
    if (!excluded.includes(key)) pairs.push([key, value]);
  }
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const dataCheckString = pairs.map(([k, v]) => `${k}=${v}`).join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  return crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
}

/** Telegram WebApp initData imzosini tekshiradi (rasmiy algoritm) */
function validateInitData(initData, botToken = config.bot.token) {
  if (!initData || !botToken) return { ok: false, reason: 'empty' };
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return { ok: false, reason: 'no-hash' };

  const valid =
    safeEqual(computeHash(params, botToken, ['hash']), hash) ||
    safeEqual(computeHash(params, botToken, ['hash', 'signature']), hash);
  if (!valid) return { ok: false, reason: 'bad-hash' };

  const authDate = Number(params.get('auth_date') || 0);
  if (!authDate || Date.now() / 1000 - authDate > config.initDataMaxAge) return { ok: false, reason: 'expired' };

  let user = null;
  try {
    user = JSON.parse(params.get('user') || 'null');
  } catch {
    user = null;
  }
  if (!user || !user.id) return { ok: false, reason: 'no-user' };
  return { ok: true, user };
}

/** Mini App so'rovlari uchun: mijozni aniqlaydi (req.tgUser) */
function telegramAuth(req, res, next) {
  const initData = req.get('x-telegram-init-data') || '';

  if (initData) {
    const result = validateInitData(initData);
    if (!result.ok) {
      const msg =
        result.reason === 'expired'
          ? "Sessiya eskirgan. Ilovani yopib, qayta oching."
          : "Telegram ma'lumotlari tasdiqlanmadi. Ilovani bot orqali qayta oching.";
      return res.status(401).json({ error: msg });
    }
    req.tgUser = result.user;
    return next();
  }

  // Brauzerda localhost'da sinash rejimi
  if (config.devLogin && config.bot.ownerId && isLocalRequest(req)) {
    req.tgUser = { id: Number(config.bot.ownerId), first_name: 'Test', username: null, isDev: true };
    return next();
  }

  return res.status(401).json({ error: 'Iltimos, ilovani Telegram bot orqali oching.' });
}

/** Admin panel tokeni (paroldan hosil qilinadi) */
function makeAdminToken() {
  return crypto
    .createHmac('sha256', `pizza-admin:${config.bot.token}`)
    .update(config.admin.password)
    .digest('hex');
}

function checkAdminPassword(password) {
  return safeEqual(password, config.admin.password);
}

/** Admin panel faqat shu kompyuterdan ochiladi */
function adminLocalOnly(req, res, next) {
  if (config.admin.allowRemote || isLocalRequest(req)) return next();
  return res.status(403).json({ error: 'Admin panel faqat shu kompyuterdan (localhost) ochiladi.' });
}

function adminAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token && safeEqual(token, makeAdminToken())) return next();
  return res.status(401).json({ error: 'Avval admin panelga kiring.' });
}

module.exports = {
  validateInitData,
  telegramAuth,
  isLocalRequest,
  makeAdminToken,
  checkAdminPassword,
  adminLocalOnly,
  adminAuth,
};
