// Mijozlar bilan ishlash (Prisma)
const { prisma } = require('../database/connection');

function fullName(tgUser) {
  const name = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ').trim();
  return name || tgUser.username || 'Mijoz';
}

function normalizePhone(phone) {
  const raw = String(phone || '').trim();
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  return raw.startsWith('+') || digits.length >= 12 ? `+${digits}` : raw;
}

/**
 * Telegram foydalanuvchisini bazaga yozadi yoki yangilaydi.
 * isDev = true bo'lsa (localhost sinov rejimi), ismni o'zgartirmaydi.
 */
async function upsertFromTelegram(tgUser) {
  const telegramId = String(tgUser.id);
  const update = { username: tgUser.username || null };
  if (!tgUser.isDev) update.name = fullName(tgUser);

  try {
    return await prisma.user.upsert({
      where: { telegramId },
      update,
      create: { telegramId, name: fullName(tgUser), username: tgUser.username || null },
    });
  } catch (err) {
    // Bir vaqtda ikki so'rov kelib qolsa (unique to'qnashuv) — mavjudini qaytaramiz
    if (err.code === 'P2002') return prisma.user.findUnique({ where: { telegramId } });
    throw err;
  }
}

function findByTelegramId(telegramId) {
  return prisma.user.findUnique({ where: { telegramId: String(telegramId) } });
}

function updatePhoneByTelegramId(telegramId, phone) {
  return prisma.user.update({
    where: { telegramId: String(telegramId) },
    data: { phone: normalizePhone(phone) },
  });
}

function update(id, data) {
  return prisma.user.update({ where: { id }, data });
}

module.exports = {
  fullName,
  normalizePhone,
  upsertFromTelegram,
  findByTelegramId,
  updatePhoneByTelegramId,
  update,
};
