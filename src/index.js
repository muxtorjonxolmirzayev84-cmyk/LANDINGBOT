// Asosiy ishga tushirish fayli: API server + Telegram bot
const express = require('express');
const cors = require('cors');
const config = require('./config/default');
const { prisma, connectDB, disconnectDB } = require('./database/connection');
const { bot, launchBot, stopBot } = require('./core/bot');
const registerBotRoutes = require('./routes/bot.routes');
const clientRoutes = require('./routes/client.routes');
const adminRoutes = require('./routes/admin.routes');
const { seedIfEmpty, syncSeedImages, addNewProducts } = require('../prisma/seed');

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rasmlar
app.use('/images', express.static(config.paths.images, { maxAge: '7d' }));
app.use('/uploads', express.static(config.paths.uploads, { maxAge: '7d' }));

// API
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Topilmadi' }));

// Serverda: tayyor (build qilingan) Mini App va Admin Panel shu yerdan beriladi
const path = require('path');
const fs = require('fs');
const miniDist = path.join(config.rootDir, 'miniapp', 'dist');
const adminDist = path.join(config.rootDir, 'admin', 'dist');
if (fs.existsSync(adminDist)) {
  app.use('/admin', express.static(adminDist));
  app.get(/^\/admin(\/.*)?$/, (req, res) => res.sendFile(path.join(adminDist, 'index.html')));
}
if (fs.existsSync(miniDist)) {
  app.use(express.static(miniDist));
  app.get(/^\/(?!api\/|images\/|uploads\/).*/, (req, res) => res.sendFile(path.join(miniDist, 'index.html')));
}

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html><meta charset="utf-8"><title>Pizza API</title>
  <body style="font-family:system-ui;padding:40px;line-height:1.6">
  <h2>🍕 Pizza API ishlayapti</h2>
  <p>Mini App: <a href="http://localhost:${config.miniAppPort}">http://localhost:${config.miniAppPort}</a><br>
  Admin Panel: <a href="http://localhost:5174">http://localhost:5174</a></p></body>`);
});

// Xatolarni ushlash
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err?.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Rasm hajmi 5 MB dan oshmasligi kerak' });
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: "Noto'g'ri so'rov" });
  if (err?.code === 'P2025') return res.status(404).json({ error: "Ma'lumot topilmadi" });
  if (err?.code === 'P2021' || err?.code === 'P2022') {
    return res.status(500).json({ error: "Bazada jadvallar yo'q. Terminalda «npm run db:setup» ni bajaring." });
  }
  if (err?.name === 'PrismaClientValidationError') return res.status(400).json({ error: "Noto'g'ri ma'lumot" });
  if (err?.name === 'PrismaClientInitializationError' || err?.code === 'P1001') {
    return res.status(503).json({ error: "Bazaga ulanib bo'lmadi. Internetni tekshiring." });
  }
  if (err?.status && err.status < 500) return res.status(err.status).json({ error: err.message });
  console.error('❌ Server xatosi:', err);
  res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
});

async function main() {
  console.log('\n🍕 Pizza loyihasi ishga tushmoqda...\n');

  try {
    await connectDB();
    const added = await seedIfEmpty(prisma);
    if (added) console.log(`🍕 Baza bo'sh edi — ${added} ta pizza qo'shildi`);
    const fixed = await syncSeedImages(prisma);
    if (fixed) console.log(`🖼️  ${fixed} ta pizzaning rasmi haqiqiy suratga almashtirildi`);
    const fresh = await addNewProducts(prisma);
    if (fresh) console.log(`🆕 Menyuga ${fresh} ta yangi mahsulot qo'shildi`);
  } catch (err) {
    if (err?.code === 'P2021') {
      console.error("❌ Bazada jadvallar yo'q. Avval terminalda: npm run db:setup");
    } else {
      console.error("❌ Bazaga ulanib bo'lmadi:", err.message);
      console.error("   .env faylidagi DATABASE_URL ni va internetni tekshiring.");
    }
  }

  const server = app.listen(config.port, (err) => {
    if (err) return;
    console.log(`🚀 API server: http://localhost:${config.port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ ${config.port}-port band. Boshqa terminal oynasida loyiha allaqachon ishlayapti.`);
      process.exit(1);
    }
    throw err;
  });

  registerBotRoutes(bot);
  await launchBot();
}

async function shutdown(signal) {
  console.log(`\n👋 To'xtatilmoqda (${signal})...`);
  stopBot(signal);
  await disconnectDB();
  process.exit(0);
}
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

main();
