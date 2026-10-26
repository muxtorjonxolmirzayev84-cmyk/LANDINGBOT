// Buyurtmalar bilan ishlash (Prisma)
const { prisma } = require('../database/connection');

const STATUSES = ['KUTILMOQDA', 'YETKAZILDI'];

const userSelect = { id: true, telegramId: true, name: true, username: true, phone: true };

function create(data) {
  return prisma.order.create({ data, include: { user: { select: userSelect } } });
}

function findByUserId(userId, limit = 30) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

function findAll({ status, limit = 300 } = {}) {
  return prisma.order.findMany({
    where: status && STATUSES.includes(status) ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: userSelect } },
  });
}

function updateStatus(id, status) {
  return prisma.order.update({
    where: { id: Number(id) },
    data: { status },
    include: { user: { select: userSelect } },
  });
}

module.exports = { STATUSES, create, findByUserId, findAll, updateStatus };
