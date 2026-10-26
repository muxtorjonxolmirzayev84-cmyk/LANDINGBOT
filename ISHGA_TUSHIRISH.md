# XMR Pizza: ishga tushirish yo'riqnomasi

## Eng oson yo'l: bitta fayl

Loyiha papkasidagi **`0-HAMMASI`** faylini ikki marta bosing. Tamom.

U o'zi hamma ishni bajaradi:
1. eski oynalarni yopadi;
2. kerak bo'lsa tunnel dasturini (cloudflared) internetdan yuklaydi;
3. Mini App uchun `https://...trycloudflare.com` manzilini oladi;
4. server, Mini App va Admin Panel'ni yoqadi;
5. manzilni botga ulaydi — Telegram'da **🍕 Menyu** tugmasi paydo bo'ladi.

Ikkita oyna ochiq qoladi: **XMR Pizza server** va **XMR Pizza tunnel**.
Ular ochiq turgancha bot ishlaydi. Kompyuterni o'chirsangiz yoki oynalarni
yopsangiz — `0-HAMMASI` ni yana bir marta bosing, xolos.

> Tunnel o'z-o'zidan uzilib qolsa, u 3 soniyada qayta ulanadi va bot yangi
> manzilni 10 soniya ichida o'zi oladi. Siz hech narsa qilishingiz shart emas.

**Telegram'da tekshirish:** @xmr_pizza_bot → `/start` → pastdagi **🍕 Menyu**.

**Admin Panel:** http://localhost:5174 — parol `.env` faylidagi `ADMIN_PASSWORD`.

---

## Loyiha nimalardan iborat

| Qism | Manzil | Vazifasi |
|---|---|---|
| Backend + Bot | http://localhost:4000 | API va Telegram bot |
| Mini App | http://localhost:5173 | Mijozlar uchun ilova (tunnel orqali Telegram'da ochiladi) |
| Admin Panel | http://localhost:5174 | Buyurtmalar va mahsulotlar |

---

## Bir martalik tayyorgarlik (allaqachon bajarilgan)

1. **Node.js**: https://nodejs.org → **LTS** → *Next → Next → Install*.
2. `env.txt` faylini `.env` nomiga o'zgartirish: papkada cmd ochib `ren env.txt .env`.
   Buni **`1-ORNATISH`** fayli ham o'zi qiladi.
3. Paketlar va baza: **`1-ORNATISH`** faylini ikki marta bosing
   (yoki cmd'da `npm run setup` va `npm run db:setup`).

`db:setup` Prisma migratsiyasini bajaradi (`User`, `Product`, `Order` jadvallari)
va 4 ta pizzani qo'shadi: Margarita, Peperoni, Qazi pizza, Pishloqli.

---

## Qo'lda ishga tushirish (agar kerak bo'lsa)

```cmd
npm run all
```

Bitta oynada uchalasi ishga tushadi: **API** (yashil), **MINIAPP** (ko'k), **ADMIN** (binafsha).
To'xtatish: **Ctrl + C**.

Mini App'ni Telegram'siz sinash: http://localhost:5173 — bu rejimda u sizning
Telegram ID'ingiz (`MY_TELEGRAM_ID`) nomidan ishlaydi.

### Doimiy manzil (ixtiyoriy)

Har safar yangi `trycloudflare.com` manzili beriladi. Bu botga xalal bermaydi —
u manzilni o'zi yangilaydi. Agar doimiy manzil xohlasangiz, `.env` fayliga
yozib qo'ying:

```
WEBAPP_URL=https://sizning-domeningiz.com
```

Shunda bot faqat shu manzilni ishlatadi, tunnel esa kerak bo'lmaydi.

### Qo'lda ulash (agar avtomatik ulanmasa)

BotFather → `/mybots` → @xmr_pizza_bot → **Bot Settings** → **Menu Button** →
manzilni yuboring → tugma nomi: `Menyu`.

---

## Pizza rasmlari

Boshlang'ich 4 ta pizzaning rasmi — internetdan olingan haqiqiy pizza suratlari
(bepul litsenziya; mualliflar `RASMLAR.md` faylida). Ular loyiha papkasida
saqlanmaydi, to'g'ridan-to'g'ri internetdan yuklanadi.

**O'z suratlaringizni qo'yish:** Admin Panel → **Mahsulotlar** → **Tahrirlash** → **Rasm yuklash**.
Shu tavsiya etiladi: o'z pizzangizning surati har qanday tayyor rasmdan yaxshiroq sotadi.

## Qanday ishlaydi

1. Mijoz botda **🍕 Menyu** ni bosadi → Mini App ochiladi.
2. Pizza tanlaydi, savatchada telefon va manzilni kiritib **Buyurtmani tasdiqlash** ni bosadi.
3. Buyurtma bazaga yoziladi, Mini App yopiladi, bot mijozga yozadi:
   *"Buyurtmangiz muvaffaqiyatli qabul qilindi! Kuryerimiz tez orada bog'lanadi 🍕"*
4. Admin Panel'da buyurtma 5 soniya ichida paydo bo'ladi va qisqa signal chalinadi.

## Tez-tez uchraydigan muammolar

| Xabar | Yechim |
|---|---|
| Menyu tugmasi yo'q | `0-HAMMASI` ni yana bir marta bosing |
| `.env fayli topilmadi` | `1-ORNATISH` faylini bosing (yoki `ren env.txt .env`) |
| `Bazada jadvallar yo'q` | `npm run db:setup` |
| `Bazaga ulanib bo'lmadi` | Internetni va `.env` dagi `DATABASE_URL` ni tekshiring |
| `4000-port band` | Loyiha boshqa oynada ishlayapti — `0-HAMMASI` eski oynalarni o'zi yopadi |
| `BOT_TOKEN noto'g'ri` | BotFather'dan yangi token olib, `.env` ga yozing |
| `running scripts is disabled` | Siz PowerShell'dasiz. Command Prompt (cmd) oching |
| `Internet manzili olinmadi` | Internetni tekshirib, `0-HAMMASI` ni qayta bosing |

## Foydali buyruqlar

| Buyruq | Vazifasi |
|---|---|
| `npm run all` | Hammasini ishga tushirish |
| `npm run dev` | Faqat backend (kod o'zgarsa o'zi qayta yuklanadi) |
| `npm run miniapp` | Faqat Mini App |
| `npm run admin` | Faqat Admin Panel |
| `npm run db:studio` | Bazani brauzerda ko'rish (Prisma Studio) |
