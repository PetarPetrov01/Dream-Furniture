import { Schema, model, Types, HydratedDocument } from "mongoose";
import crypto from "crypto";

const categories = ["Living room", "Bedroom", "Dining room", "Home office", "Outdoor"];
const imagePattern = /^(https?:\/\/|assets\/images\/)\S+$/;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export interface IProduct {
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
  tags: string[];
  inStock: boolean;
  isFeatured: boolean;
  slug?: string;
  _ownerId?: Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    images: {
      type: [String],
      required: true,
      validate: [
        { validator: (v: string[]) => Array.isArray(v) && v.length >= 1, message: "At least one image is required" },
        { validator: (v: string[]) => v.every((url) => imagePattern.test(url)), message: "Invalid image URL in images[]" },
      ],
    },
    category: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.every((c) => categories.includes(c)),
        message: (props: { value: string[] }) =>
          props.value.length > 1 ? "Some of the categories are invalid" : `Invalid category - ${props.value.join()}`,
      },
    },
    style: { type: String, required: true },
    dimensions: { type: { height: Number, width: Number, depth: Number }, required: true, _id: false },
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

productSchema.pre("validate", async function (this: HydratedDocument<IProduct>, next) {
  if (this.slug) return next();
  const base = slugify(this.name || "product");
  let candidate = base;
  let attempts = 0;
  while (await (this.constructor as typeof Product).exists({ slug: candidate })) {
    attempts += 1;
    const suffix = crypto.randomBytes(3).toString("hex");
    candidate = `${base}-${suffix}`;
    if (attempts > 5) break;
  }
  this.slug = candidate;
  next();
});

const Product = model<IProduct>("Product", productSchema);
export default Product;
