// Sozlamalar va o'zgaruvchilar (.env faylidan o'qiladi)
const path = require('path');

const fs = require('fs');

const rootDir = path.join(__dirname, '..', '..');
const envPath = path.join(rootDir, '.env');
if (!fs.existsSync(envPath) && fs.existsSync(path.join(rootDir, 'env.txt'))) {
  console.error("❌ .env fayli topilmadi. Loyiha papkasida bir marta bajaring:  ren env.txt .env");
  process.exit(1);
}
require('dotenv').config({ path: envPath, quiet: true });

const env = (key, fallback = '') => {
  const value = process.env[key];
  return value === undefined || value === null ? fallback : String(value).trim();
};

const toBool = (value, fallback = false) => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'ha', 'on'].includes(String(value).toLowerCase());
};

const config = {
  rootDir,
  port: Number(env('PORT')) || 4000,
  miniAppPort: Number(env('MINIAPP_PORT')) || 5173,

  bot: {
    token: env('BOT_TOKEN'),
    username: env('BOT_USERNAME').replace(/^@/, ''),
    ownerId: env('MY_TELEGRAM_ID'),
  },

  // Mini App'ning tashqi (https) manzili. Bo'sh bo'lsa — ngrok'dan avtomatik olinadi.
  webAppUrl: env('WEBAPP_URL').replace(/\/+$/, ''),
  ngrokApiUrl: env('NGROK_API_URL', 'http://127.0.0.1:4040/api/tunnels'),

  admin: {
    password: env('ADMIN_PASSWORD', 'admin'),
    // true bo'lsa, admin API ngrok orqali ham ochiladi (tavsiya etilmaydi)
    allowRemote: toBool(process.env.ADMIN_ALLOW_REMOTE, false),
  },

  // Telegram'siz brauzerda localhost'da sinash (MY_TELEGRAM_ID nomidan)
  devLogin: toBool(process.env.DEV_LOGIN, true),

  // Telegram initData amal qilish muddati (soniya)
  initDataMaxAge: 60 * 60 * 24,

  upsell: {
    name: env('UPSELL_NAME', 'Kola 0.5 L'),
    shortName: 'Kola',
    price: Number(env('UPSELL_PRICE')) || 5000,
    imageUrl: 'https://images.unsplash.com/photo-1625126590447-cb769384e1f0?auto=format&fit=crop&w=400&h=400&q=75',
  },

  messages: {
    orderAccepted: "Buyurtmangiz muvaffaqiyatli qabul qilindi! Kuryerimiz tez orada bog'lanadi 🍕",
  },

  paths: {
    images: path.join(rootDir, 'public', 'images'),
    uploads: path.join(rootDir, 'public', 'uploads'),
  },
};

module.exports = config;
