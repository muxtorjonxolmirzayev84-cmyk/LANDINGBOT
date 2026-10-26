---
version: 1
slug: "miniapp-src-app-jsx"
primary_target: "miniapp/src/App.jsx"
related_targets: ["admin/src/main.jsx"]
---

# Surface brief: XMR Pizza Mini App + Admin Panel

## Scope and mode
- Mini App (`miniapp/`): customer ordering inside Telegram, phone portrait (390×844). Mode: Operate.
- Admin Panel (`admin/`): staff desktop dashboard (1440 wide), orders table + menu editor. Mode: Operate.

## Audience, job, constraints
- Customers order a pizza in under a minute; staff see who, phone, what, total, address, time at a glance.
- Brief-pinned: very simple, clean, minimalist, white background, modern. Uzbek Latin copy, prices in so'm.
- No delivery fee, delivery time, ratings or reviews shown (none confirmed).

## Direction contract
THESIS: XMR Pizza is a food-ordering app of the Dodo Pizza / Uzum Tezkor class: menu and price lead, the order completes in under a minute. It refuses decoration: no spinning food, no emoji standing in for icons, no rating stars, no eyebrow badges, no glass.

OWN-WORLD: White ground; one tomato red (#D92D20) reserved for primary actions, new price, cart badge and selection; ink #141414; neutral second layer #F5F5F7 for image wells, chips and panels; green #15803D only for success/delivered, amber #8A5300 only for pending. Manrope as the single family, tabular numerals for every price. Radii: 16px cards and sheets, 12px controls, pills only for chips and status. 2px stroke drawn icons. Borders separate; shadows only on floating layers.

STORY: Customer sees a greeting and stories, taps "Yangi buyurtma berish", picks from the pizza grid, adds with plus or from the sheet, confirms phone and address, the app closes and the bot confirms. Staff watch new rows arrive in the orders table and mark them delivered.

FIRST VIEWPORT: Home at 390×844: greeting heading "Xayrli kech, {ism}" 26px/800 with "Xush kelibsiz!" line beneath and avatar right; stories row of 64px rings; full-width hero card "Yangi buyurtma berish" with pizza illustration right and dark primary button; "Ommabop" row begins above the fold edge; four-tab bottom bar fixed with red cart badge. Admin at 1440: left sidebar (brand, Buyurtmalar, Mahsulotlar, Chiqish), four stat tiles, status filter tabs, dense orders table.

FORM: Canon: the category standard via the standing exit, played straight against Dodo Pizza and Uzum Tezkor. Signature interaction: a card's plus button turns into an inline − n + stepper once the pizza is in the cart; cart badge counts live. Motion: 150–250 ms ease-out state transitions, sheet slide 320 ms, one authored moment (the order-success check). seed:4b641dbd6b1782e4

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
