// PostgreSQL (Prisma) ulanishi
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

async function connectDB() {
  await prisma.$connect();
  console.log('✅ Bazaga ulandi (PostgreSQL)');
}

async function disconnectDB() {
  try {
    await prisma.$disconnect();
  } catch {
    /* ignore */
  }
}

module.exports = { prisma, connectDB, disconnectDB };
