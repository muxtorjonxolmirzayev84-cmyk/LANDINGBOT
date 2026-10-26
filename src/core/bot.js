// Bot instansiyasini yaratish va ishga tushirish
const fs = require('fs');
const path = require('path');
const { Telegraf } = require('telegraf');
const config = require('../config/default');

const bot = new Telegraf(config.bot.token || '0:missing-token', { handlerTimeout: 30_000 });

let webAppUrl = config.webAppUrl || '';
let watcherTimer = null;

function getWebAppUrl() {
  return webAppUrl;
}

/** Bot menyusidagi tugmani Mini App'ga ulaydi */
async function applyMenuButton(url) {
  await bot.telegram.callApi('setChatMenuButton', {
    menu_button: { type: 'web_app', text: '🍕 Menyu', web_app: { url } },
  });
}

async function setWebAppUrl(url) {
  if (!url || url === webAppUrl) return;
  webAppUrl = url;
  try {
    await applyMenuButton(url);
    console.log(`🔗 Mini App botga ulandi: ${url}`);
  } catch (err) {
    console.warn('⚠️  Menyu tugmasini sozlab bo\'lmadi:', err.message);
  }
}

/**
 * Tunnel dasturi (cloudflared yoki boshqa) manzilni shu faylga yozadi:
 * loyiha papkasidagi tunnel-url.txt
 */
function detectTunnelFile() {
  try {
    const file = path.join(config.rootDir, 'tunnel-url.txt');
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, 'utf8').trim();
    return /^https:\/\/[^\s/]+/.test(raw) ? raw.replace(/\/+$/, '') : null;
  } catch {
    return null;
  }
}

/** ngrok ishlayotgan bo'lsa, uning https manzilini topadi */
async function detectNgrokUrl() {
  try {
    const res = await fetch(config.ngrokApiUrl, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return null;
    const data = await res.json();
    const tunnels = (data.tunnels || []).filter((t) => String(t.public_url || '').startsWith('https://'));
    if (!tunnels.length) return null;
    const preferred =
      tunnels.find((t) => String(t.config?.addr || '').endsWith(`:${config.miniAppPort}`)) || tunnels[0];
    return preferred.public_url.replace(/\/+$/, '');
  } catch {
    return null;
  }
}

function startWebAppUrlWatcher() {
  if (config.webAppUrl) {
    applyMenuButton(config.webAppUrl)
      .then(() => console.log(`🔗 Mini App botga ulandi: ${config.webAppUrl}`))
      .catch((err) => console.warn("⚠️  Menyu tugmasini sozlab bo'lmadi:", err.message));
    return;
  }

  let warned = false;
  const tick = async () => {
    const url = detectTunnelFile() || (await detectNgrokUrl());
    if (url) {
      warned = false;
      await setWebAppUrl(url);
    } else if (!warned && !webAppUrl) {
      warned = true;
      console.log('⏳ Tunnel topilmadi. Mini App\'ni ulash uchun "0-HAMMASI" faylini oching.');
    }
  };
  tick();
  watcherTimer = setInterval(tick, 10_000);
}

async function launchBot() {
  if (!config.bot.token) {
    console.error('❌ BOT_TOKEN .env faylida yozilmagan. Bot ishga tushmadi.');
    return;
  }
  try {
    const me = await bot.telegram.getMe();
    bot.botInfo = me;
    await bot.telegram
      .callApi('setMyCommands', {
        commands: [
          { command: 'start', description: 'Botni ishga tushirish' },
          { command: 'menu', description: 'Pizza buyurtma qilish' },
        ],
      })
      .catch(() => {});
    startWebAppUrlWatcher();
    bot.launch({ dropPendingUpdates: true }).catch(handleLaunchError);
    console.log(`🤖 Bot ishga tushdi: https://t.me/${me.username}`);
  } catch (err) {
    handleLaunchError(err);
  }
}

function handleLaunchError(err) {
  const code = err?.response?.error_code;
  if (code === 401) console.error("❌ BOT_TOKEN noto'g'ri. BotFather'dan olingan tokenni .env fayliga qayta yozing.");
  else if (code === 409) console.error('❌ Bu bot boshqa joyda ham ishlayapti. Boshqa terminal oynalarini yoping.');
  else console.error("❌ Botni ishga tushirib bo'lmadi:", err?.message || err);
}

function stopBot(reason = 'stop') {
  if (watcherTimer) clearInterval(watcherTimer);
  try {
    bot.stop(reason);
  } catch {
    /* bot ishlamayotgan bo'lsa */
  }
}

module.exports = { bot, launchBot, stopBot, getWebAppUrl };
