// Bot logikalari
const { Markup } = require('telegraf');
const config = require('../config/default');
const { bot, getWebAppUrl } = require('../core/bot');
const User = require('../models/User');

const BTN_CONTACT = '📱 Telefon raqamni yuborish';
const BTN_MENU = '🍕 Menyu';

const formatPrice = (n) => `${String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;

function menuKeyboard() {
  const url = getWebAppUrl();
  return url ? Markup.inlineKeyboard([Markup.button.webApp('🍕 Pizza buyurtma qilish', url)]) : undefined;
}

async function sendMenu(ctx) {
  const keyboard = menuKeyboard();
  if (!keyboard) {
    return ctx.reply(
      "⏳ Mini App hozircha ulanmagan.\nAdmin kompyuterida ngrok ishga tushirilgach, pastdagi «🍕 Menyu» tugmasi ishlaydi."
    );
  }
  return ctx.reply('Mazali pizzalar sizni kutmoqda! Buyurtma berish uchun tugmani bosing 👇', keyboard);
}

async function start(ctx) {
  const user = await User.upsertFromTelegram(ctx.from);
  const name = ctx.from.first_name || "do'st";

  await ctx.reply(
    `Assalomu alaykum, ${name}! 👋\n\nBiz issiqqina pizzalarni tezkor yetkazib beramiz 🍕\nTanlang, buyurtma bering va rohatlaning!`
  );
  await sendMenu(ctx);

  if (!user.phone) {
    await ctx.reply(
      "Kuryerimiz siz bilan bog'lanishi uchun telefon raqamingizni yuboring 👇",
      Markup.keyboard([[Markup.button.contactRequest(BTN_CONTACT)]]).resize().oneTime()
    );
  }
}

async function menu(ctx) {
  await User.upsertFromTelegram(ctx.from);
  return sendMenu(ctx);
}

async function contact(ctx) {
  const c = ctx.message.contact;
  if (c.user_id && c.user_id !== ctx.from.id) {
    return ctx.reply("Iltimos, o'zingizning telefon raqamingizni yuboring.");
  }
  await User.upsertFromTelegram(ctx.from);
  await User.updatePhoneByTelegramId(ctx.from.id, c.phone_number);
  return ctx.reply('✅ Rahmat! Telefon raqamingiz saqlandi.', Markup.removeKeyboard());
}

async function help(ctx) {
  return ctx.reply(
    "Buyurtma berish uchun pastdagi «🍕 Menyu» tugmasini bosing yoki /menu buyrug'ini yuboring.\n\nSavollar bo'lsa, kuryerimiz siz bilan bog'lanadi 😊"
  );
}

async function fallback(ctx) {
  return sendMenu(ctx);
}

/** Buyurtma tasdiqlangach mijozga xabar yuboradi */
async function sendOrderConfirmation(telegramId, order) {
  const lines = (order.items || []).map(
    (i) => `• ${i.name} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`
  );
  const text = [
    config.messages.orderAccepted,
    '',
    `🧾 Buyurtma #${order.id}`,
    ...lines,
    '',
    `💰 Jami: ${formatPrice(order.totalPrice)}`,
    `📍 Manzil: ${order.location}`,
    `📞 Telefon: ${order.phone}`,
  ].join('\n');
  await bot.telegram.sendMessage(telegramId, text);
}

module.exports = {
  BTN_CONTACT,
  BTN_MENU,
  start,
  menu,
  contact,
  help,
  fallback,
  sendOrderConfirmation,
};
