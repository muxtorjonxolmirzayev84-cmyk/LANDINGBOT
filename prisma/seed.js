// Boshlang'ich pizzalar. Baza bo'sh bo'lsa, avtomatik yoziladi.
// Qo'lda ishga tushirish: npm run db:seed
//
// Rasmlar: Unsplash'dagi haqiqiy pizza suratlari (bepul litsenziya, mualliflar RASMLAR.md da).
// O'z suratlaringizni Admin Panel → Mahsulotlar → Tahrirlash → «Rasm yuklash» orqali qo'yasiz.

const fs = require('fs');
const path = require('path');

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=900&q=75`;

const PIZZAS = [
  {
    name: 'Margarita',
    description: "Klassik italyan pizzasi: suvli pomidor sousi, cho'ziluvchan mozzarella va xushbo'y rayhon.",
    ingredients: ['Pomidor sousi', "Mozzarella pishlog'i", 'Yangi rayhon', 'Zaytun moyi'],
    imageUrl: photo('1604068549290-dea0e4a305ca'),
    oldPrice: 75000,
    newPrice: 59000,
    category: 'Klassik',
  },
  {
    name: 'Peperoni',
    description: "Achchiqroq peperoni kolbasasi va qalin mozzarella qatlami — eng sevimli tanlov.",
    ingredients: ['Pomidor sousi', 'Mozzarella', 'Peperoni kolbasasi', 'Oregano'],
    imageUrl: photo('1692737580547-b45bb4a02356'),
    oldPrice: 89000,
    newPrice: 69000,
    category: "Go'shtli",
  },
  {
    name: 'Qazi pizza',
    description: "Milliy ta'm: mazali qazi bo'laklari, qizil piyoz va yangi ko'katlar bilan.",
    ingredients: ['Pomidor sousi', 'Mozzarella', 'Qazi', 'Qizil piyoz', "Ko'katlar"],
    imageUrl: photo('1655673654158-9f7285b7d1ea'),
    oldPrice: 105000,
    newPrice: 85000,
    category: 'Milliy',
  },
  {
    name: 'Pishloqli',
    description: "To'rt xil pishloq uyg'unligi: mozzarella, chedder, parmezan va dor blyu.",
    ingredients: ['Qaymoqli sous', 'Mozzarella', 'Chedder', 'Parmezan', 'Dor blyu'],
    imageUrl: photo('1732223229355-95a1433404bf'),
    oldPrice: 95000,
    newPrice: 75000,
    category: 'Klassik',
  },
  // --- 2-to'plam: menyuga qo'shilgan yangi mahsulotlar ---
  {
    name: "Go'shtli ziyofat",
    description: "To'rt xil go'sht bir pizzada: mol go'shti, tovuq, peperoni va dudlangan kolbasa.",
    ingredients: ['Pomidor sousi', 'Mozzarella', "Mol go'shti", 'Tovuq filesi', 'Peperoni', 'Dudlangan kolbasa'],
    imageUrl: photo('1628840042765-356cda07504e'),
    oldPrice: 125000,
    newPrice: 99000,
    category: "Go'shtli",
  },
  {
    name: 'Tovuqli BBQ',
    description: 'Barbekyu sousidagi tovuq filesi, qizil piyoz va shirin qalampir.',
    ingredients: ['BBQ sous', 'Mozzarella', 'Tovuq filesi', 'Qizil piyoz', 'Shirin qalampir'],
    imageUrl: photo('1619740455993-9e612b1af08a'),
    oldPrice: 105000,
    newPrice: 85000,
    category: "Go'shtli",
  },
  {
    name: 'Sabzavotli',
    description: "Yengil va yangi: rangli qalampir, zaytun, pomidor va bodring turshisi.",
    ingredients: ['Pomidor sousi', 'Mozzarella', 'Shirin qalampir', 'Zaytun', 'Pomidor', 'Makkajo\'xori'],
    imageUrl: photo('1552539618-7eec9b4d1796'),
    oldPrice: 85000,
    newPrice: 69000,
    category: 'Klassik',
  },
  {
    name: 'Gavayi',
    description: "Tovuq va ananas uyg'unligi — shirin va sho'rning mashhur juftligi.",
    ingredients: ['Pomidor sousi', 'Mozzarella', 'Tovuq filesi', 'Ananas'],
    imageUrl: photo('1565299624946-b28f40a0ae38'),
    oldPrice: 95000,
    newPrice: 79000,
    category: 'Klassik',
  },
  {
    name: 'Ismaloqli oq pizza',
    description: 'Pomidor sousisiz: qaymoqli asos, yangi ismaloq va yumshoq rikotta.',
    ingredients: ['Qaymoqli sous', 'Mozzarella', 'Ismaloq', 'Rikotta', 'Sarimsoq'],
    imageUrl: photo('1593560708920-61dd98c46a4e'),
    oldPrice: 99000,
    newPrice: 79000,
    category: 'Klassik',
  },
  {
    name: 'Tandir samsa',
    description: "Tandirda pishgan qatlama samsa: suvli go'sht va piyoz. Donasi.",
    ingredients: ['Qatlama xamir', "Mol go'shti", 'Piyoz', 'Ziravorlar'],
    imageUrl: photo('1601050690597-df0568f70950'),
    oldPrice: null,
    newPrice: 15000,
    category: 'Milliy',
  },
  {
    name: 'Fri kartoshka',
    description: "Tashqarisi qarsildoq, ichi yumshoq. Ketchup bilan beriladi.",
    ingredients: ['Kartoshka', "Dengiz tuzi", 'Ketchup'],
    imageUrl: photo('1576107232684-1279f390859f'),
    oldPrice: 25000,
    newPrice: 19000,
    category: "Qo'shimcha",
  },
  {
    name: 'Tovuq qanotchalari',
    description: '8 dona achchiqroq qanotcha, sarimsoqli sous bilan.',
    ingredients: ['Tovuq qanotchalari', 'Achchiq sous', 'Sarimsoqli sous'],
    imageUrl: photo('1608039755401-742074f0548d'),
    oldPrice: 55000,
    newPrice: 45000,
    category: "Qo'shimcha",
  },
];

// Menyu versiyasi. Yangi mahsulot qo'shsangiz, bu raqamni bittaga oshiring —
// server keyingi ishga tushganda faqat yangilarini qo'shadi.
const CATALOG_VERSION = 2;

async function seedIfEmpty(prisma) {
  const count = await prisma.product.count();
  if (count > 0) return 0;
  await prisma.product.createMany({ data: PIZZAS });
  return PIZZAS.length;
}

/**
 * Eski chizma rasmlardan (/images/*.svg) haqiqiy suratlarga bir martalik o'tkazish.
 * Admin o'zi yuklagan yoki o'zgartirgan rasmlarga tegmaydi.
 */
async function syncSeedImages(prisma) {
  let updated = 0;
  for (const pizza of PIZZAS) {
    const rows = await prisma.product.findMany({ where: { name: pizza.name } });
    for (const row of rows) {
      if (/^\/images\/.+\.svg$/.test(row.imageUrl || '')) {
        await prisma.product.update({ where: { id: row.id }, data: { imageUrl: pizza.imageUrl } });
        updated += 1;
      }
    }
  }
  return updated;
}

/**
 * Menyuga yangi mahsulotlarni bir marta qo'shadi.
 * Marker fayl tufayli faqat bir marta ishlaydi — admin o'chirgan mahsulot qaytib kelmaydi.
 */
async function addNewProducts(prisma) {
  const marker = path.join(__dirname, `.catalog-v${CATALOG_VERSION}`);
  if (fs.existsSync(marker)) return 0;

  const total = await prisma.product.count();
  if (total === 0) {
    // Baza bo'sh bo'lsa seedIfEmpty hammasini yozadi — qayta qo'shish shart emas.
    fs.writeFileSync(marker, new Date().toISOString());
    return 0;
  }

  const existing = new Set((await prisma.product.findMany({ select: { name: true } })).map((p) => p.name));
  const missing = PIZZAS.filter((p) => !existing.has(p.name));
  if (missing.length) await prisma.product.createMany({ data: missing });

  fs.writeFileSync(marker, new Date().toISOString());
  return missing.length;
}

module.exports = { PIZZAS, CATALOG_VERSION, seedIfEmpty, syncSeedImages, addNewProducts };

if (require.main === module) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  seedIfEmpty(prisma)
    .then(async (n) => {
      console.log(n ? `✅ ${n} ta pizza bazaga qo'shildi` : "ℹ️  Bazada mahsulotlar allaqachon bor — seed o'tkazib yuborildi");
      const fixed = await syncSeedImages(prisma);
      if (fixed) console.log(`🖼️  ${fixed} ta pizzaning rasmi haqiqiy suratga almashtirildi`);
      const fresh = await addNewProducts(prisma);
      if (fresh) console.log(`🆕 Menyuga ${fresh} ta yangi mahsulot qo'shildi`);
    })
    .catch((err) => {
      console.error('❌ Seed xatosi:', err.message);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
