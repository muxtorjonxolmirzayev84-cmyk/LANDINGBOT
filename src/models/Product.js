// Mahsulotlar (pizzalar) bilan ishlash (Prisma)
const { prisma } = require('../database/connection');

function findAll() {
  return prisma.product.findMany({ orderBy: { id: 'asc' } });
}

function findById(id) {
  return prisma.product.findUnique({ where: { id: Number(id) } });
}

function findManyByIds(ids) {
  return prisma.product.findMany({ where: { id: { in: ids.map(Number) } } });
}

function create(data) {
  return prisma.product.create({ data });
}

function update(id, data) {
  return prisma.product.update({ where: { id: Number(id) }, data });
}

function remove(id) {
  return prisma.product.delete({ where: { id: Number(id) } });
}

function count() {
  return prisma.product.count();
}

async function categories() {
  const rows = await prisma.product.findMany({
    distinct: ['category'],
    select: { category: true },
    orderBy: { category: 'asc' },
  });
  return rows.map((r) => r.category).filter(Boolean);
}

module.exports = { findAll, findById, findManyByIds, create, update, remove, count, categories };
