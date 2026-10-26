---
name: XMR Pizza
description: Pizza ordering inside Telegram plus a staff admin panel. White ground, one tomato red, Manrope, the food-delivery category standard played straight.
colors:
  bg: "#ffffff"
  ink: "#141414"
  ink-2: "#3d3d43"
  muted: "#6b6b73"
  nav-idle: "#74747b"
  line: "#ececf0"
  line-admin: "#e8e8ec"
  line-soft: "#f0f0f3"
  well: "#f5f5f7"
  panel: "#f7f7f9"
  indicator-off: "#d9d9de"
  control-off: "#cfcfd5"
  accent: "#d92d20"
  accent-press: "#b8251a"
  accent-soft: "#fdeceb"
  success: "#15803d"
  success-soft: "#f0faf3"
  pending: "#8a5300"
  pending-soft: "#fff3df"
  fresh: "#fff8e6"
typography:
  headline:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline-sm:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  title-sm:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.45
  body:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
  body-admin:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  button:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 700
  label:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 700
  price:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    fontFeature: "tnum"
  price-lg:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    fontFeature: "tnum"
  caption:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 800
  nav-label:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 700
rounded:
  card: "16px"
  sheet: "20px"
  control: "12px"
  control-sm: "10px"
  chip: "18px"
  pill: "20px"
  card-admin: "14px"
  control-admin: "10px"
  control-admin-sm: "8px"
  circle: "50%"
spacing:
  hair: "2px"
  stack-xs: "4px"
  stack-sm: "8px"
  grid-col: "12px"
  gutter: "16px"
  inset: "20px"
  section: "28px"
  admin-gutter: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  button-primary-pressed:
    backgroundColor: "{colors.accent-press}"
  button-primary-lg:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.control}"
    height: "54px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  button-soft:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  button-soft-pressed:
    backgroundColor: "{colors.line}"
  button-primary-admin:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.control-admin}"
    padding: "0 16px"
    height: "40px"
  button-primary-admin-hover:
    backgroundColor: "{colors.accent-press}"
  button-ghost-admin:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control-admin}"
    padding: "0 16px"
    height: "40px"
  button-ghost-admin-hover:
    backgroundColor: "{colors.well}"
  chip:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.chip}"
    padding: "0 16px"
    height: "36px"
  chip-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
  add-button:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "40px"
  add-button-pressed:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
  stepper:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "3px"
  product-media:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.card}"
  hero-panel:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.card}"
    padding: "22px 20px"
  order-card:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.card}"
    padding: "14px"
  bottom-sheet:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.sheet}"
  text-field:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "13px 14px"
  text-field-admin:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control-admin}"
    padding: "9px 12px"
  bottom-nav:
    backgroundColor: "{colors.bg}"
    height: "64px"
  nav-item:
    textColor: "{colors.nav-idle}"
    typography: "{typography.nav-label}"
  nav-item-active:
    textColor: "{colors.accent}"
  nav-badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    height: "18px"
  status-pending:
    backgroundColor: "{colors.pending-soft}"
    textColor: "{colors.pending}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  status-done:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.control}"
    padding: "11px 16px"
  toast-error:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
  side-link-admin:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control-admin}"
    padding: "0 12px"
    height: "40px"
  side-link-admin-active:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent}"
  table-header-admin:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    padding: "10px 14px"
---

# Design System: XMR Pizza

## Overview

**Creative North Star: "The Clean Counter"**

XMR Pizza looks like the counter of a well-run pizzeria: a white surface, each pizza on a grey plate, and one tomato red that marks everything you can act on or pay. It plays the food-delivery category standard straight, with Dodo Pizza and Uzum Tezkor as the bar, so a hungry customer recognizes every control on sight and reaches a confirmed order in under a minute. The menu and its prices lead. No decoration competes with them.

The Mini App is one centered column, 520px at most, at phone density: 16px gutters, 28px between sections, a two-column product grid, edge-bleeding horizontal rows for stories, popular items and category chips, and a fixed four-tab bar. The Admin Panel is the same world at desktop density. It has a cool-grey sidebar, a bordered stat strip, segmented filter tabs and a bordered table, with radii 2px smaller and body type at 14px. Both apps share one family (Manrope), one accent and the same two status colors.

Depth is mostly flat. Hairlines and the grey well separate things, and a shadow appears only on a layer that floats: the round close button over the sheet image, the sticky product editor, the selected segment. Motion is quick and eases out (120 to 320ms), with one authored moment: the check that draws itself when an order succeeds.

**Key Characteristics:**
- White ground, near-black ink, a single tomato-red accent for action, price, selection and error.
- Food always sits on the grey well (#f5f5f7) at 16px radius.
- Manrope only, with headings at 800 and tight tracking and every price in tabular numerals.
- 16px cards and sheets, 12px controls, and pills only for chips, status and counts.
- Hairlines separate. Shadows only lift floating layers.
- Signature interaction: the card's plus becomes an inline − n + stepper once the pizza is in the cart, and the cart badge counts live.

## Colors

The palette is near-monochrome cool neutrals with one saturated tomato red and two muted status colors that never stray from their meaning.

### Primary
- **Tomato Red** (`accent`): filled commit buttons (onboarding continue, add to cart, place order, admin save and new), text actions ("Barchasi", location), the current price, the active chip, the active nav tab and admin side link, the cart and pending-count badges, unseen story rings, onboarding's active dot, the switch when on, focus rings, the input caret, error text and borders, and the error toast.
- **Pressed Tomato** (`accent-press`): the pressed state of red buttons on mobile, hover on admin, and the text color on blush alerts and text selection.
- **Tomato Blush** (`accent-soft`): the background of a selected or on state that holds ink text: the Kola upsell row when switched on, the admin row being edited, error alerts and text selection.

### Status
- **Basil Green** (`success`) on **Basil Wash** (`success-soft`): delivered and success only. It covers the order-success disc, the "Yetkazildi" pill, the admin save notice, and the location button once a location is captured.
- **Crust Amber** (`pending`) on **Crust Wash** (`pending-soft`): pending only. It covers the "Kutilmoqda" pill, the pending stat value and the pending count on the filter tab.
- **Fresh-Row Cream** (`fresh`): admin only. A newly arrived order row is tinted with it so staff notice it during polling.

### Neutral
- **Counter White** (`bg`): the page, sheets, the nav bar, inputs and the text on red or ink fills.
- **Oven Ink** (`ink`): headings, body text, the ink button, toasts and the focus border on inputs.
- **Graphite** (`ink-2`): secondary text such as descriptions, field labels, chip labels, summary rows and story labels.
- **Slate** (`muted`): supporting copy, struck-through old prices, table headers and IDs.
- **Nav Slate** (`nav-idle`): inactive bottom-nav tabs.
- **Hairline** (`line`, Mini App) and **Admin Hairline** (`line-admin`, with `line-soft` for row dividers inside tables): every border and divider.
- **Plate Well** (`well`): the second layer. It covers product and cart image wells, chips, the stepper, the add button, the soft button, the hero panel, the profile card, the upsell row, empty-state icon discs and admin thumbnails and tabs.
- **Sidebar Mist** (`panel`): the admin sidebar, sticky table headers and the login backdrop.
- **Indicator Off** (`indicator-off`): inactive onboarding dots and seen story rings. **Control Off** (`control-off`): the switch track when off and the admin scrollbar thumb.

Story viewer backdrops are full-bleed colors set per story in content data, not tokens. Current values are #C9281D, #2B2B30, #9A5800, #2F6B3A and #8E1F17. Each must hold white text at 4.5:1 or better, and all current values do.

### Named Rules
**The Red Means Act Rule.** Tomato red marks action, price, selection and error. Its one ornamental use is the 6px dot on ingredient lists. Red never colors a heading or fills a UI panel. Story backdrops are content, as noted above.

**The Status Colors Stay in Their Lane Rule.** Basil green means delivered or succeeded. Crust amber means waiting. Neither ever decorates UI chrome.

**The Plate Rule.** Every food image sits on the Plate Well, never directly on white and never on a tint.

## Typography

**Display Font:** Manrope (fallback -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif)
**Body Font:** Manrope (same stack)

Manrope is self-hosted via @fontsource/manrope at weights 400, 600, 700 and 800.

**Character:** A single geometric-humanist sans. The headings are heavy and slightly tight, the body is open and plain, and the prices are bold and tabular. It is confident and friendly with no editorial flourish, as legible in a Telegram webview as on a desktop table.

### Hierarchy
- **Headline** (800, 26px, 1.2, -0.02em): page titles ("Katalog", "Savatcha"), the Home greeting and onboarding headlines. The story viewer goes one step up to 28px.
- **Headline Small** (800, 24px, 1.2, -0.02em): the product sheet title, the order-success heading and admin page titles. The Home hero heading and admin login title use 22px.
- **Title** (800, 18px, -0.01em): section titles ("Ommabop"). Inside the sheet they drop to 16px, and empty-state titles use 17px.
- **Title Small** (700, 15px): product card names, cart item names and button text.
- **Body** (400, 15px, 1.45): Mini App running text. Sheet descriptions cap at 65ch. Card descriptions use 13px/1.35 in Graphite and clamp to two lines.
- **Body Admin** (400, 14px, 1.45): Admin running text and table cells.
- **Label** (700, 13px): form field labels in Graphite. Secondary meta uses 13px at 400 in Slate.
- **Price** (800, 15px, tabular): the current price in Tomato Red. **Price Large** (800, 22px, tabular) appears on the product sheet. The old price is 12px (15px on the sheet), Slate and struck through.
- **Caption** (800, 12px): status pills and admin badges.
- **Nav Label** (700, 11px): bottom-nav tab labels.

### Named Rules
**The Tabular Price Rule.** Every price, quantity, count, ID and time uses tabular numerals. Prices are always formatted as "59 000 so'm", with a space between thousands and the currency after the number.

**The Heavy Heading Rule.** Headings are 800 and tracked tight: -0.02em at 22px and above, -0.01em at 16 to 18px. Body copy stays at 400 and labels at 600 to 700. No other weights are loaded.

## Layout

**Mini App.** A single column centered at a 520px maximum. Pages pad 16px on the sides and top, and leave room at the bottom for the 64px nav plus the safe-area inset plus 28px. Sections are 28px apart. A section head puts the title and a red text link on one baseline. Horizontal rows (stories, popular items, chips) bleed to the screen edge with -16px margins and 16px padding, and hide their scrollbars. The catalog is a two-column grid with 16px row and 12px column gaps. Product images fill about 86% of their square well.

Fixed layers stack in this order. The bottom nav (z 30) is at the foot. The checkout bar (z 20) sits directly above the nav with a hairline top. The bottom sheet is z 50, the story viewer z 60, and toasts z 80 at the top of the screen (safe-area plus 12px). The sheet tops out at 92dvh. Its media header sits on the well, and its CTA bar is pinned beneath a hairline.

**Admin.** A two-column grid: a 232px sticky sidebar and a fluid main column. The page pads 28px 32px 48px with a 1480px maximum. The page head puts the title and subline on the left and actions on the right, aligned to the bottom edge. The four stats sit in one bordered strip divided by hairlines. Filter tabs sit above a bordered, horizontally scrollable table. With the editor open, Products splits into the table plus a 380px sticky editor with a 24px gap.

**Breakpoints.** At 1180px or less the admin editor stacks below the table. At 820px or less the sidebar becomes a top bar, the stats strip goes to two columns, and the page padding drops to 20px 16px.

## Elevation & Depth

The system is flat by default. Separation comes from 1px hairlines and the grey well, and the only real elevation is for layers that float above content. Pizza illustrations carry their own warm drop shadow as part of the artwork treatment, never as UI chrome.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 6px 24px rgba(20, 20, 20, 0.08)`): round icon buttons floating over imagery, such as the sheet's close button.
- **Panel lift** (`box-shadow: 0 8px 28px rgba(20, 20, 20, 0.06)`): the sticky admin product editor.
- **Segment lift** (`box-shadow: 0 1px 2px rgba(20, 20, 20, 0.08)`): the selected admin filter tab. The active admin side link uses `0 1px 2px rgba(20, 20, 20, 0.06), 0 0 0 1px` plus the admin hairline.
- **Knob** (`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2)`): the switch thumb.
- **Focus halo** (`box-shadow: 0 0 0 3px rgba(20, 20, 20, 0.06)`): admin inputs on focus, alongside the ink border.
- **Illustration lift** (`filter: drop-shadow(0 10px 18px rgba(120, 50, 20, 0.16))`): pizza art in the hero and sheet. The onboarding table art uses `0 8px 14px rgba(90, 40, 10, 0.14)`. The story viewer uses a deeper neutral `0 16px 26px rgba(0, 0, 0, 0.28)` on its colored ground.
- **Scrim** (`rgba(10, 10, 10, 0.45)`): the bottom-sheet backdrop.

### Named Rules
**The Borders Separate Rule.** Containment is drawn with a hairline or the well. A shadow means the layer floats or has been lifted by selection. Cards, the stat strip and tables carry no shadow.

## Shapes

The shapes are soft rectangles, with circles for identity and pills only for small tags.

- **Cards, wells, panels** (16px Mini App, 14px admin): product media, mini cards, the hero, the profile card, order cards, the upsell row, skeletons, the admin table wrap, the stat strip and the editor.
- **Sheet** (20px, top corners only).
- **Controls** (12px Mini App, 10px admin): buttons, inputs, the stepper, the add button, cart thumbnails and toasts. Small buttons use 10px (8px admin) and stepper keys 9px.
- **Pills** (fully rounded): chips (18px on a 36px height), status pills (20px), admin badges, the nav badge and count bubbles. Pills never shape a button.
- **Circles**: avatars, story rings (64px with a 2.5px ring and 2.5px white gap), floating icon buttons, the remove button, the empty-state disc and the success disc.
- **Icons**: drawn SVG on a 24px grid with a 2px stroke and round caps and joins. The active nav icon thickens from 1.9 to 2.3.

## Components

### Buttons
Tactile and direct: solid fills, no outlines on mobile, and a 0.98 scale on press.
- **Shape:** gently rounded (12px). Heights are 46px default, 54px for sheet and cart CTAs, 56px for onboarding, and 36px small. Text is 700.
- **Primary (Tomato):** the commit action toward an order. It moves to Pressed Tomato on press.
- **Ink:** utility and entry actions on a tinted panel or a quiet screen ("Menyuni ochish" in the hero, retry, "Yana buyurtma berish").
- **Soft:** well-filled secondary actions ("Yana shundan buyurtma qilish", the phone-from-Telegram icon button). It moves to Hairline on press.
- **White:** the CTA on colored story backdrops.
- **Admin:** 40px (32px small) at a 10px radius. Primary is red and moves to Pressed Tomato on hover. Ghost has a white fill, a hairline border and Graphite text, and moves to the well with a #dcdce1 border on hover. The destructive ghost turns red on blush on hover.
- **Focus:** a 2px Tomato outline with a 2px offset, across both apps.
- **Disabled:** 45% opacity (50% in admin).

### Chips
- **Style:** a 36px pill with a well fill, 700 Graphite text at 14px and 16px horizontal padding.
- **State:** the active chip fills Tomato with white text. Color transitions take 180ms.

### Cards / Containers
- **Product card:** a borderless stack. A square well (16px) holds the image, then the 15px/700 name, the two-line 13px description, and a bottom row with the price stack on the left and the add button or stepper on the right. The whole upper area is one tap target that opens the sheet and scales the well to 0.98 on press.
- **Hero panel:** a well (16px, 22px 20px padding, at least 188px tall). Text takes 60% of the width, and the pizza art bleeds off the right edge.
- **Order card:** a white card with a hairline border (16px, 14px padding). The top row holds the ID and time with a status pill. The item list sits between hairlines, and a total row with the soft reorder button closes the card.
- **Shadow strategy:** none (see Elevation).

### Inputs / Fields
- **Style:** white fill, 1.5px hairline border, 12px radius, 13px 14px padding and 16px text (which prevents iOS zoom). Admin uses a 1px border, 10px radius and 9px 12px padding.
- **Focus:** the border shifts to Oven Ink. Admin adds a 3px ink halo at 6%.
- **Error:** a Tomato border with 13px/600 Tomato text below.
- **Caret:** Tomato.

### Navigation
- **Bottom nav (Mini App):** four equal tabs (Bosh sahifa, Katalog, Savatcha, Profil) on a white bar with a hairline top, 64px plus the safe area. Inactive tabs use Nav Slate. The active tab turns Tomato and its icon stroke thickens. The cart badge is an 18px Tomato pill with a 2px white ring, and it bumps (scales to 1.25) on every count change.
- **Admin sidebar:** a Sidebar Mist column with the brand lockup, 40px side links in Graphite that hover to #eeeef1, and the active link as a white lifted tile with Tomato text. A Tomato count bubble shows pending orders, and "Chiqish" in Slate is pinned to the foot.
- **Admin filter tabs:** a segmented control on the well (3px inset). The selected segment is white with segment lift, and the pending count is an amber bubble.

### Plus to Stepper (signature)
Before the pizza is in the cart, a card shows a 40px well-filled add button with a 2.4-stroke plus. On press it flashes Tomato and scales to 0.92. Once the pizza is in the cart, the card's bottom row reflows: the price stays on top and a full-width − n + stepper sits beneath it (a well with 3px inset, 40px keys, an 800-weight tabular count). The keys go white on press, and each step fires light haptics. The nav badge updates in the same moment.

### Bottom Sheet
The sheet slides up over 320ms on the shared ease above a 45% scrim. Its media header is the well, with a 40×5 handle and a floating round close button. The body holds the 24px title, the large price line, the description, an ingredient list with Tomato dots, and a quantity row behind a hairline. A pinned CTA bar holds a full-width Tomato button that includes the running total.

### Toast
Toasts appear at the top center, below the safe area, with a 12px radius, 11px 16px padding and 14px/600 text. They are ink for information and Tomato for errors. They fade in with a short downward slide and clear after 2.2s.

### Status Pills
These are 12px/800 pills on soft fills: Crust Amber on Crust Wash for "Kutilmoqda" and Basil Green on Basil Wash for "Yetkazildi". Admin uses a 24px-tall badge of the same form, plus a neutral variant (Graphite on the well) for categories.

### Admin Table
The table sits inside a 14px bordered wrap. The sticky header row is Sidebar Mist with 12px/700 Slate labels. Cells pad 12px 14px with Soft Hairline dividers, and rows hover to #fbfbfc. Numbers align right in tabular figures, and the current price is red at 800. A fresh order row tints Fresh-Row Cream. The row being edited tints Tomato Blush.

## Do's and Don'ts

### Do:
- **Do** put every food image on the Plate Well (#f5f5f7) at 16px radius, with the image filling about 86% of the well.
- **Do** show the current price in Tomato at 800 with tabular numerals. Show a struck-through Slate old price above or beside it only when a real old price exists.
- **Do** turn the add button into the inline − n + stepper once the item is in the cart, and keep the cart badge counting live.
- **Do** separate with 1px hairlines and the well. Keep shadows for floating or selected layers.
- **Do** keep state transitions at 120 to 320ms on cubic-bezier(0.2, 0.8, 0.2, 1), and keep the reduced-motion override that flattens animations.
- **Do** show toasts at the top, ink for information and Tomato for errors.
- **Do** draw icons as SVG on a 24px grid with a 2px round stroke.
- **Do** step the admin down to desktop density (14px body, 40px controls, 14px and 10px radii) instead of inventing a second look.

### Don't:
- **Don't** add discount badges such as "-20%". The struck-through old price is the only discount signal.
- **Don't** use green or amber in UI chrome for anything other than delivered or success and pending.
- **Don't** add a second accent hue, glass or blur, or any gradient beyond the loading-skeleton shimmer.
- **Don't** add rating stars, eyebrow badges, emoji standing in for icons, or spinning food.
- **Don't** shape buttons as pills. Pills are for chips, status and counts.
- **Don't** introduce a second typeface or any weight outside 400, 600, 700 and 800.
- **Don't** put a shadow on a card, the stat strip or a table to make it "pop".
