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
