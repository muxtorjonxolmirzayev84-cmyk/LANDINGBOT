# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Customers:** Telegram users in Uzbekistan ordering pizza for delivery from inside the XMR Pizza bot, on their phones, usually while hungry and short on patience. Their job: pick a pizza, confirm phone and address, place the order in under a minute.
- **Staff (admin):** the restaurant owner and staff at a desktop computer in the kitchen/office, watching incoming orders during service and maintaining the menu (names, prices, photos).

## Product Purpose

XMR Pizza takes pizza delivery orders through a Telegram Mini App and lands them in a local web admin panel. Success: a customer goes from opening the bot to a confirmed order with no friction, receives a bot confirmation, and staff see the order (name, phone, items, total, address, time) immediately.

## Positioning

A pizzeria run by the owner of three Uzbek national-cuisine restaurants: classic Italian pizzas alongside national-flavour pizzas (e.g. Qazi pizza), sold at accessible prices with quick delivery, ordered entirely inside Telegram.

## Operating Context

- Customer surface: Telegram Mini App (mobile web view inside Telegram), opened from the bot's menu button or an inline button; Uzbek (Latin) interface; prices in so'm.
- Bot confirms each order with: "Buyurtmangiz muvaffaqiyatli qabul qilindi! Kuryerimiz tez orada bog'lanadi 🍕". Admins are NOT notified in Telegram.
- Admin surface: React dashboard on localhost (desktop browser), polling for new orders.
- Everything runs locally on the owner's Windows PC; the Mini App is exposed through ngrok.

## Capabilities and Constraints

- Stack (fixed by the brief): Node.js + Express + Telegraf backend, Prisma + PostgreSQL (Neon), React (Vite) Mini App and Admin Panel.
- Customer flow: one-time 3-slide onboarding → Home (greeting, stories, "Yangi buyurtma berish") → Catalog (category filter, cards with old/new price, quick add) → product bottom sheet (ingredients, add-to-cart CTA) → Cart (Kola upsell switch for 5 000 so'm, phone, address/location) → order confirmed, Mini App closes → Profile (order history, "Yana shundan buyurtma qilish").
- Order statuses: Kutilmoqda / Yetkazildi.
- Delivery fee: not shown anywhere (the courier communicates it). Do not display "free delivery" or any delivery price.
- No delivery-time promise has been confirmed; do not state minutes.

## Brand Commitments

- Name: **XMR Pizza** (bot: @xmr_pizza_bot).
- Visual direction (owner's choice after two direction rounds): the food-delivery category standard, played straight. It should sit alongside Dodo Pizza and Uzum Tezkor, and their craft level is the bar.
- Brief-pinned look: very simple, clean, minimalist, white background, modern interface. Admin uses clean tables.
- Language: Uzbek (Latin script), friendly and direct.

## Evidence on Hand

- Onboarding claim "10,000+ odam allaqachon biz bilan." is supplied by the owner in the brief.
- Four seed pizzas: Margarita, Peperoni, Qazi pizza, Pishloqli (prices are placeholders the owner can edit in the admin panel).
- No real food photography yet: pizza images are authored vector illustrations in `public/images/`; the owner can upload real photos via the admin panel.
- No testimonials, ratings, or reviews exist; do not invent them.

## Product Principles

1. Ordering speed beats everything: every screen moves the customer toward a confirmed order.
2. Truthful commerce: prices come from the database, no invented claims about delivery fee, time, or ratings.
3. Staff see what they need at a glance: who, phone, what, how much, where, when.
4. The owner can run it without a developer: menu edits and photos happen in the admin panel.
