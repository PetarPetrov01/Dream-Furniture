# Frontend luxury-minimalism redesign — Design

**Date:** 2026-05-09
**Status:** Design approved; awaiting implementation plan
**Scope:** Homepage + products listing + product details (customer-facing browse path). Auth, profile, cart, orders pages keep current styles for this iteration.

## Goal

Modernize the customer-facing surface of Dream Furniture into a minimalist-luxury aesthetic: editorial photography, restrained typography, generous whitespace, no decorative weight. Pair the visual change with a richer product schema and a curated 24-product seed catalog so the redesign has real content to show.

## Decisions captured during brainstorming

- **Redesign reach:** Homepage + products listing + product details only.
- **Product data:** Wipe and reseed with a curated 24-product catalog.
- **Image strategy:** Lookbook style — `images[]` with 3–4 Unsplash URLs per product (hero + paired lifestyle/material/detail shots).
- **Schema:** Modest extension (see Section 4).
- **Style system:** CSS custom properties (`:root` tokens) + per-component CSS. No Tailwind, no Material theme overhaul.
- **URLs:** Switch to `/products/:slug` (and `/products/:slug/edit`) for navigable URLs; ids stay for write endpoints (`PUT/DELETE`, wishlist).

---

## Section 1 — Visual design language (tokens)

CSS custom properties on `:root` in a new `client/src/app/styles/tokens.css`, imported by `styles.css`.

### Palette
- `--color-bg`: `#fbfaf7` (warm off-white)
- `--color-surface`: `#ffffff`
- `--color-surface-muted`: `#f3f0eb` (sand)
- `--color-ink`: `#1a1a1a` (near-black, never pure)
- `--color-ink-muted`: `#6b6b6b`
- `--color-line`: `#e7e3dc` (hairline dividers)
- `--color-accent`: `#7a5c3c` (warm bronze; restricted to display headings and ≥18px contexts)

### Typography
- `--font-display`: `"Cormorant Garamond", serif` — headings, prices.
- `--font-body`: `"Inter", system-ui, sans-serif` — UI, body.
- Type scale (1.25 ratio): `--fs-xs 12 / sm 14 / base 16 / lg 20 / xl 26 / 2xl 34 / 3xl 48 / 4xl 64`.
- Display headings: `font-weight: 400`, `letter-spacing: -0.01em`. No bold display.

### Spacing & layout
- Spacing (4-px base): `--space-1 4 / 2 8 / 3 12 / 4 16 / 5 24 / 6 32 / 7 48 / 8 64 / 9 96 / 10 128`.
- `--container-max: 1280px`, `--container-pad: clamp(16px, 4vw, 48px)`.
- Radii: `--radius-sm 2px`, `--radius-md 4px`. No pill shapes.
- 1px hairlines via `--color-line`. No drop shadows in redesigned scope.

### Motion
- `--ease-out: cubic-bezier(.2, .7, .2, 1)`.
- Durations: `--dur-fast 120ms`, `--dur-base 240ms`, `--dur-slow 480ms`.
- Image hover: `scale(1.03)` over `--dur-slow`. No layout shift.
- `prefers-reduced-motion: reduce` zeroes durations and disables hover scale.

---

## Section 2 — Homepage information architecture

Each section is a standalone Angular component under `client/src/app/main/home/sections/`. The page mounts them in order. Static sections take no data; dynamic ones receive products as signal inputs.

### 1. Hero — `<app-hero>`
- Full-bleed; `100vh` desktop (min 640px), `70vh` mobile.
- One editorial photo, slight darken overlay (`rgba(0,0,0,0.15)`).
- Centered eyebrow ("EST. 2024"), display-serif tagline ("Furniture, considered."), thin underlined CTA ("Explore the collection →") routing to `/products`.
- No carousel. Static.

### 2. Featured collection — `<app-featured-collection>`
- Heading: eyebrow ("Featured") + display H2 ("This season's pieces").
- Asymmetric grid: 1 large card (2 cols, full height) + 2 stacked smaller cards on the right.
- Card: hero image, name (serif), price (serif), hairline divider, hover (image scale + accent name underline).
- Data: `GET /products?isFeatured=true&limit=3`.

### 3. Browse by space — `<app-category-grid>`
- Heading: "Browse by space".
- 5 tall-aspect tiles (Living / Bedroom / Dining / Office / Outdoor), category name overlaid bottom-left in serif.
- Click → `/products?category=<name>`.
- Static; image URLs hard-coded per category.

### 4. New arrivals — `<app-new-arrivals>`
- Heading: "Newly arrived".
- Horizontal scroll-snap rail of 6–8 products. Hairline arrow buttons on desktop. No carousel JS.
- Card: tighter than featured — image, name, price.
- Data: `GET /products?sort=createdAt:desc&limit=8`.

### 5. Craftsmanship — `<app-craftsmanship>`
- Two-column desktop: large image left (60%), text right (40%) with generous padding. Stacks on mobile.
- Eyebrow ("Made with intent"), display H2 (one line), 2 short paragraphs, hairline link CTA.
- Static.

### 6. Newsletter — `<app-newsletter>`
- Centered narrow column on `--color-surface-muted`.
- Display H3 ("Stay in touch"), one-line copy, single email input + inline underline-only submit.
- No backend wiring this iteration: form transitions to thank-you state on valid submit. `aria-live="polite"` for state change.

The home page module orchestrates only the data fetches; sections are dumb.

---

## Section 3 — Products listing & details

### Listing (`/products`)

Behavior: keep filter / sort / search / URL-state semantics from current implementation. Add multi-category filter and "Load more" pagination.

Layout:
- Quiet page header: eyebrow ("Collection"), display H1 ("All pieces"), small result-count line. Hairline divider below.
- Two columns desktop: filter rail left (240px fixed) + product grid right. Mobile: filter slide-over via "Filter & sort" trigger.
- Filter rail: groups (Category / Style / Material / Color / Price) as label + chips/checkboxes, separated by whitespace. No accordions.
- Top bar: search input (inline icon, hairline underline) left; sort `<select>` (minimal, no Material) right; reset as small text link.
- Grid: 3 columns desktop / 2 tablet / 1 mobile. Cards hairline-bordered on hover only; image dominates, name + price beneath in serif.
- "Load more" button at the bottom (server-side `offset/limit`).
- Empty result: single line + "Clear filters" link.

### Details (`/products/:slug`)

Layout:
- Two columns desktop, stacked on mobile.
- **Left (60%)**: image gallery. Hero image at top; remaining images in a 2-col grid below. Vertical scroll, no carousel.
- **Right (40%)**: sticky info panel.
  - Eyebrow: category line ("Living room · Lounge").
  - Display H1: product name.
  - Price (serif, large).
  - Short description (`shortDescription`).
  - Hairline divider.
  - Long description (`description`, kept).
  - Spec table: dimensions / materials / color / style as label/value rows with hairline separators.
  - CTAs: "Add to cart" (filled, ink-on-bg), "Add to wishlist" (text + icon, no fill). Owner controls (edit/delete) as small text links below.
- Stock tag near price ("In stock" / "Made to order"). When `inStock === false`, "Add to cart" is disabled with tooltip.
- Auth-state behavior unchanged.

---

## Section 4 — Schema changes & migration

### Product schema (extension)

| Field | Type | Notes |
|---|---|---|
| `images` | `[String]` (required, min length 1, each match `imagePattern`) | Replaces `image`. First entry = hero. |
| `shortDescription` | `String` (required, max 200 chars) | Tagline above the long description. |
| `tags` | `[String]` (default `[]`) | Free-form (e.g. `oak`, `handcrafted`). Seeded but not surfaced in UI yet. |
| `inStock` | `Boolean` (default `true`) | Drives stock tag and disabled "Add to cart". |
| `isFeatured` | `Boolean` (default `false`) | Powers `GET /products?isFeatured=true`. |
| `slug` | `String` (unique, indexed) | Auto-generated from `name` on save via `pre('save')` hook. Stable after creation — does not regenerate on rename. Collisions resolved by appending a short hash suffix. |

Removed: `image` (replaced by `images[]`).
Untouched: `name`, `description`, `category`, `style`, `dimensions`, `material`, `color`, `price`, `_ownerId`, timestamps. Existing validators stay.

### Backend touch-points

- `models/Product.js` — schema extension; `pre('save')` slug hook.
- `controllers/products.js` — accept `isFeatured` (boolean), repeated `category=` (multi-value), and `offset` query params; resolve `GET /products/:slug` by slug, with id fallback for 24-char hex strings (defensive — protects any inbound id-style links).
- Routes: `GET /products/:slug` replaces `GET /products/:id` for read; write endpoints (`PUT /products/:id`, `DELETE /products/:id`, `POST /products/:productId/wishlist`) stay id-based.
- `package.json`: add `"seed": "node ./seed/products.js"`.

### Client touch-points (schema/route)

- `types/Product.ts`: add `images[]`, `shortDescription`, `tags[]`, `inStock`, `isFeatured`, `slug`. Remove `image`.
- `app.routes.ts`: `products/:id` → `products/:slug`; `products/:id/edit` → `products/:slug/edit`.
- All `routerLink` and `Router.navigate` callsites swap to `product.slug`.
- Create/Edit form: single `image` URL input becomes a small repeater for `images[]` (add/remove URL inputs). New inputs for `shortDescription` (short text) and `inStock` (checkbox). `tags`, `slug`, and `isFeatured` are not exposed in the form (seeded directly).

### Seed strategy

- `server/seed/products.js`: wipes the `products` collection and inserts 24 curated products. Idempotent — safe to re-run.
- `server/seed/house-user.js`: idempotent creation of a synthetic owner (`house@dreamfurniture.local`, randomized password) used as `_ownerId` for all seeded products. Keeps existing owner-controls logic working without special-casing.

---

## Section 5 — Seed catalog (24 products)

Five styles spread across five categories; six items flagged `isFeatured: true` form the rotation pool for the homepage Featured Collection. Each product has 3–4 Unsplash URLs (curated for editorial coherence — hero + paired lifestyle/material/detail), `shortDescription` (≤120 chars), `description` (2–3 paragraphs), realistic dimensions, USD price, plausible `material[]`, single `color`, 2–3 `tags`.

| # | Name | Category | Style | Featured | Price |
|---|---|---|---|---|---|
| 1 | Halden Lounge | Living room | Mid-century | ✓ | 1,890 |
| 2 | Marlow Sofa | Living room | Contemporary | ✓ | 3,200 |
| 3 | Nori Coffee Table | Living room | Japandi | | 740 |
| 4 | Atlas Bookshelf | Living room / Office | Industrial | | 1,150 |
| 5 | Linden Sideboard | Living room / Dining | Scandinavian | ✓ | 2,400 |
| 6 | Saga Bed | Bedroom | Scandinavian | ✓ | 2,180 |
| 7 | Kelda Nightstand | Bedroom | Japandi | | 480 |
| 8 | Aalto Wardrobe | Bedroom | Mid-century | | 2,950 |
| 9 | Vesta Dresser | Bedroom | Contemporary | | 1,640 |
| 10 | Mira Vanity | Bedroom | Contemporary | | 1,090 |
| 11 | Forge Dining Table | Dining room | Industrial | ✓ | 2,650 |
| 12 | Oslo Dining Chair | Dining room | Scandinavian | | 320 |
| 13 | Rye Bench | Dining room / Outdoor | Mid-century | | 580 |
| 14 | Larch Buffet | Dining room | Japandi | | 1,820 |
| 15 | Tide Pendant Light | Dining room / Living room | Contemporary | | 410 |
| 16 | Ridge Desk | Home office | Industrial | ✓ | 1,290 |
| 17 | Field Task Chair | Home office | Contemporary | | 690 |
| 18 | Quill Shelving | Home office | Mid-century | | 980 |
| 19 | Loam Filing Cabinet | Home office | Industrial | | 540 |
| 20 | Clay Reading Lamp | Home office / Living room | Japandi | | 280 |
| 21 | Coast Lounge Chair | Outdoor | Contemporary | | 870 |
| 22 | Anvil Fire Table | Outdoor | Industrial | | 1,460 |
| 23 | Drift Dining Set | Outdoor | Scandinavian | | 2,200 |
| 24 | Bramble Planter Bench | Outdoor | Japandi | | 390 |

Image URL curation for each product happens during implementation (not in this spec).

---

## Section 6 — Component & file architecture

### Client

```
client/src/app/
├── styles/
│   ├── tokens.css                  (NEW)
│   └── base.css                    (NEW)
├── styles.css                      (imports tokens + base; existing globals trimmed)
├── main/
│   ├── home/
│   │   ├── home.component.{ts,html,css}     (orchestrator only)
│   │   └── sections/
│   │       ├── hero/
│   │       ├── featured-collection/
│   │       ├── category-grid/
│   │       ├── new-arrivals/
│   │       ├── craftsmanship/
│   │       └── newsletter/
│   ├── products/
│   │   ├── products.component.{ts,html,css} (refactored)
│   │   ├── filter-rail/                     (NEW)
│   │   ├── product-card/                    (NEW: shared, density variants)
│   │   └── sort-search-bar/                 (NEW)
│   └── product-details/
│       ├── product-details.component.{ts,html,css} (refactored)
│       ├── image-gallery/                   (NEW)
│       └── spec-table/                      (NEW)
├── shared/
│   ├── ui/                         (NEW)
│   │   ├── eyebrow/
│   │   ├── hairline-button/
│   │   └── section-heading/
│   └── (existing pipes, loader-card unchanged; loader-card restyled to tokens)
└── types/Product.ts                (extended)
```

Shared `<app-product-card>` accepts `product` and `density` (`featured` | `default` | `rail`) — three visual variants, one component.

### Server

```
server/
├── models/Product.js               (schema extended; pre-save slug hook)
├── controllers/products.js         (isFeatured, multi-category, offset, slug lookup)
├── routes/                         (GET /products/:slug)
└── seed/
    ├── products.js                 (NEW)
    └── house-user.js               (NEW)
```

`server/package.json`: add `"seed"` script.

### Testing scope

- **Update existing specs** (`home`, `products`, `product-details`) for new template structure. Keep behavioral assertions.
- **Add specs** for new components: each home section (smoke render), `product-card`, `image-gallery`, `filter-rail`, `sort-search-bar`. 1–2 behavioral tests where logic exists (e.g., `filter-rail` emits filter changes; `product-card` routerLinks to `product.slug`).
- **No specs** for purely static sections beyond a render smoke test.
- **Server**: spec for slug pre-save hook (derivation + collision suffix). Skip endpoint tests for redesign-only query-param parsing.
- **No visual snapshots.**

---

## Section 7 — Error handling, edge cases, accessibility

### Loading states
- Featured + New Arrivals show 3 / 8 skeletons via the existing `<app-loader-card>` (restyled to tokens).
- Listing: 9 grid skeletons on first load; "Load more" inline spinner during pagination.
- Details: tall skeleton (gallery placeholder + info column).
- Remove the artificial 2-second `setTimeout` in `home.component.ts`.

### Error states
- Homepage: each dynamic section handles failure independently — inline message ("Couldn't load featured pieces") in its own area; static sections unaffected.
- Listing: replace grid with centered line + "Try again" link that re-fires the request. Filter rail stays usable.
- Details 404 (slug not found): existing not-found component, restyled to tokens.
- Image error: `(error)` swap to neutral 1×1 sand placeholder.

### Edge cases
- Empty filter result: single line + "Clear filters" link (tested).
- Out-of-stock reaching cart from a stale tab: `CartStore.addItem` ignores items where `inStock === false` at fetch time and surfaces a brief toast.
- Slug-mistaken-for-id on details route: `GET /products/:slug` attempts slug lookup first; on miss, attempts id lookup if input is a 24-char hex.
- Long names: `text-wrap: balance` + 2-line clamp with ellipsis.

### Accessibility
- Color contrast: ink-on-bg 17:1, ink-muted-on-bg 5.4:1 (both AA). Accent bronze restricted to display headings and ≥18px contexts.
- Hero overlay text has a fallback solid-color band behind it if image fails.
- Heading hierarchy: one H1 per route (page header), sections use H2. Eyebrows are styled `<p>`, not headings.
- Image gallery: every `<img>` has descriptive alt seeded into product data (not auto-generated from name).
- Sticky info panel does not trap focus.
- Newsletter: native `<form>` + `<input type="email" required>`; success state announced via `aria-live="polite"`.
- Reduced motion respected.
- Filter rail mobile slide-over: `role="dialog"`, focus trap (Angular CDK already a dep).

---

## Out of scope (explicit)

- Auth pages, profile, cart, orders, wishlist, create/edit form — beyond the minimum schema-driven changes (image repeater, `shortDescription`, `inStock`).
- Search ranking changes, cart/checkout flow changes, payments, real newsletter backend.
- Internationalization, currency switching, dark mode.
- Server-side rendering / hydration.
- Image CDN migration (Unsplash hotlinks accepted for this iteration).

## Open questions

None at design close. (Image curation per product happens during implementation.)
