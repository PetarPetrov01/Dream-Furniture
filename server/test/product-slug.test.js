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
