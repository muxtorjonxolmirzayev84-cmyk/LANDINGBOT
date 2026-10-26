// Onboarding slaydlari va Story'lar matni (xohlagancha o'zgartirishingiz mumkin)

export const ONBOARDING = [
  {
    title: 'Issiq pizza, eshigingizgacha',
    text: 'Tandirdan chiqqan issiqligicha yetkazamiz.',
  },
  {
    title: 'Bu qanday ishlaydi?',
    text: 'Tanlang, buyurtma bering va rohatlaning.',
  },
  {
    title: '10,000+ odam allaqachon biz bilan.',
    text: 'Endi navbat sizga: birinchi buyurtmangizni bering.',
  },
];

// Rasmlar: Unsplash (bepul litsenziya). Mualliflar RASMLAR.md faylida.
const photo = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${w}&q=75`;

// Bosh sahifadagi katta rasm va onboarding suratlari
export const HERO_PHOTO = photo('1692737580547-b45bb4a02356', 700);

export const ONBOARDING_PHOTOS = [
  photo('1692737580547-b45bb4a02356', 700),
  photo('1604068549290-dea0e4a305ca', 700),
  [
    photo('1604068549290-dea0e4a305ca', 500),
    photo('1655673654158-9f7285b7d1ea', 500),
    photo('1732223229355-95a1433404bf', 500),
    photo('1692737580547-b45bb4a02356', 500),
  ],
];

export const STORIES = [
  {
    id: 'qazi',
    title: 'Yangilik',
    image: photo('1655673654158-9f7285b7d1ea'),
    background: '#C9281D',
    headline: "Yangi ta'm: Qazi pizza",
    text: "Milliy qazi, qizil piyoz va yangi ko'katlar.",
    cta: 'Katalogni ochish',
  },
  {
    id: 'cola',
    title: 'Kola',
    image: photo('1625126590447-cb769384e1f0'),
    background: '#2B2B30',
    headline: "Kola atigi 5 000 so'm",
    text: "Savatchada bitta tugma bilan qo'shing.",
  },
  {
    id: 'cheese',
    title: 'Pishloqli',
    image: photo('1732223229355-95a1433404bf'),
    background: '#9A5800',
    headline: "To'rt xil pishloq",
    text: 'Mozzarella, chedder, parmezan va dor blyu.',
    cta: 'Katalogni ochish',
  },
  {
    id: 'margarita',
    title: 'Klassika',
    image: photo('1604068549290-dea0e4a305ca'),
    background: '#2F6B3A',
    headline: 'Margarita',
    text: "Pomidor sousi, mozzarella va yangi rayhon. Oddiy va mazali.",
    cta: 'Katalogni ochish',
  },
  {
    id: 'pepperoni',
    title: 'Peperoni',
    image: photo('1692737580547-b45bb4a02356'),
    background: '#8E1F17',
    headline: 'Peperoni',
    text: 'Achchiqroq peperoni va qalin mozzarella qatlami.',
    cta: 'Katalogni ochish',
  },
];
