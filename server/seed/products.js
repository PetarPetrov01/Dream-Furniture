require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const catalog = require("./catalog");
const { ensureHouseUser } = require("./house-user");

async function run() {
  const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing DATABASE_URL (or MONGO_URI) in environment");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const host = new URL(uri.replace(/^mongodb\+srv:\/\//, "https://").replace(/^mongodb:\/\//, "http://")).host;
  console.log(`[seed] Connected to MongoDB (${host})`);

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
