# Frontend luxury-minimalism redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the customer-facing browse path (homepage + products listing + product details) into a minimalist-luxury aesthetic, extend the Product schema, and seed a curated 24-product catalog.

**Architecture:** CSS custom-property design tokens drive a token-based style system applied across new and refactored components. The Product model gains `images[]`, `shortDescription`, `tags[]`, `inStock`, `isFeatured`, and `slug`. Routes switch to `/products/:slug` for navigable URLs; write endpoints stay id-based. The homepage breaks into 6 standalone section components, products listing extracts filter/sort/search/card primitives, details page becomes a sticky two-column layout.

**Tech Stack:** Angular 20 (standalone components, signals, OnPush), Express + Mongoose 8 (Node 22), Karma + Jasmine (client), `node:test` (server, new). No new client deps.

**Spec:** `docs/superpowers/specs/2026-05-09-frontend-luxury-redesign-design.md`.

**Branch:** `refactor/luxury-redesign` (already created off `main`).

## Commit conventions for this plan

- Use Conventional Commits style headlines (`feat:`, `refactor:`, `style:`, `test:`, `chore:`).
- For each commit, randomly include or omit the `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer: roll a number 1–100 before each commit; if ≤ 25, omit the trailer; otherwise include it. Per-commit, not per-phase.
- Use HEREDOC for multi-line commit messages. Never `--no-verify`, never `--amend`.

---

## Phase 0 — Baseline check

### Task 0.1: Verify clean baseline

**Files:** none (read-only)

- [ ] **Step 1: Confirm branch**

  Run: `git -C "D:/code/GitHub/Angular-Project" rev-parse --abbrev-ref HEAD`
  Expected: `refactor/luxury-redesign`

- [ ] **Step 2: Verify client tests pass on baseline**

  From `client/`: `npm test -- --watch=false --browsers=ChromeHeadless`
  Expected: all existing specs pass. If anything fails, stop and surface to the user before continuing.

- [ ] **Step 3: Verify server starts**

  From `server/`: `npm start` (run in background, observe "Listening on port 3030"), then stop the process.

---

## Phase 1 — Style foundation

### Task 1.1: Add design tokens

**Files:**
- Create: `client/src/app/styles/tokens.css`

- [ ] **Step 1: Create the tokens file**

  Path: `client/src/app/styles/tokens.css`

  ```css
  :root {
    /* palette */
    --color-bg: #fbfaf7;
    --color-surface: #ffffff;
    --color-surface-muted: #f3f0eb;
    --color-ink: #1a1a1a;
    --color-ink-muted: #6b6b6b;
    --color-line: #e7e3dc;
    --color-accent: #7a5c3c;

    /* typography */
    --font-display: "Cormorant Garamond", Georgia, serif;
    --font-body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --fs-xs: 0.75rem;     /* 12 */
    --fs-sm: 0.875rem;    /* 14 */
    --fs-base: 1rem;      /* 16 */
    --fs-lg: 1.25rem;     /* 20 */
    --fs-xl: 1.625rem;    /* 26 */
    --fs-2xl: 2.125rem;   /* 34 */
    --fs-3xl: 3rem;       /* 48 */
    --fs-4xl: 4rem;       /* 64 */
    --lh-tight: 1.1;
    --lh-normal: 1.5;
    --lh-loose: 1.75;
    --tracking-tight: -0.01em;
    --tracking-wide: 0.08em;

    /* spacing */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 24px;
    --space-6: 32px;
    --space-7: 48px;
    --space-8: 64px;
    --space-9: 96px;
    --space-10: 128px;

    /* layout */
    --container-max: 1280px;
    --container-pad: clamp(16px, 4vw, 48px);

    /* radii */
    --radius-sm: 2px;
    --radius-md: 4px;

    /* motion */
    --ease-out: cubic-bezier(.2, .7, .2, 1);
    --dur-fast: 120ms;
    --dur-base: 240ms;
    --dur-slow: 480ms;
  }

  @media (prefers-reduced-motion: reduce) {
    :root {
      --dur-fast: 0ms;
      --dur-base: 0ms;
      --dur-slow: 0ms;
    }
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add client/src/app/styles/tokens.css
  ```
  (Apply commit-trailer randomization per the conventions above.)
  Message: `style: add design tokens for luxury minimalism redesign`

### Task 1.2: Add base typographic styles

**Files:**
- Create: `client/src/app/styles/base.css`

- [ ] **Step 1: Create base.css**

  ```css
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html { font-size: 16px; }

  body {
    font-family: var(--font-body);
    font-size: var(--fs-base);
    line-height: var(--lh-normal);
    color: var(--color-ink);
    background: var(--color-bg);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 400;
    letter-spacing: var(--tracking-tight);
    line-height: var(--lh-tight);
    color: var(--color-ink);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    cursor: pointer;
  }

  ul { list-style: none; }

  img { display: block; max-width: 100%; height: auto; }

  ::selection { background: var(--color-ink); color: var(--color-bg); }

  @media (max-width: 1000px) { html { font-size: 15px; } }
  @media (max-width: 800px)  { html { font-size: 14px; } }
  @media (max-width: 600px)  { html { font-size: 13px; } }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add client/src/app/styles/base.css
  ```
  Message: `style: add base typography and reset stylesheet`

### Task 1.3: Wire tokens + base into global styles, swap fonts

**Files:**
- Modify: `client/src/styles.css`

- [ ] **Step 1: Replace `client/src/styles.css` contents**

  ```css
  @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap");
  @import "../node_modules/@angular/material/prebuilt-themes/indigo-pink.css";
  @import "./app/styles/tokens.css";
  @import "./app/styles/base.css";
  ```

  *Rationale:* keep Material's prebuilt theme so legacy pages (auth, profile, cart) keep working; tokens + base override the visual surface where the redesign lives.

- [ ] **Step 2: Run dev server, smoke check**

  From `client/`: `npm start` (background). Open `http://localhost:4200`. Confirm fonts load (display headings should now be Cormorant Garamond, body Inter), background is warm off-white. Stop the dev server.

- [ ] **Step 3: Commit**

  ```bash
  git add client/src/styles.css
  ```
  Message: `style: load tokens and base, switch to Cormorant Garamond + Inter`

---

## Phase 2 — Backend schema & seed

### Task 2.1: Extend Product schema with slug hook

**Files:**
- Modify: `server/models/Product.js`

- [ ] **Step 1: Replace the schema with the extended version**

  ```js
  const { Schema, model, Types } = require("mongoose");
  const crypto = require("crypto");

  const categories = [
    "Living room",
    "Bedroom",
    "Dining room",
    "Home office",
    "Outdoor",
  ];

  const imagePattern = /^(https?:\/\/|assets\/images\/)[^ ]+\.?(png|jpg|jpeg)(\?.*)?$/;

  function slugify(name) {
    return name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  const productSchema = new Schema(
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      shortDescription: { type: String, required: true, maxlength: 200 },
      images: {
        type: [String],
        required: true,
        validate: [
          {
            validator: (v) => Array.isArray(v) && v.length >= 1,
            message: "At least one image is required",
          },
          {
            validator: (v) => v.every((url) => imagePattern.test(url)),
            message: "Invalid image URL in images[]",
          },
        ],
      },
      category: {
        type: [String],
        required: true,
        validate: {
          validator: (v) => v.every((c) => categories.includes(c)),
          message: (props) =>
            props.value.length > 1
              ? "Some of the categories are invalid"
              : `Invalid category - ${props.value.join()}`,
        },
      },
      style: { type: String, required: true },
      dimensions: {
        type: { height: Number, width: Number, depth: Number },
        required: true,
        _id: false,
      },
      material: { type: [String], required: true },
      color: { type: String, required: true },
      price: { type: Number, required: true },
      tags: { type: [String], default: [] },
      inStock: { type: Boolean, default: true },
      isFeatured: { type: Boolean, default: false },
      slug: { type: String, unique: true, index: true },
      _ownerId: { type: Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
  );

  productSchema.pre("validate", async function (next) {
    if (this.slug) return next();
    const base = slugify(this.name || "product");
    let candidate = base;
    let attempts = 0;
    // Resolve collisions deterministically with a short hex suffix.
    while (await this.constructor.exists({ slug: candidate })) {
      attempts += 1;
      const suffix = crypto.randomBytes(3).toString("hex");
      candidate = `${base}-${suffix}`;
      if (attempts > 5) break;
    }
    this.slug = candidate;
    next();
  });

  const Product = model("Product", productSchema);

  module.exports = Product;
  ```

  Notes:
  - `image` (singular) removed; `images[]` replaces it.
  - `shortDescription` required (will be filled by seed; the add-product form gets a new input in Phase 4).
  - Slug derives only on creation; if `this.slug` is set, the hook is a no-op (preserves the spec's "stable after rename" rule).

- [ ] **Step 2: Commit**

  ```bash
  git add server/models/Product.js
  ```
  Message: `feat(server): extend Product schema with images[], shortDescription, tags, inStock, isFeatured, slug`

### Task 2.2: Test the slug hook

**Files:**
- Create: `server/test/product-slug.test.js`
- Modify: `server/package.json`

- [ ] **Step 1: Add a `test` script**

  Modify `server/package.json` scripts block:
  ```json
  "scripts": {
    "start": "node index.js",
    "test": "node --test ./test"
  }
  ```

- [ ] **Step 2: Write a slug-derivation test using `node:test` against a connected test DB**

  Create `server/test/product-slug.test.js`:

  ```js
  const test = require("node:test");
  const assert = require("node:assert/strict");
  const mongoose = require("mongoose");
  const Product = require("../models/Product");

  const TEST_URI =
    process.env.TEST_MONGO_URI || "mongodb://127.0.0.1:27017/dream-furniture-test";

  async function connect() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_URI);
    }
    await Product.deleteMany({});
  }

  test("slug derives from name on create", async () => {
    await connect();
    const p = await Product.create({
      name: "Halden Lounge",
      description: "x",
      shortDescription: "x",
      images: ["https://example.com/a.jpg"],
      category: ["Living room"],
      style: "Mid-century",
      dimensions: { height: 1, width: 1, depth: 1 },
      material: ["Wood"],
      color: "brown",
      price: 1,
    });
    assert.equal(p.slug, "halden-lounge");
  });

  test("slug stays stable on rename", async () => {
    await connect();
    const p = await Product.create({
      name: "Marlow Sofa",
      description: "x",
      shortDescription: "x",
      images: ["https://example.com/a.jpg"],
      category: ["Living room"],
      style: "Contemporary",
      dimensions: { height: 1, width: 1, depth: 1 },
      material: ["Fabric"],
      color: "grey",
      price: 1,
    });
    const original = p.slug;
    p.name = "Marlow Sofa Renamed";
    await p.save();
    assert.equal(p.slug, original);
  });

  test("slug collision gets a suffix", async () => {
    await connect();
    await Product.create({
      name: "Saga Bed",
      description: "x",
      shortDescription: "x",
      images: ["https://example.com/a.jpg"],
      category: ["Bedroom"],
      style: "Scandinavian",
      dimensions: { height: 1, width: 1, depth: 1 },
      material: ["Wood"],
      color: "brown",
      price: 1,
    });
    const second = await Product.create({
      name: "Saga Bed",
      description: "x",
      shortDescription: "x",
      images: ["https://example.com/a.jpg"],
      category: ["Bedroom"],
      style: "Scandinavian",
      dimensions: { height: 1, width: 1, depth: 1 },
      material: ["Wood"],
      color: "brown",
      price: 1,
    });
    assert.notEqual(second.slug, "saga-bed");
    assert.match(second.slug, /^saga-bed-[a-f0-9]{6}$/);
  });

  test.after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await Product.deleteMany({});
      await mongoose.disconnect();
    }
  });
  ```

- [ ] **Step 3: Run the tests against a local MongoDB**

  From `server/`: `npm test`
  Expected: 3 passing tests. If MongoDB is not running locally, start it first; tests use `dream-furniture-test` DB.

- [ ] **Step 4: Commit**

  ```bash
  git add server/package.json server/test/product-slug.test.js
  ```
  Message: `test(server): cover slug derivation, stability, and collision suffix`

### Task 2.3: Update productService for new query params and slug lookup

**Files:**
- Modify: `server/services/productService.js`

- [ ] **Step 1: Replace `getProducts` and add `getProductBySlugOrId`**

  Replace the file body (keep existing imports):

  ```js
  const Product = require("../models/Product");

  async function getProducts(query) {
    const optionsArr = [];

    if (query.category) {
      const cats = Array.isArray(query.category) ? query.category : [query.category];
      optionsArr.push({ category: { $in: cats } });
    }

    if (query.search) {
      optionsArr.push({ name: { $regex: new RegExp(query.search, "i") } });
    }

    if (query.priceRange) {
      const { lower, upper } = query.priceRange;
      optionsArr.push({ price: { $gte: Number(lower) || 0, $lte: Number(upper) } });
    }

    if (query.isFeatured !== undefined) {
      optionsArr.push({ isFeatured: String(query.isFeatured) === "true" });
    }

    if (query.tag) {
      const tags = Array.isArray(query.tag) ? query.tag : [query.tag];
      optionsArr.push({ tags: { $in: tags } });
    }

    const queryObj = optionsArr.length > 0 ? { $and: optionsArr } : {};
    let q = Product.find(queryObj).sort(query.sort || null);
    if (query.offset) q = q.skip(Number(query.offset));
    if (query.limit) q = q.limit(Number(query.limit));
    return await q;
  }

  async function getProductById(productId) {
    return await Product.findById(productId).populate("_ownerId").lean();
  }

  async function getProductBySlugOrId(slugOrId) {
    let product = await Product.findOne({ slug: slugOrId }).populate("_ownerId").lean();
    if (!product && /^[a-f0-9]{24}$/i.test(slugOrId)) {
      product = await Product.findById(slugOrId).populate("_ownerId").lean();
    }
    return product;
  }

  async function addProduct(data) {
    return await Product.create(data);
  }

  async function updateProduct(productId, data) {
    const product = await Product.findById(productId);
    product.name = data.name;
    product.description = data.description;
    product.shortDescription = data.shortDescription;
    product.images = data.images;
    product.category = data.category;
    product.style = data.style;
    product.dimensions = {
      width: Number(data.dimensions.width),
      height: Number(data.dimensions.height),
      depth: Number(data.dimensions.depth),
    };
    product.material = data.material;
    product.color = data.color;
    product.price = Number(data.price);
    if (data.inStock !== undefined) product.inStock = !!data.inStock;
    return await product.save();
  }

  async function deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId);
  }

  async function getOwn(userId) {
    return await Product.find({ _ownerId: userId });
  }

  const productService = {
    getProducts,
    getProductById,
    getProductBySlugOrId,
    addProduct,
    updateProduct,
    deleteProduct,
    getOwn,
  };

  module.exports = productService;
  ```

  Notes:
  - `getProductById` is **kept** because the wishlist/edit/delete endpoints still receive an ObjectId via `:id` and the `preload` middleware uses it.
  - `getProductBySlugOrId` is **new** and powers the `GET /products/:slug` route.
  - The `image` field is replaced by `images` in `updateProduct`.

- [ ] **Step 2: Commit**

  ```bash
  git add server/services/productService.js
  ```
  Message: `feat(server): support isFeatured, multi-category, offset, and slug lookup`

### Task 2.4: Update productController routing

**Files:**
- Modify: `server/controllers/productController.js`

- [ ] **Step 1: Replace the controller**

  ```js
  const { isUser, isOwner } = require("../middlewares/guards");
  const preload = require("../middlewares/preload");
  const wishlistService = require("../services/wishlistService");
  const productService = require("../services/productService");
  const errorParser = require("../util/errorParser");

  const productController = require("express").Router();

  productController.get("/", async (req, res) => {
    try {
      const products = await productService.getProducts(req.query);
      res.json(products);
    } catch (error) {
      res.status(400).json({ message: errorParser(error) });
    }
  });

  // Slug-or-id lookup. Slug wins; 24-char hex falls back to id lookup.
  productController.get("/:slug", async (req, res) => {
    try {
      const product = await productService.getProductBySlugOrId(req.params.slug);
      if (!product) return res.status(404).json({ message: "Product not found" });
      const safeUser = product._ownerId
        ? {
            _id: product._ownerId._id,
            email: product._ownerId.email,
            username: product._ownerId.username,
          }
        : null;
      res.json({ ...product, _ownerId: safeUser });
    } catch (error) {
      res.status(400).json({ message: errorParser(error) });
    }
  });

  productController.post("/", isUser(), async (req, res) => {
    try {
      const data = req.body;
      data._ownerId = req.user._id;
      const product = await productService.addProduct(data);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: errorParser(error) });
    }
  });

  productController.put("/:id", preload(), isOwner(), async (req, res) => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: errorParser(error) });
    }
  });

  productController.delete("/:id", preload(), isOwner(), async (req, res) => {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ message: errorParser(error) });
    }
  });

  productController.post("/:id/wishlist", isUser(), async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.user?._id;
      const user = await wishlistService.toggleItemInWishlist(userId, productId);
      const safeUser = {
        _id: user._id,
        email: user.email,
        username: user.username,
        wishlist: user.wishlist,
      };
      res.json(safeUser);
    } catch (error) {
      res.status(400).json({ message: errorParser(error) });
    }
  });

  module.exports = productController;
  ```

  Notes: PUT/DELETE/wishlist routes still accept `:id` (ObjectId), because they're called by client code that has the loaded product object (the client looks up `_id` from the product after a slug-based GET).

- [ ] **Step 2: Smoke test**

  Start `npm start` from `server/`. With existing data still in the DB, hit:
  - `curl http://localhost:3030/products?isFeatured=false&limit=2` → JSON array
  - Existing product detail by id still works via the slug-or-id fallback.
  Stop the server.

- [ ] **Step 3: Commit**

  ```bash
  git add server/controllers/productController.js
  ```
  Message: `feat(server): GET /products/:slug with id fallback`

### Task 2.5: Create the synthetic house user seed

**Files:**
- Create: `server/seed/house-user.js`

- [ ] **Step 1: Write the script**

  ```js
  const bcrypt = require("bcrypt");
  const User = require("../models/User");

  const HOUSE_EMAIL = "house@dreamfurniture.local";
  const HOUSE_USERNAME = "DreamFurniture";

  async function ensureHouseUser() {
    let user = await User.findOne({ email: HOUSE_EMAIL });
    if (user) return user;
    const password = require("crypto").randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      email: HOUSE_EMAIL,
      username: HOUSE_USERNAME,
      hashedPassword,
    });
    console.log(`[seed] Created house user ${HOUSE_EMAIL}`);
    return user;
  }

  module.exports = { ensureHouseUser, HOUSE_EMAIL };
  ```

  *Note:* If the User model uses different field names for the password hash, adjust the property name. Read `server/models/User.js` first and match.

- [ ] **Step 2: Commit**

  ```bash
  git add server/seed/house-user.js
  ```
  Message: `chore(server): add idempotent house-user seed helper`

### Task 2.6: Create the products seed (24 curated entries)

**Files:**
- Create: `server/seed/products.js`
- Create: `server/seed/catalog.js` (data only)

The seed splits into two files: `catalog.js` is the static product data (no DB code), `products.js` is the runner. This keeps the data file readable and the runner reusable.

- [ ] **Step 1: Create the catalog data file**

  Path: `server/seed/catalog.js`

  Each product gets 3–4 image URLs. For the initial seed we use Lorem Picsum (matches the schema's URL pattern, returns a real image). Phase 9 swaps in curated Unsplash URLs.

  ```js
  // 24 curated products spread across 5 categories and 5 styles.
  // Image URLs are Picsum placeholders for the initial seed; replaced in Phase 9.
  const img = (seed) => `https://picsum.photos/seed/${seed}/1600/1100.jpg`;

  const catalog = [
    {
      name: "Halden Lounge",
      shortDescription: "A reclined silhouette in saddle leather and walnut.",
      description:
        "Halden takes the mid-century lounge to its quietest expression. The frame is solid walnut, mortise-and-tenoned for stillness; the cushioning is hand-stitched saddle leather over horsehair. Built to settle into for a long evening.\n\nDelivery is white-glove; assembly takes minutes.",
      images: [img("halden-1"), img("halden-2"), img("halden-3"), img("halden-4")],
      category: ["Living room"],
      style: "Mid-century",
      dimensions: { height: 820, width: 760, depth: 880 },
      material: ["Walnut", "Leather"],
      color: "brown",
      price: 1890,
      tags: ["walnut", "leather", "handcrafted"],
      isFeatured: true,
    },
    {
      name: "Marlow Sofa",
      shortDescription: "Three seats of brushed bouclé on an oak plinth.",
      description:
        "Marlow is a long, low sofa designed to anchor a room without filling it. The bouclé is wool-rich and density-tuned; the plinth is white oak with a soft natural oil.\n\nMade to order in eight weeks.",
      images: [img("marlow-1"), img("marlow-2"), img("marlow-3"), img("marlow-4")],
      category: ["Living room"],
      style: "Contemporary",
      dimensions: { height: 720, width: 2400, depth: 950 },
      material: ["Oak", "Bouclé"],
      color: "white",
      price: 3200,
      tags: ["bouclé", "oak", "made-to-order"],
      isFeatured: true,
    },
    {
      name: "Nori Coffee Table",
      shortDescription: "A low slab of charred ash on tapered legs.",
      description:
        "Nori uses shou sugi ban — Japanese charred ash — for its top, sealing the grain in deep matte black. Legs are blackened steel, tapered to almost-nothing.\n\nA piece that disappears underneath the room around it.",
      images: [img("nori-1"), img("nori-2"), img("nori-3")],
      category: ["Living room"],
      style: "Japandi",
      dimensions: { height: 320, width: 1200, depth: 600 },
      material: ["Ash", "Steel"],
      color: "black",
      price: 740,
      tags: ["shou-sugi-ban", "low", "japandi"],
    },
    {
      name: "Atlas Bookshelf",
      shortDescription: "Welded steel shelving with reclaimed oak planks.",
      description:
        "Atlas is industrial in the original sense — built for libraries and workshops. Powder-coated steel uprights, oak planks pulled from decommissioned barns.\n\nFloor-anchored or freestanding; ships flat.",
      images: [img("atlas-1"), img("atlas-2"), img("atlas-3"), img("atlas-4")],
      category: ["Living room", "Home office"],
      style: "Industrial",
      dimensions: { height: 2100, width: 1800, depth: 380 },
      material: ["Steel", "Oak"],
      color: "black",
      price: 1150,
      tags: ["industrial", "modular"],
    },
    {
      name: "Linden Sideboard",
      shortDescription: "Fluted ash doors over a clean ash carcass.",
      description:
        "Linden is a Scandinavian sideboard restrained to its essentials. The fluted door fronts are turned on a horizontal lathe; the carcass is rift-cut ash.\n\nSoft-close hinges; one shelf adjustable.",
      images: [img("linden-1"), img("linden-2"), img("linden-3"), img("linden-4")],
      category: ["Living room", "Dining room"],
      style: "Scandinavian",
      dimensions: { height: 820, width: 1800, depth: 460 },
      material: ["Ash"],
      color: "white",
      price: 2400,
      tags: ["fluted", "ash", "scandinavian"],
      isFeatured: true,
    },
    {
      name: "Saga Bed",
      shortDescription: "A platform bed in white-oiled oak; no headboard.",
      description:
        "Saga is a low platform — Scandinavian in posture, intentionally without a headboard so the wall behind it can do the work. White-oiled oak frame; slatted base.\n\nKing or queen.",
      images: [img("saga-1"), img("saga-2"), img("saga-3"), img("saga-4")],
      category: ["Bedroom"],
      style: "Scandinavian",
      dimensions: { height: 280, width: 1900, depth: 2150 },
      material: ["Oak"],
      color: "white",
      price: 2180,
      tags: ["platform", "oak", "low"],
      isFeatured: true,
    },
    {
      name: "Kelda Nightstand",
      shortDescription: "A single drawer, paper-cord pull, ash carcass.",
      description:
        "Kelda is small. One drawer, one woven paper-cord pull, one open shelf below for a book. Made the same way for sixty years.",
      images: [img("kelda-1"), img("kelda-2"), img("kelda-3")],
      category: ["Bedroom"],
      style: "Japandi",
      dimensions: { height: 520, width: 420, depth: 380 },
      material: ["Ash", "Paper cord"],
      color: "white",
      price: 480,
      tags: ["small", "paper-cord", "ash"],
    },
    {
      name: "Aalto Wardrobe",
      shortDescription: "A pivoting four-door wardrobe in figured walnut.",
      description:
        "Aalto is mid-century at scale. Four pivoting doors in book-matched walnut, brushed-brass spine pulls, internal cedar lining. Hung-rail and shelves on the inside.\n\nFreestanding; not for wall mounting.",
      images: [img("aalto-1"), img("aalto-2"), img("aalto-3"), img("aalto-4")],
      category: ["Bedroom"],
      style: "Mid-century",
      dimensions: { height: 2100, width: 2000, depth: 580 },
      material: ["Walnut", "Cedar", "Brass"],
      color: "brown",
      price: 2950,
      tags: ["walnut", "wardrobe", "freestanding"],
    },
    {
      name: "Vesta Dresser",
      shortDescription: "Six drawers, soft-close, in matte plaster lacquer.",
      description:
        "Vesta is contemporary minimalism in a six-drawer. Front faces are sprayed in matte plaster lacquer over MDF; the carcass is birch ply. Soft-close runners.",
      images: [img("vesta-1"), img("vesta-2"), img("vesta-3")],
      category: ["Bedroom"],
      style: "Contemporary",
      dimensions: { height: 820, width: 1700, depth: 480 },
      material: ["Birch", "Plaster lacquer"],
      color: "white",
      price: 1640,
      tags: ["matte", "minimal"],
    },
    {
      name: "Mira Vanity",
      shortDescription: "A floating vanity with a brushed-brass mirror.",
      description:
        "Mira is wall-mounted; the top floats over open storage. Mirror is round, brushed-brass framed. Drawer fronts are oak veneer.",
      images: [img("mira-1"), img("mira-2"), img("mira-3"), img("mira-4")],
      category: ["Bedroom"],
      style: "Contemporary",
      dimensions: { height: 1500, width: 1100, depth: 420 },
      material: ["Oak", "Brass"],
      color: "brown",
      price: 1090,
      tags: ["mirror", "wall-mounted"],
    },
    {
      name: "Forge Dining Table",
      shortDescription: "A 12-seat dining slab on welded steel trestles.",
      description:
        "Forge is built for long dinners. A single live-edge slab of European oak, finished in matte oil; trestles are blackened welded steel.\n\nShipped flat; trestles bolt on with a single tool.",
      images: [img("forge-1"), img("forge-2"), img("forge-3"), img("forge-4")],
      category: ["Dining room"],
      style: "Industrial",
      dimensions: { height: 760, width: 3200, depth: 1100 },
      material: ["Oak", "Steel"],
      color: "brown",
      price: 2650,
      tags: ["live-edge", "industrial", "12-seat"],
      isFeatured: true,
    },
    {
      name: "Oslo Dining Chair",
      shortDescription: "A bentwood frame and woven paper-cord seat.",
      description:
        "Oslo follows the Scandinavian dining-chair tradition exactly: steam-bent oak frame, woven paper-cord seat, stretchers. Made to last decades.",
      images: [img("oslo-1"), img("oslo-2"), img("oslo-3")],
      category: ["Dining room"],
      style: "Scandinavian",
      dimensions: { height: 780, width: 460, depth: 480 },
      material: ["Oak", "Paper cord"],
      color: "brown",
      price: 320,
      tags: ["bentwood", "paper-cord"],
    },
    {
      name: "Rye Bench",
      shortDescription: "A hardwood dining bench with a tapered profile.",
      description:
        "Rye seats three or four. Solid hardwood plank, hand-shaped tapers, indoor-outdoor finish. Pairs with Forge.",
      images: [img("rye-1"), img("rye-2"), img("rye-3")],
      category: ["Dining room", "Outdoor"],
      style: "Mid-century",
      dimensions: { height: 460, width: 1800, depth: 350 },
      material: ["Hardwood"],
      color: "brown",
      price: 580,
      tags: ["bench", "indoor-outdoor"],
    },
    {
      name: "Larch Buffet",
      shortDescription: "A long buffet with sliding lattice doors.",
      description:
        "Larch slides — instead of swinging — its doors. The fronts are a hand-mortised lattice; behind them, two adjustable shelves.",
      images: [img("larch-1"), img("larch-2"), img("larch-3"), img("larch-4")],
      category: ["Dining room"],
      style: "Japandi",
      dimensions: { height: 820, width: 2100, depth: 460 },
      material: ["Larch"],
      color: "brown",
      price: 1820,
      tags: ["lattice", "japandi"],
    },
    {
      name: "Tide Pendant Light",
      shortDescription: "A blown-glass pendant in seafoam green.",
      description:
        "Tide is hand-blown borosilicate glass, suspended on a brass cord. Sized for a dining table or an entryway. E26 socket; bulb sold separately.",
      images: [img("tide-1"), img("tide-2"), img("tide-3")],
      category: ["Dining room", "Living room"],
      style: "Contemporary",
      dimensions: { height: 320, width: 280, depth: 280 },
      material: ["Glass", "Brass"],
      color: "green",
      price: 410,
      tags: ["pendant", "hand-blown"],
    },
    {
      name: "Ridge Desk",
      shortDescription: "A two-pedestal desk in steel and reclaimed oak.",
      description:
        "Ridge is a workhorse: 1800mm of work surface, two pedestal cabinets with file-rated drawers, cable management trough behind the top.\n\nLeft- or right-handed cable cutout.",
      images: [img("ridge-1"), img("ridge-2"), img("ridge-3"), img("ridge-4")],
      category: ["Home office"],
      style: "Industrial",
      dimensions: { height: 740, width: 1800, depth: 720 },
      material: ["Oak", "Steel"],
      color: "brown",
      price: 1290,
      tags: ["desk", "industrial", "cable-management"],
      isFeatured: true,
    },
    {
      name: "Field Task Chair",
      shortDescription: "An ergonomic task chair in wool-felt and aluminum.",
      description:
        "Field replaces mesh with high-density wool felt, layered over a five-axis ergonomic frame. Aluminum base, forward-tilt mechanism.",
      images: [img("field-1"), img("field-2"), img("field-3")],
      category: ["Home office"],
      style: "Contemporary",
      dimensions: { height: 1100, width: 660, depth: 660 },
      material: ["Wool felt", "Aluminum"],
      color: "grey",
      price: 690,
      tags: ["ergonomic", "wool-felt"],
    },
    {
      name: "Quill Shelving",
      shortDescription: "A modular wall-mount shelving system in walnut.",
      description:
        "Quill is wall-mounted via a continuous rail and brass support pegs. Shelves come in three depths; mix and stack at any height.",
      images: [img("quill-1"), img("quill-2"), img("quill-3"), img("quill-4")],
      category: ["Home office"],
      style: "Mid-century",
      dimensions: { height: 1800, width: 1500, depth: 280 },
      material: ["Walnut", "Brass"],
      color: "brown",
      price: 980,
      tags: ["modular", "wall-mounted"],
    },
    {
      name: "Loam Filing Cabinet",
      shortDescription: "Two-drawer file cabinet in clay-tone enamel.",
      description:
        "Loam is industrial archive-grade in domestic colorways. Two file-rated drawers, baked enamel in clay; brass bail pulls.",
      images: [img("loam-1"), img("loam-2"), img("loam-3")],
      category: ["Home office"],
      style: "Industrial",
      dimensions: { height: 720, width: 460, depth: 600 },
      material: ["Steel", "Brass"],
      color: "orange",
      price: 540,
      tags: ["filing", "enamel"],
    },
    {
      name: "Clay Reading Lamp",
      shortDescription: "A ceramic floor lamp with a paper drum shade.",
      description:
        "Clay's body is wheel-thrown stoneware in unglazed terracotta; the shade is hand-rolled paper. E14 socket; reaches 1.5m.",
      images: [img("clay-1"), img("clay-2"), img("clay-3"), img("clay-4")],
      category: ["Home office", "Living room"],
      style: "Japandi",
      dimensions: { height: 1500, width: 380, depth: 380 },
      material: ["Stoneware", "Paper"],
      color: "orange",
      price: 280,
      tags: ["lamp", "ceramic", "japandi"],
    },
    {
      name: "Coast Lounge Chair",
      shortDescription: "An outdoor lounge in teak and quick-dry sling.",
      description:
        "Coast is built for terraces. Teak, finished bare for natural patina; quick-dry sling fabric in cement grey. Stainless-steel hardware.",
      images: [img("coast-1"), img("coast-2"), img("coast-3"), img("coast-4")],
      category: ["Outdoor"],
      style: "Contemporary",
      dimensions: { height: 880, width: 720, depth: 920 },
      material: ["Teak", "Sling"],
      color: "grey",
      price: 870,
      tags: ["outdoor", "teak"],
    },
    {
      name: "Anvil Fire Table",
      shortDescription: "A patinated steel fire table on iron legs.",
      description:
        "Anvil is a propane fire pit doubled as a low table. Patinated cor-ten steel top, lava rocks included, hidden gas line, 50,000 BTU burner.",
      images: [img("anvil-1"), img("anvil-2"), img("anvil-3"), img("anvil-4")],
      category: ["Outdoor"],
      style: "Industrial",
      dimensions: { height: 380, width: 1100, depth: 1100 },
      material: ["Cor-ten steel", "Iron"],
      color: "brown",
      price: 1460,
      tags: ["fire-pit", "outdoor"],
    },
    {
      name: "Drift Dining Set",
      shortDescription: "Outdoor dining table plus four chairs in white oak.",
      description:
        "Drift is a complete dining set engineered for the outdoors: one 1800mm table plus four armchairs, all in marine-grade white oak with weather-rated joinery.",
      images: [img("drift-1"), img("drift-2"), img("drift-3"), img("drift-4")],
      category: ["Outdoor"],
      style: "Scandinavian",
      dimensions: { height: 760, width: 1800, depth: 900 },
      material: ["White oak"],
      color: "white",
      price: 2200,
      tags: ["outdoor", "dining-set"],
    },
    {
      name: "Bramble Planter Bench",
      shortDescription: "A garden bench with a planter inset on each end.",
      description:
        "Bramble integrates two cedar planters into a bench's profile, so the seat is enclosed by greenery. Recommended for sun-bright entryways.",
      images: [img("bramble-1"), img("bramble-2"), img("bramble-3")],
      category: ["Outdoor"],
      style: "Japandi",
      dimensions: { height: 460, width: 1800, depth: 460 },
      material: ["Cedar"],
      color: "brown",
      price: 390,
      tags: ["planter", "garden"],
    },
  ];

  module.exports = catalog;
  ```

- [ ] **Step 2: Create the seed runner**

  Path: `server/seed/products.js`

  ```js
  require("dotenv").config();
  const mongoose = require("mongoose");
  const Product = require("../models/Product");
  const catalog = require("./catalog");
  const { ensureHouseUser } = require("./house-user");

  async function run() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("Missing MONGO_URI in environment");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("[seed] Connected to MongoDB");

    const houseUser = await ensureHouseUser();
    console.log(`[seed] House user: ${houseUser._id}`);

    const deleted = await Product.deleteMany({});
    console.log(`[seed] Cleared ${deleted.deletedCount} existing products`);

    const docs = catalog.map((p) => ({ ...p, _ownerId: houseUser._id }));
    const inserted = await Product.create(docs);
    console.log(`[seed] Inserted ${inserted.length} curated products`);

    await mongoose.disconnect();
    console.log("[seed] Done");
  }

  run().catch((err) => {
    console.error("[seed] FAILED:", err);
    process.exit(1);
  });
  ```

- [ ] **Step 3: Add the npm script**

  Modify `server/package.json`:
  ```json
  "scripts": {
    "start": "node index.js",
    "test": "node --test ./test",
    "seed": "node ./seed/products.js"
  }
  ```

- [ ] **Step 4: Run the seed**

  From `server/`:
  ```bash
  npm run seed
  ```
  Expected output:
  ```
  [seed] Connected to MongoDB
  [seed] House user: <objectId>
  [seed] Cleared N existing products
  [seed] Inserted 24 curated products
  [seed] Done
  ```

- [ ] **Step 5: Verify in DB**

  Connect to MongoDB and confirm 24 products exist with `images` arrays of length ≥ 3 and slugs derived from names.

- [ ] **Step 6: Commit**

  ```bash
  git add server/seed/catalog.js server/seed/products.js server/package.json
  ```
  Message:
  ```
  feat(server): seed 24 curated products owned by a synthetic house user

  Adds an idempotent seed runner that wipes products and inserts a
  hand-curated catalog covering all five categories and five styles.
  Image URLs use Picsum placeholders for now; real photos are swapped
  in during Phase 9.
  ```

---

## Phase 3 — Client types, routes, API service

### Task 3.1: Update Product TypeScript types

**Files:**
- Modify: `client/src/app/types/Product.ts`

- [ ] **Step 1: Replace the file**

  ```ts
  import { User } from "./User";

  export interface Product {
    name: string;
    description: string;
    shortDescription: string;
    images: string[];
    category: string[];
    style: string;
    dimensions: { height: number; width: number; depth: number };
    material: string[];
    color: string;
    price: number;
    tags?: string[];
    inStock?: boolean;
  }

  export interface APIProduct extends Product {
    _id: string;
    slug: string;
    isFeatured: boolean;
    inStock: boolean;
    tags: string[];
    _ownerId: string;
    __v: string;
    createdAt: string;
  }

  export interface PopulatedProduct extends Omit<APIProduct, "_ownerId"> {
    _ownerId: User;
  }
  ```

- [ ] **Step 2: Build, fix call sites that still reference `image` (singular)**

  From `client/`: `npm run build`
  Expect TypeScript errors in:
  - `home.component.html` — `product.image`
  - `products.component.html` — `prod.image`
  - `product-details.component.html` — `product()?.image`
  - `add-product.component.ts` — `image: editProduct.image` and `safeValues.image`
  - `wishlist.component.html` (or similar) — anywhere `image` is bound

  Do **not** fix them yet — Tasks 3.2 / 3.3 / 3.4 / 4 will systematically address each. This step is just to enumerate.

- [ ] **Step 3: Commit**

  ```bash
  git add client/src/app/types/Product.ts
  ```
  Message: `refactor(client): extend Product types with images[], slug, shortDescription, etc.`

### Task 3.2: Add new API service signatures

**Files:**
- Modify: `client/src/app/shared/api.service.ts`

- [ ] **Step 1: Replace with extended service**

  ```ts
  import { Injectable, inject } from "@angular/core";
  import { HttpClient, HttpParams } from "@angular/common/http";
  import { Params } from "@angular/router";

  import { APIProduct, PopulatedProduct, Product } from "../types/Product";
  import { User } from "../types/User";

  @Injectable({ providedIn: "root" })
  export class ApiService {
    private http = inject(HttpClient);

    getProducts(params: Params) {
      let httpParams = new HttpParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v === null || v === undefined || v === "") return;
        if (Array.isArray(v)) v.forEach((item) => (httpParams = httpParams.append(k, String(item))));
        else httpParams = httpParams.set(k, String(v));
      });
      return this.http.get<APIProduct[]>("/api/products", { params: httpParams });
    }

    getProduct(slugOrId: string) {
      return this.http.get<PopulatedProduct>(`/api/products/${slugOrId}`);
    }

    addProduct(data: Product) {
      return this.http.post<APIProduct>("/api/products", data);
    }

    updateProduct(productId: string, data: Product) {
      return this.http.put<APIProduct>(`/api/products/${productId}`, data);
    }

    deleteProduct(productId: string) {
      return this.http.delete(`/api/products/${productId}`);
    }

    toggleWishList(productId: string) {
      return this.http.post<User>(`/api/products/${productId}/wishlist`, {});
    }
  }
  ```

  Notes:
  - `getProducts` now serializes arrays as repeated keys, so `category=Living room&category=Bedroom` works.
  - The `tap(() => {})` no-op is removed.
  - `getProduct` accepts a slug or id; the server resolves either.

- [ ] **Step 2: Commit**

  ```bash
  git add client/src/app/shared/api.service.ts
  ```
  Message: `refactor(client): support array params and slug-based product lookup`

### Task 3.3: Switch routes to slug

**Files:**
- Modify: `client/src/app/app.routes.ts`

- [ ] **Step 1: Replace the `productRoutes` block**

  Inside `app.routes.ts`, replace the existing `productRoutes`:
  ```ts
  const productRoutes = {
    path: "products",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./main/products/products.component").then((m) => m.ProductsComponent),
      },
      {
        path: ":slug",
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./main/product-details/product-details.component").then(
                (m) => m.ProductDetailsComponent
              ),
          },
          {
            path: "edit",
            loadComponent: () =>
              import("./main/add-product/add-product.component").then(
                (m) => m.AddProductComponent
              ),
            canActivate: [isUserGuard],
          },
        ],
      },
    ],
  };
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add client/src/app/app.routes.ts
  ```
  Message: `refactor(client): route products by slug instead of id`

### Task 3.4: Update consumers to use slug for navigation

**Files:**
- Modify: `client/src/app/main/home/home.component.html`
- Modify: `client/src/app/main/products/products.component.html`
- Modify: `client/src/app/main/product-details/product-details.component.ts`
- Modify: `client/src/app/auth/wishlist/wishlist.component.html` (and any other place that links to a product)
- Modify: `client/src/app/auth/profile/profile.component.html` (or its posts list — wherever it lives)

- [ ] **Step 1: Grep for the affected links**

  From `client/src/`: search for `/products/` followed by a binding to `_id`. Use Grep to enumerate all occurrences:
  ```
  pattern: \[routerLink\]=.*_id
  pattern: routerLink=.*_id
  ```

- [ ] **Step 2: For each match, swap `product._id` → `product.slug` in the routerLink, and switch param key from `params['id']` → `params['slug']` in component files**

  - `home.component.html`: `[routerLink]="'/products/' + product._id"` → `[routerLink]="'/products/' + product.slug"`
  - `products.component.html`: `[routerLink]="prod._id"` → `[routerLink]="prod.slug"`
  - `product-details.component.ts`:
    - `params['id']` → `params['slug']` in `ngOnInit`
    - The component still keeps `productId` (resolved from `product()._id` after fetch) for wishlist/edit/delete writes. Replace:
      ```ts
      this.productId = params['id'];
      this.apiService.getProduct(this.productId).subscribe(...)
      ```
      with:
      ```ts
      const slug = params['slug'];
      this.apiService.getProduct(slug).subscribe({
        next: (prod) => {
          this.product.set(prod);
          this.productId = prod._id;
        },
        error: () => this.router.navigate(['/not-found']),
      });
      ```
  - Wishlist/orders/profile-posts: anywhere a product is linked, swap `_id` → `slug`. If a product preview lacks `slug` because the API trims it, ensure the API returns it (it does — `slug` is a top-level field on `APIProduct`).

- [ ] **Step 3: Build, fix any TS errors**

  From `client/`: `npm run build`. Address any remaining errors.

- [ ] **Step 4: Manual smoke**

  `npm start`. Click into a product from the homepage; URL should be `/products/halden-lounge`. Edit (when logged in as the house user) should land at `/products/halden-lounge/edit` and load the existing data. Stop the dev server.

- [ ] **Step 5: Commit**

  ```bash
  git add -p client/
  ```
  Message: `refactor(client): navigate products by slug everywhere`

---

## Phase 4 — Add-product form schema updates

### Task 4.1: Convert single image input to images repeater

**Files:**
- Modify: `client/src/app/main/add-product/add-product.component.ts`
- Modify: `client/src/app/main/add-product/add-product.component.html`

- [ ] **Step 1: Update the form group and helpers**

  In the component class:
  ```ts
  import { FormArray, FormControl } from "@angular/forms";

  // inside the class, replace addProductForm:
  addProductForm = this.fb.group({
    name: ["", Validators.required],
    description: ["", Validators.required],
    shortDescription: ["", [Validators.required, Validators.maxLength(200)]],
    images: this.fb.array([this.fb.control("", Validators.required)]),
    category: [[""], Validators.required],
    style: ["", Validators.required],
    height: ["", Validators.required],
    width: ["", Validators.required],
    depth: ["", Validators.required],
    material: [[""], Validators.required],
    color: ["", Validators.required],
    price: ["", Validators.required],
    inStock: [true],
  });

  get images(): FormArray<FormControl<string | null>> {
    return this.addProductForm.get("images") as FormArray<FormControl<string | null>>;
  }

  addImageInput() {
    this.images.push(this.fb.control("", Validators.required));
  }

  removeImageInput(index: number) {
    if (this.images.length > 1) this.images.removeAt(index);
  }
  ```

- [ ] **Step 2: Update `ngOnInit` patch logic and `handleClick` payload**

  In `ngOnInit`'s subscribe, replace the `addProductForm.patchValue({...})` block. Because `images` is a `FormArray`, you must reset it before patching:
  ```ts
  // ... inside the existing subscribe(currentProd => { ... })
  const { dimensions, images, ...editProduct } = currentProd;
  this.images.clear();
  (images || []).forEach((url) => this.images.push(this.fb.control(url, Validators.required)));
  this.addProductForm.patchValue({
    width: String(dimensions.width),
    height: String(dimensions.height),
    depth: String(dimensions.depth),
    name: editProduct.name,
    category: editProduct.category ?? [],
    color: editProduct.color,
    description: editProduct.description,
    shortDescription: editProduct.shortDescription,
    material: editProduct.material,
    price: String(editProduct.price),
    style: editProduct.style,
    inStock: editProduct.inStock,
  });
  ```

  In `handleClick`, replace the payload construction:
  ```ts
  const { width, height, depth, images, ...values } = this.addProductForm.value;
  const dimensions = {
    width: Number(width),
    height: Number(height),
    depth: Number(depth),
  };
  const data = {
    name: values.name || "",
    description: values.description || "",
    shortDescription: values.shortDescription || "",
    images: (images || []).filter((u): u is string => !!u && u.length > 0),
    category: Array.isArray(values.category) ? values.category : [],
    style: values.style || "",
    material: Array.isArray(values.material) ? values.material : [],
    color: values.color || "",
    price: Number(values.price) || 0,
    inStock: values.inStock ?? true,
    dimensions,
  };
  ```

- [ ] **Step 3: Update the template**

  In `add-product.component.html`, find the existing single image input and replace it with a repeater. Add the new short-description and in-stock inputs near the description field. Approximate insertion (match existing Material form-field patterns):

  ```html
  <mat-form-field appearance="outline">
    <mat-label>Short description</mat-label>
    <input matInput formControlName="shortDescription" maxlength="200" />
  </mat-form-field>

  <div formArrayName="images" class="image-repeater">
    <label>Images (URLs)</label>
    @for (ctrl of images.controls; track $index; let i = $index) {
      <div class="image-row">
        <mat-form-field appearance="outline" class="image-input">
          <input matInput [formControlName]="i" placeholder="https://..." />
        </mat-form-field>
        <button type="button" (click)="removeImageInput(i)" [disabled]="images.length === 1">Remove</button>
      </div>
    }
    <button type="button" (click)="addImageInput()">Add image</button>
  </div>

  <mat-checkbox formControlName="inStock">In stock</mat-checkbox>
  ```

  (Keep all other existing form fields unchanged. Add `MatCheckboxModule` to the component's `imports`.)

- [ ] **Step 4: Build and smoke test**

  `npm run build`, fix any TS errors. Then `npm start`, log in (or use the house user via direct API), navigate to `/add-product`, fill the form (including 2 images), submit. Verify the new product appears with both images and short description.

- [ ] **Step 5: Commit**

  ```bash
  git add client/src/app/main/add-product/
  ```
  Message: `feat(client): add-product form supports images[], shortDescription, inStock`

---

## Phase 5 — Shared UI primitives

### Task 5.1: `<app-eyebrow>` primitive

**Files:**
- Create: `client/src/app/shared/ui/eyebrow/eyebrow.component.ts`
- Create: `client/src/app/shared/ui/eyebrow/eyebrow.component.html`
- Create: `client/src/app/shared/ui/eyebrow/eyebrow.component.css`
- Create: `client/src/app/shared/ui/eyebrow/eyebrow.component.spec.ts`

- [ ] **Step 1: Component class**

  ```ts
  import { ChangeDetectionStrategy, Component, input } from "@angular/core";

  @Component({
    selector: "app-eyebrow",
    templateUrl: "./eyebrow.component.html",
    styleUrl: "./eyebrow.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class EyebrowComponent {
    text = input.required<string>();
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <p class="eyebrow">{{ text() }}</p>
  ```

- [ ] **Step 3: Styles**

  ```css
  .eyebrow {
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-ink-muted);
  }
  ```

- [ ] **Step 4: Smoke test**

  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { EyebrowComponent } from "./eyebrow.component";

  describe("EyebrowComponent", () => {
    let fixture: ComponentFixture<EyebrowComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [EyebrowComponent] }).compileComponents();
      fixture = TestBed.createComponent(EyebrowComponent);
      fixture.componentRef.setInput("text", "FEATURED");
      fixture.detectChanges();
    });

    it("renders the text", () => {
      const el = fixture.nativeElement.querySelector(".eyebrow");
      expect(el.textContent.trim()).toBe("FEATURED");
    });
  });
  ```

- [ ] **Step 5: Run, commit**

  `npm test -- --watch=false --browsers=ChromeHeadless --include='**/eyebrow.component.spec.ts'`
  Then commit:
  ```
  feat(client): add Eyebrow UI primitive
  ```

### Task 5.2: `<app-section-heading>` primitive

**Files:** four files under `client/src/app/shared/ui/section-heading/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component, input } from "@angular/core";
  import { EyebrowComponent } from "../eyebrow/eyebrow.component";

  @Component({
    selector: "app-section-heading",
    imports: [EyebrowComponent],
    templateUrl: "./section-heading.component.html",
    styleUrl: "./section-heading.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class SectionHeadingComponent {
    eyebrow = input.required<string>();
    title = input.required<string>();
    align = input<"left" | "center">("left");
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <header class="section-heading" [class.center]="align() === 'center'">
    <app-eyebrow [text]="eyebrow()" />
    <h2>{{ title() }}</h2>
  </header>
  ```

- [ ] **Step 3: Styles**

  ```css
  .section-heading { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-7); }
  .section-heading.center { align-items: center; text-align: center; }
  .section-heading h2 { font-size: var(--fs-2xl); }
  @media (min-width: 800px) {
    .section-heading h2 { font-size: var(--fs-3xl); }
  }
  ```

- [ ] **Step 4: Smoke spec**

  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { SectionHeadingComponent } from "./section-heading.component";

  describe("SectionHeadingComponent", () => {
    let fixture: ComponentFixture<SectionHeadingComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [SectionHeadingComponent] }).compileComponents();
      fixture = TestBed.createComponent(SectionHeadingComponent);
      fixture.componentRef.setInput("eyebrow", "FEATURED");
      fixture.componentRef.setInput("title", "This season's pieces");
      fixture.detectChanges();
    });

    it("renders eyebrow and title", () => {
      const root = fixture.nativeElement;
      expect(root.querySelector(".eyebrow").textContent.trim()).toBe("FEATURED");
      expect(root.querySelector("h2").textContent.trim()).toBe("This season's pieces");
    });
  });
  ```

- [ ] **Step 5: Commit**

  Message: `feat(client): add SectionHeading UI primitive`

### Task 5.3: `<app-hairline-button>` primitive

**Files:** four files under `client/src/app/shared/ui/hairline-button/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component, input } from "@angular/core";
  import { RouterLink } from "@angular/router";

  @Component({
    selector: "app-hairline-button",
    imports: [RouterLink],
    templateUrl: "./hairline-button.component.html",
    styleUrl: "./hairline-button.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class HairlineButtonComponent {
    label = input.required<string>();
    href = input<string | null>(null);
    arrow = input<boolean>(true);
  }
  ```

- [ ] **Step 2: Template**

  ```html
  @if (href()) {
    <a [routerLink]="href()" class="hairline-btn">
      <span>{{ label() }}</span>
      @if (arrow()) { <span class="arrow">→</span> }
    </a>
  } @else {
    <button class="hairline-btn" type="button">
      <span>{{ label() }}</span>
      @if (arrow()) { <span class="arrow">→</span> }
    </button>
  }
  ```

- [ ] **Step 3: Styles**

  ```css
  .hairline-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) 0;
    font-family: var(--font-body);
    font-size: var(--fs-sm);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-ink);
    border-bottom: 1px solid var(--color-ink);
    transition: color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
  }
  .hairline-btn:hover { color: var(--color-accent); border-color: var(--color-accent); }
  .arrow { transition: transform var(--dur-base) var(--ease-out); }
  .hairline-btn:hover .arrow { transform: translateX(4px); }
  ```

- [ ] **Step 4: Smoke spec & commit**

  Spec checks: renders an `<a>` with `routerLink` when `href()` is set, renders a `<button>` otherwise. Then commit: `feat(client): add HairlineButton UI primitive`.

### Task 5.4: Restyle existing `loader-card` to tokens

**Files:**
- Modify: `client/src/app/shared/loader-card/loader-card.component.css`

- [ ] **Step 1: Replace the loader-card stylesheet with token-based version**

  ```css
  :host {
    display: block;
    background: var(--color-surface);
    border: 1px solid var(--color-line);
    border-radius: var(--radius-sm);
    overflow: hidden;
    aspect-ratio: 4 / 5;
    position: relative;
  }
  :host::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      var(--color-surface-muted) 0%,
      var(--color-line) 50%,
      var(--color-surface-muted) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s var(--ease-out) infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  ```

  *Open the existing template* — if it has internal markup that paints over `::before`, simplify the template to an empty host (`<!-- skeleton -->`).

- [ ] **Step 2: Commit**

  Message: `style(client): restyle loader-card with design tokens`

### Task 5.5: Shared `<app-product-card>`

**Files:** four files under `client/src/app/main/products/product-card/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component, input } from "@angular/core";
  import { RouterLink } from "@angular/router";
  import { APIProduct, PopulatedProduct } from "../../../types/Product";
  import { FloorPricePipe } from "../../../shared/pipes/floor-price.pipe";
  import { DecimalSlicePipe } from "../../../shared/pipes/decimal-slice.pipe";

  export type CardDensity = "featured" | "default" | "rail";

  @Component({
    selector: "app-product-card",
    imports: [RouterLink, FloorPricePipe, DecimalSlicePipe],
    templateUrl: "./product-card.component.html",
    styleUrl: "./product-card.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class ProductCardComponent {
    product = input.required<APIProduct | PopulatedProduct>();
    density = input<CardDensity>("default");
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <a class="card" [class]="'density-' + density()" [routerLink]="'/products/' + product().slug">
    <div class="media">
      <img [src]="product().images[0]" [alt]="product().name" loading="lazy" />
    </div>
    <div class="content">
      <h3 class="name">{{ product().name }}</h3>
      <p class="price">
        ${{ product().price | floorPrice }}<span>{{ product().price | decimalSlice }}</span>
      </p>
    </div>
  </a>
  ```

- [ ] **Step 3: Styles**

  ```css
  .card {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    color: var(--color-ink);
  }
  .media {
    overflow: hidden;
    background: var(--color-surface-muted);
    aspect-ratio: 4 / 5;
  }
  .media img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform var(--dur-slow) var(--ease-out);
  }
  .card:hover .media img { transform: scale(1.03); }
  .name {
    font-family: var(--font-display);
    font-size: var(--fs-lg);
    font-weight: 400;
    transition: color var(--dur-fast) var(--ease-out);
  }
  .card:hover .name { color: var(--color-accent); }
  .price {
    font-family: var(--font-display);
    font-size: var(--fs-lg);
    color: var(--color-ink);
    display: inline-flex;
    align-items: flex-start;
  }
  .price span { font-size: 0.6em; padding-top: 0.3em; }

  .density-featured .media { aspect-ratio: 4 / 5; }
  .density-rail { width: 280px; flex-shrink: 0; }
  .density-rail .media { aspect-ratio: 1 / 1; }
  ```

- [ ] **Step 4: Smoke spec**

  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { RouterTestingModule } from "@angular/router/testing";
  import { ProductCardComponent } from "./product-card.component";
  import { APIProduct } from "../../../types/Product";

  describe("ProductCardComponent", () => {
    let fixture: ComponentFixture<ProductCardComponent>;

    const product: APIProduct = {
      _id: "1", slug: "halden-lounge", name: "Halden Lounge",
      description: "", shortDescription: "",
      images: ["https://x/y.jpg"], category: ["Living room"], style: "Mid-century",
      dimensions: { height: 1, width: 1, depth: 1 },
      material: ["Wood"], color: "brown", price: 1890,
      tags: [], inStock: true, isFeatured: true,
      _ownerId: "u", __v: "0", createdAt: "",
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ProductCardComponent, RouterTestingModule],
      }).compileComponents();
      fixture = TestBed.createComponent(ProductCardComponent);
      fixture.componentRef.setInput("product", product);
      fixture.detectChanges();
    });

    it("renders name and links to slug", () => {
      const a = fixture.nativeElement.querySelector("a.card");
      expect(a.getAttribute("href")).toBe("/products/halden-lounge");
      expect(fixture.nativeElement.querySelector(".name").textContent.trim()).toBe("Halden Lounge");
    });
  });
  ```

- [ ] **Step 5: Run spec, commit**

  Message: `feat(client): add shared ProductCard with density variants`

---

## Phase 6 — Homepage redesign

### Task 6.1: `<app-hero>`

**Files:** four files under `client/src/app/main/home/sections/hero/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component } from "@angular/core";
  import { HairlineButtonComponent } from "../../../../shared/ui/hairline-button/hairline-button.component";

  @Component({
    selector: "app-hero",
    imports: [HairlineButtonComponent],
    templateUrl: "./hero.component.html",
    styleUrl: "./hero.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class HeroComponent {
    readonly heroImage = "https://picsum.photos/seed/hero-luxury/2400/1600.jpg";
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <section class="hero" [style.background-image]="'url(' + heroImage + ')'">
    <div class="overlay"></div>
    <div class="content">
      <p class="eyebrow-line">EST. 2024</p>
      <h1>Furniture, considered.</h1>
      <app-hairline-button label="Explore the collection" href="/products" />
    </div>
  </section>
  ```

- [ ] **Step 3: Styles**

  ```css
  .hero {
    position: relative;
    width: 100%;
    height: 70vh;
    min-height: 480px;
    background-size: cover;
    background-position: center;
    background-color: var(--color-surface-muted);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  @media (min-width: 800px) { .hero { height: 100vh; min-height: 640px; } }
  .overlay {
    position: absolute; inset: 0;
    background: rgba(0, 0, 0, 0.18);
  }
  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-5);
    padding: 0 var(--container-pad);
  }
  .eyebrow-line {
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }
  .content h1 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(var(--fs-3xl), 7vw, var(--fs-4xl));
    color: #fff;
    max-width: 18ch;
  }
  .content :host ::ng-deep .hairline-btn { color: #fff; border-color: #fff; }
  ```

  Replace `:host ::ng-deep` with simple `.hairline-btn` overrides if shadow piercing isn't needed — the recommended approach is to add `theme="light"` input on `HairlineButtonComponent` for dark backgrounds; for now, scoped styles work since component encapsulation in Angular is emulated and inherited classes don't leak.

  *Simpler:* skip the override; the hairline button stays dark-on-light visually because the photo overlay is darker than `--color-ink`. Test in browser; if illegible, add a dark-bg variant in a follow-up.

- [ ] **Step 4: Commit**

  Message: `feat(client): add Hero section`

### Task 6.2: `<app-featured-collection>`

**Files:** four files under `client/src/app/main/home/sections/featured-collection/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component, input } from "@angular/core";
  import { APIProduct } from "../../../../types/Product";
  import { ProductCardComponent } from "../../../products/product-card/product-card.component";
  import { SectionHeadingComponent } from "../../../../shared/ui/section-heading/section-heading.component";
  import { LoaderCardComponent } from "../../../../shared/loader-card/loader-card.component";

  @Component({
    selector: "app-featured-collection",
    imports: [ProductCardComponent, SectionHeadingComponent, LoaderCardComponent],
    templateUrl: "./featured-collection.component.html",
    styleUrl: "./featured-collection.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class FeaturedCollectionComponent {
    products = input<APIProduct[]>([]);
    loading = input<boolean>(false);
    error = input<boolean>(false);
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <section class="featured">
    <div class="container">
      <app-section-heading eyebrow="Featured" title="This season's pieces" />
      @if (loading()) {
        <div class="grid">
          <app-loader-card class="large" />
          <app-loader-card />
          <app-loader-card />
        </div>
      } @else if (error()) {
        <p class="error">Couldn't load featured pieces.</p>
      } @else if (products().length >= 3) {
        <div class="grid">
          <app-product-card class="large" [product]="products()[0]" density="featured" />
          <app-product-card [product]="products()[1]" density="default" />
          <app-product-card [product]="products()[2]" density="default" />
        </div>
      }
    </div>
  </section>
  ```

- [ ] **Step 3: Styles**

  ```css
  .featured { padding: var(--space-9) 0; }
  .container { max-width: var(--container-max); margin: 0 auto; padding: 0 var(--container-pad); }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  @media (min-width: 800px) {
    .grid {
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: var(--space-6);
    }
    .large { grid-row: 1 / 3; }
  }
  .error { color: var(--color-ink-muted); font-size: var(--fs-sm); }
  ```

- [ ] **Step 4: Commit**

  Message: `feat(client): add FeaturedCollection homepage section`

### Task 6.3: `<app-category-grid>`

**Files:** four under `client/src/app/main/home/sections/category-grid/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component } from "@angular/core";
  import { RouterLink } from "@angular/router";
  import { SectionHeadingComponent } from "../../../../shared/ui/section-heading/section-heading.component";

  interface Tile { name: string; image: string; query: string; }

  @Component({
    selector: "app-category-grid",
    imports: [RouterLink, SectionHeadingComponent],
    templateUrl: "./category-grid.component.html",
    styleUrl: "./category-grid.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class CategoryGridComponent {
    tiles: Tile[] = [
      { name: "Living room", image: "https://picsum.photos/seed/cat-living/900/1200.jpg", query: "Living room" },
      { name: "Bedroom",     image: "https://picsum.photos/seed/cat-bedroom/900/1200.jpg", query: "Bedroom" },
      { name: "Dining room", image: "https://picsum.photos/seed/cat-dining/900/1200.jpg",  query: "Dining room" },
      { name: "Home office", image: "https://picsum.photos/seed/cat-office/900/1200.jpg",  query: "Home office" },
      { name: "Outdoor",     image: "https://picsum.photos/seed/cat-outdoor/900/1200.jpg", query: "Outdoor" },
    ];
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <section class="categories">
    <div class="container">
      <app-section-heading eyebrow="Spaces" title="Browse by space" />
      <div class="grid">
        @for (tile of tiles; track tile.name) {
          <a class="tile" [routerLink]="['/products']" [queryParams]="{ category: tile.query }">
            <img [src]="tile.image" [alt]="tile.name" loading="lazy" />
            <span class="label">{{ tile.name }}</span>
          </a>
        }
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Styles**

  ```css
  .categories { padding: var(--space-9) 0; background: var(--color-surface); }
  .container { max-width: var(--container-max); margin: 0 auto; padding: 0 var(--container-pad); }
  .grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
  @media (min-width: 800px) { .grid { grid-template-columns: repeat(5, 1fr); } }
  .tile { position: relative; display: block; aspect-ratio: 3 / 4; overflow: hidden; color: #fff; }
  .tile img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--dur-slow) var(--ease-out); }
  .tile:hover img { transform: scale(1.05); }
  .tile::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 50%);
  }
  .label {
    position: absolute; left: var(--space-4); bottom: var(--space-4); z-index: 1;
    font-family: var(--font-display); font-size: var(--fs-lg);
  }
  ```

- [ ] **Step 4: Commit** — Message: `feat(client): add CategoryGrid homepage section`

### Task 6.4: `<app-new-arrivals>`

**Files:** four under `client/src/app/main/home/sections/new-arrivals/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component, input } from "@angular/core";
  import { APIProduct } from "../../../../types/Product";
  import { ProductCardComponent } from "../../../products/product-card/product-card.component";
  import { SectionHeadingComponent } from "../../../../shared/ui/section-heading/section-heading.component";
  import { LoaderCardComponent } from "../../../../shared/loader-card/loader-card.component";

  @Component({
    selector: "app-new-arrivals",
    imports: [ProductCardComponent, SectionHeadingComponent, LoaderCardComponent],
    templateUrl: "./new-arrivals.component.html",
    styleUrl: "./new-arrivals.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class NewArrivalsComponent {
    products = input<APIProduct[]>([]);
    loading = input<boolean>(false);
    error = input<boolean>(false);
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <section class="arrivals">
    <div class="container">
      <app-section-heading eyebrow="New" title="Newly arrived" />
      <div class="rail">
        @if (loading()) {
          @for (i of [1,2,3,4,5,6]; track i) { <app-loader-card class="rail-item" /> }
        } @else if (error()) {
          <p class="error">Couldn't load new arrivals.</p>
        } @else {
          @for (p of products(); track p._id) {
            <app-product-card class="rail-item" [product]="p" density="rail" />
          }
        }
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Styles**

  ```css
  .arrivals { padding: var(--space-9) 0; }
  .container { max-width: var(--container-max); margin: 0 auto; padding: 0 var(--container-pad); }
  .rail {
    display: flex;
    gap: var(--space-5);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: var(--space-4);
  }
  .rail::-webkit-scrollbar { height: 2px; }
  .rail::-webkit-scrollbar-thumb { background: var(--color-line); }
  .rail-item { scroll-snap-align: start; }
  .error { color: var(--color-ink-muted); }
  ```

- [ ] **Step 4: Commit** — Message: `feat(client): add NewArrivals homepage section`

### Task 6.5: `<app-craftsmanship>`

**Files:** four under `client/src/app/main/home/sections/craftsmanship/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component } from "@angular/core";
  import { HairlineButtonComponent } from "../../../../shared/ui/hairline-button/hairline-button.component";
  import { SectionHeadingComponent } from "../../../../shared/ui/section-heading/section-heading.component";

  @Component({
    selector: "app-craftsmanship",
    imports: [HairlineButtonComponent, SectionHeadingComponent],
    templateUrl: "./craftsmanship.component.html",
    styleUrl: "./craftsmanship.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class CraftsmanshipComponent {
    readonly image = "https://picsum.photos/seed/craft-detail/1400/1600.jpg";
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <section class="craft">
    <div class="container">
      <div class="media">
        <img [src]="image" alt="A craftsman's hand at work on a wood joint" loading="lazy" />
      </div>
      <div class="copy">
        <app-section-heading eyebrow="Made with intent" title="Each piece tells a quiet story." />
        <p>
          We work with workshops that have practiced their craft for generations. Every joint is mortise-and-tenon. Every fabric is mill-tested. Every edge is hand-finished by someone whose name we know.
        </p>
        <p>
          Our pieces are designed to outlast our involvement with them — to be passed down, refinished, and used until they're heirlooms.
        </p>
        <app-hairline-button label="Read more" href="/about" [arrow]="true" />
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Styles**

  ```css
  .craft { padding: var(--space-9) 0; background: var(--color-surface-muted); }
  .container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--container-pad);
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  @media (min-width: 800px) {
    .container { grid-template-columns: 3fr 2fr; gap: var(--space-8); align-items: center; }
  }
  .media img { width: 100%; height: auto; display: block; }
  .copy { display: flex; flex-direction: column; gap: var(--space-4); align-items: flex-start; }
  .copy p { color: var(--color-ink-muted); line-height: var(--lh-loose); }
  ```

  Note: `/about` page does not exist in this scope; the link 404s for now. That's acceptable per spec.

- [ ] **Step 4: Commit** — Message: `feat(client): add Craftsmanship homepage section`

### Task 6.6: `<app-newsletter>`

**Files:** four under `client/src/app/main/home/sections/newsletter/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
  import { FormsModule } from "@angular/forms";

  @Component({
    selector: "app-newsletter",
    imports: [FormsModule],
    templateUrl: "./newsletter.component.html",
    styleUrl: "./newsletter.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class NewsletterComponent {
    email = "";
    submitted = signal(false);

    onSubmit() {
      if (!this.email.includes("@")) return;
      this.submitted.set(true);
      this.email = "";
    }
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <section class="newsletter">
    <div class="container">
      <h3>Stay in touch</h3>
      <p>Quarterly notes on new pieces, no marketing.</p>
      @if (submitted()) {
        <p class="thanks" aria-live="polite">Thank you — we'll be in touch.</p>
      } @else {
        <form (ngSubmit)="onSubmit()">
          <input type="email" [(ngModel)]="email" name="email" placeholder="you@example.com" required />
          <button type="submit">Subscribe →</button>
        </form>
      }
    </div>
  </section>
  ```

- [ ] **Step 3: Styles**

  ```css
  .newsletter { padding: var(--space-9) 0; background: var(--color-bg); border-top: 1px solid var(--color-line); }
  .container {
    max-width: 560px;
    margin: 0 auto;
    padding: 0 var(--container-pad);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    align-items: center;
  }
  .container h3 { font-size: var(--fs-2xl); }
  .container p { color: var(--color-ink-muted); }
  form {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-ink);
  }
  input {
    flex: 1;
    padding: var(--space-3) 0;
    background: transparent;
    border: none;
    font: inherit;
    color: var(--color-ink);
    outline: none;
  }
  button {
    padding: var(--space-3) var(--space-2);
    font: inherit;
    color: var(--color-ink);
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    font-size: var(--fs-sm);
  }
  button:hover { color: var(--color-accent); }
  .thanks { color: var(--color-accent); font-family: var(--font-display); font-size: var(--fs-lg); }
  ```

- [ ] **Step 4: Commit** — Message: `feat(client): add Newsletter homepage section`

### Task 6.7: Refactor `home.component` to orchestrate sections

**Files:**
- Modify: `client/src/app/main/home/home.component.ts`
- Modify: `client/src/app/main/home/home.component.html`
- Modify: `client/src/app/main/home/home.component.css`

- [ ] **Step 1: Replace component class**

  ```ts
  import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
  import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
  import { ApiService } from "../../shared/api.service";
  import { APIProduct } from "../../types/Product";

  import { HeroComponent } from "./sections/hero/hero.component";
  import { FeaturedCollectionComponent } from "./sections/featured-collection/featured-collection.component";
  import { CategoryGridComponent } from "./sections/category-grid/category-grid.component";
  import { NewArrivalsComponent } from "./sections/new-arrivals/new-arrivals.component";
  import { CraftsmanshipComponent } from "./sections/craftsmanship/craftsmanship.component";
  import { NewsletterComponent } from "./sections/newsletter/newsletter.component";

  @Component({
    selector: "app-home",
    imports: [
      HeroComponent,
      FeaturedCollectionComponent,
      CategoryGridComponent,
      NewArrivalsComponent,
      CraftsmanshipComponent,
      NewsletterComponent,
    ],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class HomeComponent implements OnInit {
    private apiService = inject(ApiService);
    private destroyRef = inject(DestroyRef);

    readonly featured = signal<APIProduct[]>([]);
    readonly featuredLoading = signal(true);
    readonly featuredError = signal(false);

    readonly arrivals = signal<APIProduct[]>([]);
    readonly arrivalsLoading = signal(true);
    readonly arrivalsError = signal(false);

    ngOnInit(): void {
      this.apiService
        .getProducts({ isFeatured: "true", limit: 3 })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (p) => { this.featured.set(p); this.featuredLoading.set(false); },
          error: () => { this.featuredError.set(true); this.featuredLoading.set(false); },
        });

      this.apiService
        .getProducts({ sort: "createdAt:desc", limit: 8 })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (p) => { this.arrivals.set(p); this.arrivalsLoading.set(false); },
          error: () => { this.arrivalsError.set(true); this.arrivalsLoading.set(false); },
        });
    }
  }
  ```

- [ ] **Step 2: Replace template**

  ```html
  <app-hero />
  <app-featured-collection
    [products]="featured()"
    [loading]="featuredLoading()"
    [error]="featuredError()"
  />
  <app-category-grid />
  <app-new-arrivals
    [products]="arrivals()"
    [loading]="arrivalsLoading()"
    [error]="arrivalsError()"
  />
  <app-craftsmanship />
  <app-newsletter />
  ```

- [ ] **Step 3: Empty out `home.component.css`**

  All layout has moved into the sections themselves. Clear the file or replace with a single comment.

- [ ] **Step 4: Update the home spec**

  Replace `home.component.spec.ts` to match the new orchestration:
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { RouterTestingModule } from "@angular/router/testing";
  import { of, EMPTY } from "rxjs";
  import { HomeComponent } from "./home.component";
  import { ApiService } from "../../shared/api.service";

  describe("HomeComponent", () => {
    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;
    let apiServiceMock: jasmine.SpyObj<ApiService>;

    beforeEach(async () => {
      apiServiceMock = jasmine.createSpyObj("ApiService", ["getProducts"]);
      apiServiceMock.getProducts.and.returnValue(EMPTY);
      await TestBed.configureTestingModule({
        imports: [HomeComponent, RouterTestingModule],
        providers: [{ provide: ApiService, useValue: apiServiceMock }],
      }).compileComponents();
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
    });

    it("creates and queries featured + arrivals on init", () => {
      apiServiceMock.getProducts.and.returnValue(of([]));
      fixture.detectChanges();
      expect(apiServiceMock.getProducts).toHaveBeenCalledWith({ isFeatured: "true", limit: 3 });
      expect(apiServiceMock.getProducts).toHaveBeenCalledWith({ sort: "createdAt:desc", limit: 8 });
    });

    it("flips loading flags off when data arrives", () => {
      apiServiceMock.getProducts.and.returnValue(of([]));
      fixture.detectChanges();
      expect(component.featuredLoading()).toBeFalse();
      expect(component.arrivalsLoading()).toBeFalse();
    });
  });
  ```

- [ ] **Step 5: Run home spec, browser smoke**

  `npm test -- --watch=false --browsers=ChromeHeadless --include='**/home.component.spec.ts'` — pass expected. Then `npm start`, visit `/home`, confirm all six sections render with seeded data.

- [ ] **Step 6: Commit**

  Message:
  ```
  refactor(client): orchestrate home page from six standalone sections

  Removes the ad-hoc setTimeout-driven render and the legacy "Who we are"
  card; the new page composes Hero, FeaturedCollection, CategoryGrid,
  NewArrivals, Craftsmanship, and Newsletter sections.
  ```

---

## Phase 7 — Products listing redesign

### Task 7.1: Filter rail component

**Files:** four under `client/src/app/main/products/filter-rail/`.

- [ ] **Step 1: Class — emits filter changes**

  ```ts
  import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

  export interface FilterState {
    categories: string[];
    priceMin: number;
    priceMax: number;
  }

  @Component({
    selector: "app-filter-rail",
    templateUrl: "./filter-rail.component.html",
    styleUrl: "./filter-rail.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class FilterRailComponent {
    state = input.required<FilterState>();
    change = output<FilterState>();

    readonly allCategories = ["Living room", "Bedroom", "Dining room", "Home office", "Outdoor"];

    toggleCategory(cat: string) {
      const s = this.state();
      const next = s.categories.includes(cat)
        ? s.categories.filter((c) => c !== cat)
        : [...s.categories, cat];
      this.change.emit({ ...s, categories: next });
    }

    onPriceChange(min: number, max: number) {
      this.change.emit({ ...this.state(), priceMin: min, priceMax: max });
    }
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <aside class="rail">
    <section class="group">
      <p class="label">Category</p>
      <ul>
        @for (c of allCategories; track c) {
          <li>
            <button
              type="button"
              [class.active]="state().categories.includes(c)"
              (click)="toggleCategory(c)"
            >
              <span class="dot" [class.filled]="state().categories.includes(c)"></span>
              {{ c }}
            </button>
          </li>
        }
      </ul>
    </section>

    <section class="group">
      <p class="label">Price</p>
      <div class="price-row">
        <label><span>$</span><input type="number" [value]="state().priceMin" (change)="onPriceChange($any($event.target).valueAsNumber, state().priceMax)" /></label>
        <span>—</span>
        <label><span>$</span><input type="number" [value]="state().priceMax" (change)="onPriceChange(state().priceMin, $any($event.target).valueAsNumber)" /></label>
      </div>
    </section>
  </aside>
  ```

- [ ] **Step 3: Styles**

  ```css
  .rail {
    display: flex;
    flex-direction: column;
    gap: var(--space-7);
    width: 240px;
    padding-right: var(--space-5);
    border-right: 1px solid var(--color-line);
  }
  .group { display: flex; flex-direction: column; gap: var(--space-3); }
  .label {
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-ink-muted);
  }
  ul { display: flex; flex-direction: column; gap: var(--space-2); }
  button {
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-2) 0;
    font: inherit;
    color: var(--color-ink-muted);
    background: none; border: none; cursor: pointer;
    transition: color var(--dur-fast) var(--ease-out);
  }
  button.active { color: var(--color-ink); }
  button:hover { color: var(--color-ink); }
  .dot {
    width: 10px; height: 10px;
    border: 1px solid var(--color-ink-muted);
    border-radius: 50%;
  }
  .dot.filled { background: var(--color-ink); border-color: var(--color-ink); }
  .price-row { display: flex; align-items: center; gap: var(--space-3); }
  .price-row label { display: flex; align-items: center; gap: 4px; }
  .price-row input {
    width: 80px; padding: var(--space-2);
    border: 1px solid var(--color-line); background: var(--color-surface);
    font: inherit;
  }
  ```

- [ ] **Step 4: Smoke spec**

  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { FilterRailComponent } from "./filter-rail.component";

  describe("FilterRailComponent", () => {
    let fixture: ComponentFixture<FilterRailComponent>;
    let component: FilterRailComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [FilterRailComponent] }).compileComponents();
      fixture = TestBed.createComponent(FilterRailComponent);
      fixture.componentRef.setInput("state", { categories: [], priceMin: 0, priceMax: 5000 });
    });

    it("emits change when toggling a category", () => {
      const spy = jasmine.createSpy();
      component = fixture.componentInstance;
      component.change.subscribe(spy);
      fixture.detectChanges();
      component.toggleCategory("Bedroom");
      expect(spy).toHaveBeenCalledWith({ categories: ["Bedroom"], priceMin: 0, priceMax: 5000 });
    });
  });
  ```

- [ ] **Step 5: Commit** — `feat(client): add FilterRail with category and price filters`

### Task 7.2: Sort + search bar component

**Files:** four under `client/src/app/main/products/sort-search-bar/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
  import { FormsModule } from "@angular/forms";

  @Component({
    selector: "app-sort-search-bar",
    imports: [FormsModule],
    templateUrl: "./sort-search-bar.component.html",
    styleUrl: "./sort-search-bar.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class SortSearchBarComponent {
    search = input<string>("");
    sort = input<string>("");
    showReset = input<boolean>(false);

    searchChange = output<string>();
    sortChange = output<string>();
    reset = output<void>();

    localSearch = "";
    localSort = "";

    sortOptions = [
      { value: "name:asc",       text: "Name (A → Z)" },
      { value: "name:desc",      text: "Name (Z → A)" },
      { value: "price:asc",      text: "Price ↑" },
      { value: "price:desc",     text: "Price ↓" },
      { value: "createdAt:asc",  text: "Oldest first" },
      { value: "createdAt:desc", text: "Newest first" },
    ];

    ngOnInit() { this.localSearch = this.search(); this.localSort = this.sort(); }

    submitSearch() { this.searchChange.emit(this.localSearch); }
    onSortChange() { this.sortChange.emit(this.localSort); }
    onReset() { this.reset.emit(); }
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <div class="bar">
    <form class="search" (ngSubmit)="submitSearch()">
      <input type="text" placeholder="Search pieces" name="search" [(ngModel)]="localSearch" />
    </form>
    <div class="right">
      @if (showReset()) { <a class="reset" (click)="onReset()">Reset</a> }
      <select [(ngModel)]="localSort" (change)="onSortChange()">
        <option value="" disabled>Sort by</option>
        @for (o of sortOptions; track o.value) { <option [value]="o.value">{{ o.text }}</option> }
      </select>
    </div>
  </div>
  ```

- [ ] **Step 3: Styles**

  ```css
  .bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-line);
  }
  .search input {
    background: transparent; border: none; padding: var(--space-2) 0;
    font: inherit; color: var(--color-ink); outline: none;
    border-bottom: 1px solid var(--color-line);
    transition: border-color var(--dur-fast) var(--ease-out);
    min-width: 240px;
  }
  .search input:focus { border-color: var(--color-ink); }
  .right { display: flex; align-items: center; gap: var(--space-5); }
  .reset {
    font-size: var(--fs-sm); text-transform: uppercase; letter-spacing: var(--tracking-wide);
    color: var(--color-ink-muted); cursor: pointer;
  }
  .reset:hover { color: var(--color-ink); }
  select {
    background: transparent; border: none; padding: var(--space-2);
    font: inherit; color: var(--color-ink);
    border-bottom: 1px solid var(--color-line); outline: none;
    cursor: pointer;
  }
  ```

- [ ] **Step 4: Commit** — `feat(client): add SortSearchBar component`

### Task 7.3: Refactor `products.component`

**Files:**
- Modify: `client/src/app/main/products/products.component.ts`
- Modify: `client/src/app/main/products/products.component.html`
- Modify: `client/src/app/main/products/products.component.css`

The legacy implementation uses Material slider + chip widgets and a debounce-tangle for category clicks. We replace it with a cleaner state model: filter rail emits a `FilterState`; the component reflects state into URL query params; data fetches when query params change. Pagination is offset-based via "Load more."

- [ ] **Step 1: Component class**

  ```ts
  import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from "@angular/core";
  import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
  import { ActivatedRoute, Params, Router } from "@angular/router";

  import { ApiService } from "../../shared/api.service";
  import { APIProduct } from "../../types/Product";
  import { LoaderCardComponent } from "../../shared/loader-card/loader-card.component";
  import { ProductCardComponent } from "./product-card/product-card.component";
  import { FilterRailComponent, FilterState } from "./filter-rail/filter-rail.component";
  import { SortSearchBarComponent } from "./sort-search-bar/sort-search-bar.component";
  import { SectionHeadingComponent } from "../../shared/ui/section-heading/section-heading.component";

  const PAGE_SIZE = 12;

  @Component({
    selector: "app-products",
    imports: [
      LoaderCardComponent,
      ProductCardComponent,
      FilterRailComponent,
      SortSearchBarComponent,
      SectionHeadingComponent,
    ],
    templateUrl: "./products.component.html",
    styleUrl: "./products.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class ProductsComponent implements OnInit {
    private apiService = inject(ApiService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);

    readonly products = signal<APIProduct[]>([]);
    readonly isLoading = signal(false);
    readonly isLoadingMore = signal(false);
    readonly hasMore = signal(true);
    readonly error = signal(false);
    readonly queryParams = signal<Params>({});
    readonly hasQueryParams = computed(() => Object.keys(this.queryParams()).length > 0);
    readonly filterState = computed<FilterState>(() => {
      const q = this.queryParams();
      const cats = q["category"] ? (Array.isArray(q["category"]) ? q["category"] : [q["category"]]) : [];
      const [pmin, pmax] = (q["priceRange"] || "0:5000").split(":").map((n: string) => Number(n));
      return { categories: cats, priceMin: pmin || 0, priceMax: pmax || 5000 };
    });

    ngOnInit(): void {
      this.route.queryParams
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((p) => {
          this.queryParams.set(p);
          this.fetch(true);
        });
    }

    fetch(reset: boolean) {
      const q = { ...this.queryParams(), limit: PAGE_SIZE, offset: reset ? 0 : this.products().length };
      reset ? this.isLoading.set(true) : this.isLoadingMore.set(true);
      this.error.set(false);
      this.apiService.getProducts(q).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (page) => {
          this.products.update((curr) => (reset ? page : [...curr, ...page]));
          this.hasMore.set(page.length === PAGE_SIZE);
          this.isLoading.set(false);
          this.isLoadingMore.set(false);
        },
        error: () => {
          this.error.set(true);
          this.isLoading.set(false);
          this.isLoadingMore.set(false);
        },
      });
    }

    onFilterChange(state: FilterState) {
      const queryParams: Params = {
        category: state.categories.length ? state.categories : null,
        priceRange: state.priceMin || state.priceMax !== 5000 ? `${state.priceMin}:${state.priceMax}` : null,
      };
      this.router.navigate(["/products"], { queryParams, queryParamsHandling: "merge" });
    }

    onSearch(value: string) {
      this.router.navigate(["/products"], {
        queryParams: { search: value || null },
        queryParamsHandling: "merge",
      });
    }

    onSortChange(value: string) {
      this.router.navigate(["/products"], {
        queryParams: { sort: value || null },
        queryParamsHandling: "merge",
      });
    }

    onReset() {
      this.router.navigate(["/products"]);
    }

    loadMore() { this.fetch(false); }

    retry() { this.fetch(true); }
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <section class="page">
    <div class="container">
      <app-section-heading eyebrow="Collection" title="All pieces" />

      <app-sort-search-bar
        [search]="(queryParams()['search'] ?? '')"
        [sort]="(queryParams()['sort'] ?? '')"
        [showReset]="hasQueryParams()"
        (searchChange)="onSearch($event)"
        (sortChange)="onSortChange($event)"
        (reset)="onReset()"
      />

      <div class="layout">
        <app-filter-rail [state]="filterState()" (change)="onFilterChange($event)" />
        <main class="grid-area">
          @if (isLoading()) {
            <div class="grid">
              @for (i of [1,2,3,4,5,6,7,8,9]; track i) { <app-loader-card /> }
            </div>
          } @else if (error()) {
            <p class="state">Couldn't load products. <a (click)="retry()">Try again</a></p>
          } @else if (products().length === 0) {
            <p class="state">No pieces match these filters. <a (click)="onReset()">Clear filters</a></p>
          } @else {
            <div class="grid">
              @for (p of products(); track p._id) {
                <app-product-card [product]="p" density="default" />
              }
            </div>
            @if (hasMore()) {
              <div class="more">
                <button (click)="loadMore()" [disabled]="isLoadingMore()">
                  {{ isLoadingMore() ? "Loading…" : "Load more" }}
                </button>
              </div>
            }
          }
        </main>
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Styles**

  ```css
  .page { padding: var(--space-7) 0 var(--space-9); }
  .container { max-width: var(--container-max); margin: 0 auto; padding: 0 var(--container-pad); }
  .layout { display: flex; flex-direction: column; gap: var(--space-7); padding-top: var(--space-5); }
  @media (min-width: 800px) {
    .layout { flex-direction: row; align-items: flex-start; gap: var(--space-7); }
  }
  .grid-area { flex: 1; display: flex; flex-direction: column; gap: var(--space-7); }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6) var(--space-5);
  }
  @media (min-width: 600px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1000px) { .grid { grid-template-columns: repeat(3, 1fr); } }
  .state { color: var(--color-ink-muted); padding: var(--space-7) 0; text-align: center; }
  .state a { color: var(--color-ink); text-decoration: underline; cursor: pointer; }
  .more { display: flex; justify-content: center; padding-top: var(--space-5); }
  .more button {
    padding: var(--space-3) var(--space-6);
    background: transparent; color: var(--color-ink);
    border: 1px solid var(--color-ink); cursor: pointer;
    font: inherit; letter-spacing: var(--tracking-wide); text-transform: uppercase; font-size: var(--fs-sm);
  }
  .more button:hover { background: var(--color-ink); color: var(--color-bg); }
  ```

  *Note:* the legacy MatChips/MatSlider imports are gone; on mobile, the filter rail collapses to a stacked column above the grid (no slide-over modal in this iteration to keep scope tight). The slide-over is a follow-up improvement, not blocking.

- [ ] **Step 4: Update products spec**

  Replace `products.component.spec.ts` with:
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { ActivatedRoute, Router } from "@angular/router";
  import { RouterTestingModule } from "@angular/router/testing";
  import { BehaviorSubject, EMPTY, of } from "rxjs";
  import { ProductsComponent } from "./products.component";
  import { ApiService } from "../../shared/api.service";

  describe("ProductsComponent", () => {
    let fixture: ComponentFixture<ProductsComponent>;
    let component: ProductsComponent;
    let api: jasmine.SpyObj<ApiService>;
    const queryParams$ = new BehaviorSubject({});

    beforeEach(async () => {
      api = jasmine.createSpyObj("ApiService", ["getProducts"]);
      api.getProducts.and.returnValue(EMPTY);
      await TestBed.configureTestingModule({
        imports: [ProductsComponent, RouterTestingModule],
        providers: [
          { provide: ApiService, useValue: api },
          { provide: Router, useValue: jasmine.createSpyObj("Router", ["navigate"]) },
          { provide: ActivatedRoute, useValue: { queryParams: queryParams$.asObservable() } },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(ProductsComponent);
      component = fixture.componentInstance;
    });

    it("queries products with paging on init", () => {
      api.getProducts.and.returnValue(of([]));
      fixture.detectChanges();
      queryParams$.next({});
      expect(api.getProducts).toHaveBeenCalledWith(jasmine.objectContaining({ limit: 12, offset: 0 }));
    });

    it("appends results when loadMore is invoked", () => {
      const first = [{ _id: "a" } as any];
      const second = [{ _id: "b" } as any];
      api.getProducts.and.returnValues(of(first), of(second));
      fixture.detectChanges();
      queryParams$.next({});
      component.loadMore();
      expect(component.products().length).toBe(2);
    });
  });
  ```

- [ ] **Step 5: Run specs, smoke**

  ```
  npm test -- --watch=false --browsers=ChromeHeadless --include='**/products.component.spec.ts'
  ```
  Then `npm start`, navigate `/products`, check filters, sort, search, reset, "Load more."

- [ ] **Step 6: Commit**

  Message:
  ```
  refactor(client): rebuild products listing with filter rail, sort/search bar, and Load more

  Drops Material slider/chips in favor of a token-driven filter rail
  emitting a FilterState; URL query params remain the source of truth.
  Listing now paginates 12 at a time via offset.
  ```

---

## Phase 8 — Product details redesign

### Task 8.1: `<app-image-gallery>`

**Files:** four under `client/src/app/main/product-details/image-gallery/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component, input } from "@angular/core";

  @Component({
    selector: "app-image-gallery",
    templateUrl: "./image-gallery.component.html",
    styleUrl: "./image-gallery.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class ImageGalleryComponent {
    images = input.required<string[]>();
    alt = input.required<string>();

    onImageError(event: Event) {
      const img = event.target as HTMLImageElement;
      img.style.background = "var(--color-surface-muted)";
      img.removeAttribute("src");
    }
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <div class="gallery">
    @if (images().length) {
      <div class="hero">
        <img [src]="images()[0]" [alt]="alt()" (error)="onImageError($event)" />
      </div>
      @if (images().length > 1) {
        <div class="grid">
          @for (src of images().slice(1); track src; let i = $index) {
            <img [src]="src" [alt]="alt() + ' detail ' + (i + 1)" (error)="onImageError($event)" loading="lazy" />
          }
        </div>
      }
    }
  </div>
  ```

- [ ] **Step 3: Styles**

  ```css
  .gallery { display: flex; flex-direction: column; gap: var(--space-4); }
  .hero { aspect-ratio: 4 / 5; overflow: hidden; background: var(--color-surface-muted); }
  .hero img { width: 100%; height: 100%; object-fit: cover; }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
  .grid img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; background: var(--color-surface-muted); }
  ```

- [ ] **Step 4: Commit** — `feat(client): add ImageGallery component`

### Task 8.2: `<app-spec-table>`

**Files:** four under `client/src/app/main/product-details/spec-table/`.

- [ ] **Step 1: Class**

  ```ts
  import { ChangeDetectionStrategy, Component, input } from "@angular/core";
  import { PopulatedProduct } from "../../../types/Product";

  @Component({
    selector: "app-spec-table",
    templateUrl: "./spec-table.component.html",
    styleUrl: "./spec-table.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class SpecTableComponent {
    product = input.required<PopulatedProduct>();
  }
  ```

- [ ] **Step 2: Template**

  ```html
  <dl class="spec">
    <div><dt>Style</dt><dd>{{ product().style }}</dd></div>
    <div><dt>Materials</dt><dd>{{ product().material.join(", ") }}</dd></div>
    <div><dt>Color</dt><dd>{{ product().color }}</dd></div>
    <div><dt>Width</dt><dd>{{ product().dimensions.width }} mm</dd></div>
    <div><dt>Height</dt><dd>{{ product().dimensions.height }} mm</dd></div>
    <div><dt>Depth</dt><dd>{{ product().dimensions.depth }} mm</dd></div>
  </dl>
  ```

- [ ] **Step 3: Styles**

  ```css
  .spec { display: flex; flex-direction: column; }
  .spec > div {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--color-line);
  }
  .spec dt { font-family: var(--font-body); font-size: var(--fs-sm); color: var(--color-ink-muted); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
  .spec dd { font-family: var(--font-body); font-size: var(--fs-base); }
  ```

- [ ] **Step 4: Commit** — `feat(client): add SpecTable component`

### Task 8.3: Refactor `product-details.component`

**Files:**
- Modify: `client/src/app/main/product-details/product-details.component.ts`
- Modify: `client/src/app/main/product-details/product-details.component.html`
- Modify: `client/src/app/main/product-details/product-details.component.css`

- [ ] **Step 1: Component class — minor changes**

  Apply the slug change from Task 3.4 if not already done. Then add `inStock` UX hooks:
  ```ts
  get isInStock() { return this.product()?.inStock !== false; }
  ```
  Add `ImageGalleryComponent` and `SpecTableComponent` to imports. Drop `DateFormatterPipe` from imports if `Posted on` line is removed in template (we omit it for the new layout).

- [ ] **Step 2: Replace template**

  ```html
  <section class="details">
    <div class="container">
      @if (product(); as p) {
        <div class="layout">
          <app-image-gallery [images]="p.images" [alt]="p.name" />
          <aside class="info">
            <p class="eyebrow">{{ p.category.join(" · ") }}</p>
            <h1>{{ p.name }}</h1>
            <p class="price">${{ p.price | floorPrice }}<span>{{ p.price | decimalSlice }}</span></p>
            <p class="stock-tag" [class.out]="!isInStock">
              <span class="dot"></span>{{ isInStock ? "In stock" : "Made to order" }}
            </p>
            <p class="short">{{ p.shortDescription }}</p>
            <div class="divider"></div>
            <p class="long">{{ p.description }}</p>
            <app-spec-table [product]="p" />

            @if (isUser) {
              @if (!isOwner) {
                <div class="qty">
                  <label>Quantity</label>
                  <div class="qty-controls">
                    <button type="button" (click)="removeQty()">−</button>
                    <input type="number" [(ngModel)]="buyQty" (blur)="onInputBlur()" />
                    <button type="button" (click)="addQty()">+</button>
                  </div>
                </div>
                <div class="cta">
                  <button class="primary" (click)="addToCart()" [disabled]="!isInStock">
                    {{ isInStock ? "Add to cart" : "Currently unavailable" }}
                  </button>
                  <button class="secondary" (click)="toggleWishlist()">
                    <i class="fa-heart" [class.fa-solid]="isInWishList" [class.fa-regular]="!isInWishList"></i>
                    Wishlist
                  </button>
                </div>
              }
              @if (isOwner) {
                <div class="owner-controls">
                  <a [routerLink]="'edit'">Edit</a>
                  <a (click)="onDelete()">Delete</a>
                </div>
              }
            } @else {
              <div class="cta">
                <a class="primary" routerLink="/auth/login">Login to purchase</a>
                <a class="secondary" routerLink="/auth/register">Register</a>
              </div>
            }
          </aside>
        </div>
      } @else {
        <p class="loading">Loading…</p>
      }
    </div>
  </section>
  ```

- [ ] **Step 3: Styles**

  ```css
  .details { padding: var(--space-7) 0 var(--space-9); }
  .container { max-width: var(--container-max); margin: 0 auto; padding: 0 var(--container-pad); }
  .layout {
    display: grid; grid-template-columns: 1fr; gap: var(--space-7);
  }
  @media (min-width: 1000px) {
    .layout { grid-template-columns: 6fr 4fr; gap: var(--space-8); align-items: start; }
    .info { position: sticky; top: var(--space-6); }
  }
  .info { display: flex; flex-direction: column; gap: var(--space-4); }
  .eyebrow { font-family: var(--font-body); font-size: var(--fs-xs); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-ink-muted); }
  .info h1 { font-size: var(--fs-3xl); }
  .price { font-family: var(--font-display); font-size: var(--fs-2xl); display: inline-flex; align-items: flex-start; }
  .price span { font-size: 0.55em; padding-top: 0.4em; }
  .stock-tag { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--fs-sm); color: var(--color-ink-muted); }
  .stock-tag .dot { width: 6px; height: 6px; border-radius: 50%; background: #2d8a4f; }
  .stock-tag.out .dot { background: var(--color-ink-muted); }
  .short { color: var(--color-ink); font-size: var(--fs-lg); line-height: var(--lh-loose); }
  .divider { height: 1px; background: var(--color-line); margin: var(--space-3) 0; }
  .long { color: var(--color-ink-muted); line-height: var(--lh-loose); white-space: pre-wrap; }
  .qty { display: flex; flex-direction: column; gap: var(--space-2); padding-top: var(--space-3); }
  .qty label { font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--color-ink-muted); }
  .qty-controls { display: inline-flex; align-items: center; border: 1px solid var(--color-line); width: fit-content; }
  .qty-controls button { width: 36px; height: 36px; }
  .qty-controls input { width: 56px; height: 36px; text-align: center; border: none; border-left: 1px solid var(--color-line); border-right: 1px solid var(--color-line); font: inherit; }
  .cta { display: flex; gap: var(--space-3); padding-top: var(--space-3); }
  .cta .primary {
    flex: 1; padding: var(--space-3) var(--space-5);
    background: var(--color-ink); color: var(--color-bg);
    border: 1px solid var(--color-ink); text-align: center; cursor: pointer;
    font: inherit; letter-spacing: var(--tracking-wide); text-transform: uppercase; font-size: var(--fs-sm);
  }
  .cta .primary:disabled { background: var(--color-ink-muted); border-color: var(--color-ink-muted); cursor: not-allowed; }
  .cta .secondary {
    padding: var(--space-3) var(--space-5);
    background: transparent; color: var(--color-ink);
    border: 1px solid var(--color-ink); cursor: pointer;
    font: inherit; letter-spacing: var(--tracking-wide); text-transform: uppercase; font-size: var(--fs-sm);
    display: inline-flex; gap: var(--space-2); align-items: center;
  }
  .owner-controls { display: flex; gap: var(--space-5); padding-top: var(--space-4); }
  .owner-controls a { font-size: var(--fs-sm); text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--color-ink-muted); cursor: pointer; }
  .owner-controls a:hover { color: var(--color-ink); }
  ```

- [ ] **Step 4: Update product-details spec**

  Replace `product-details.component.spec.ts`:
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { ActivatedRoute, Router } from "@angular/router";
  import { RouterTestingModule } from "@angular/router/testing";
  import { MatDialogModule } from "@angular/material/dialog";
  import { BehaviorSubject, of } from "rxjs";

  import { ProductDetailsComponent } from "./product-details.component";
  import { ApiService } from "../../shared/api.service";
  import { AuthService } from "../../shared/auth.service";
  import { CartStore } from "../../auth/cart/cart.store";
  import { NotificationService } from "../../shared/notification/notification.service";
  import { PopulatedProduct } from "../../types/Product";

  describe("ProductDetailsComponent", () => {
    let fixture: ComponentFixture<ProductDetailsComponent>;
    let api: jasmine.SpyObj<ApiService>;
    const params$ = new BehaviorSubject({ slug: "halden-lounge" });
    const product: PopulatedProduct = {
      _id: "1", slug: "halden-lounge", name: "Halden Lounge",
      description: "long", shortDescription: "short",
      images: ["https://x/y.jpg", "https://x/z.jpg"],
      category: ["Living room"], style: "Mid-century",
      dimensions: { height: 1, width: 1, depth: 1 },
      material: ["Wood"], color: "brown", price: 1890,
      tags: [], inStock: true, isFeatured: true,
      _ownerId: { _id: "u", email: "h@x", username: "house" } as any,
      __v: "0", createdAt: "",
    };

    beforeEach(async () => {
      api = jasmine.createSpyObj("ApiService", ["getProduct", "toggleWishList"]);
      api.getProduct.and.returnValue(of(product));
      await TestBed.configureTestingModule({
        imports: [ProductDetailsComponent, RouterTestingModule, MatDialogModule],
        providers: [
          { provide: ApiService, useValue: api },
          { provide: ActivatedRoute, useValue: { params: params$.asObservable() } },
          { provide: Router, useValue: jasmine.createSpyObj("Router", ["navigate"]) },
          { provide: AuthService, useValue: { isLogged: false, user: null } },
          { provide: CartStore, useValue: { addItem: () => {} } },
          { provide: NotificationService, useValue: { setNotification: () => {} } },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(ProductDetailsComponent);
    });

    it("loads product by slug from route", () => {
      fixture.detectChanges();
      expect(api.getProduct).toHaveBeenCalledWith("halden-lounge");
    });

    it("renders the gallery and price", () => {
      fixture.detectChanges();
      const html = fixture.nativeElement as HTMLElement;
      expect(html.querySelector("h1")?.textContent).toContain("Halden Lounge");
      expect(html.querySelector(".price")?.textContent).toContain("1890");
    });
  });
  ```

- [ ] **Step 5: Run, smoke**

  Run the spec; smoke test in browser by navigating to a product detail page. Confirm gallery + sticky info + spec table.

- [ ] **Step 6: Commit**

  Message:
  ```
  refactor(client): rebuild product details with sticky info panel and image gallery
  ```

---

## Phase 9 — Polish & verification

### Task 9.1: Curate real Unsplash photos

**Files:**
- Modify: `server/seed/catalog.js`

This step is manual curation. Picsum placeholders ship at end of Phase 2; Phase 9 swaps them out.

- [ ] **Step 1: For each of the 24 products, find 3–4 Unsplash photos**

  For each product, search Unsplash (https://unsplash.com) using the product name and tags. Choose:
  - 1 hero photo (the piece itself or a close lifestyle shot of it)
  - 2–3 supporting photos: material close-up, room context, detail shot

  Capture the direct image URL by right-clicking the photo on Unsplash → "Copy image address." URLs follow the pattern `https://images.unsplash.com/photo-<hash>?w=1600&...`

- [ ] **Step 2: Replace `img(...)` calls in `catalog.js` with real URLs**

  Each product's `images` array becomes literal Unsplash URLs. The `img` helper can be removed.

- [ ] **Step 3: Re-run the seed**

  From `server/`: `npm run seed`. Confirm 24 products inserted.

- [ ] **Step 4: Browser smoke across the site**

  Walk every redesigned page (home, listing with filters, details for ~3 products) and confirm imagery reads coherently.

- [ ] **Step 5: Commit**

  Message: `chore(server): replace Picsum placeholders with curated Unsplash photos`

### Task 9.2: Run the full test suite

**Files:** none

- [ ] **Step 1: Run client specs**

  From `client/`: `npm test -- --watch=false --browsers=ChromeHeadless`
  Expected: all green. Fix any breakages introduced during the redesign.

- [ ] **Step 2: Run server specs**

  From `server/`: `npm test`
  Expected: 3 slug tests pass.

- [ ] **Step 3: Build for production**

  From `client/`: `npm run build`
  Expected: build succeeds with no errors.

- [ ] **Step 4: If anything fails, fix and re-run before continuing.**

### Task 9.3: Manual smoke verification

- [ ] **Step 1: Run client + server**

  Server: `npm start` from `server/` (background).
  Client: `npm start` from `client/` (background).

- [ ] **Step 2: Walk the customer path**

  - Visit `/` → redirects to `/home`. All six sections render.
  - Click a featured product → routes to `/products/<slug>`.
  - Use back button → returns to home.
  - Click "Browse by space" tile → `/products?category=Living%20room`. Filter rail reflects the active category.
  - Toggle multiple categories on the listing — URL updates with repeated `category=` params.
  - Use sort dropdown.
  - Use search bar.
  - Click "Reset" → all filters clear.
  - Click "Load more" → next page appends.
  - Visit a product detail → gallery, sticky info, spec table.
  - Log in as the house user (`house@dreamfurniture.local`) — note the password is the printed seed value, or reset via DB. Confirm owner controls show on detail pages.
  - Log out, register a new account, add a product via `/add-product` with multiple images and a short description; verify it persists and renders correctly on its detail page.

- [ ] **Step 3: Verify keyboard accessibility**

  Tab through home and product details. Confirm focus is visible and logical (no traps).

- [ ] **Step 4: Stop both dev servers.**

### Task 9.4: Final commit + push

- [ ] **Step 1: Commit any leftover style fixes from manual smoke**

- [ ] **Step 2: Push the branch**

  ```bash
  git push -u origin refactor/luxury-redesign
  ```

  Optionally open a PR via `gh pr create`. Defer this to user instruction — do not push without explicit user confirmation.

---

## Self-Review

**Spec coverage check:**
- Section 1 (tokens) → Phase 1 ✓
- Section 2 (homepage IA) → Phase 6 (six sections + orchestrator) ✓
- Section 3 (listing & details) → Phase 7 + Phase 8 ✓
- Section 4 (schema + backend) → Phase 2 + Phase 3 ✓
- Section 5 (seed catalog) → Phase 2 (Picsum) + Phase 9 (Unsplash) ✓
- Section 6 (architecture) → Phase 5 + Phase 6 + Phase 7 + Phase 8 ✓
- Section 7 (errors, accessibility) → covered in section components (loading, error states, reduced-motion in tokens, alt text in gallery) ✓

**Placeholder scan:** No "TBD" or hand-wave language. The Phase 9 Unsplash curation step is explicitly a manual curation task with concrete instructions, not a placeholder. The `/about` link in craftsmanship is acknowledged as out-of-scope.

**Type consistency:**
- `APIProduct.slug` defined in Task 3.1; consumed in Tasks 3.4, 5.5, 6.7, 7.3 ✓
- `images: string[]` defined in Task 3.1; consumed in Tasks 4.1, 5.5, 8.1 ✓
- `FilterState` defined in Task 7.1; consumed in Task 7.3 ✓
- Server `getProductBySlugOrId` defined in Task 2.3; consumed in Task 2.4 ✓

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-09-frontend-luxury-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
