import Product from "../models/Product.js";
import AppError from "../util/AppError.js";

export interface ProductQuery {
  category?: string | string[];
  search?: string;
  priceRange?: { lower?: string; upper?: string };
  isFeatured?: unknown;
  tag?: string | string[];
  sort?: Record<string, 1 | -1> | null;
  offset?: string;
  limit?: string;
}

function escapeRegex(str: string): string {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getProducts(query: ProductQuery = {}) {
  const optionsArr: Record<string, unknown>[] = [];

  if (query.category) {
    const cats = Array.isArray(query.category) ? query.category : [query.category];
    optionsArr.push({ category: { $in: cats } });
  }
  if (query.search) {
    optionsArr.push({ name: { $regex: new RegExp(escapeRegex(query.search), "i") } });
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

  const [items, total] = await Promise.all([q, Product.countDocuments(queryObj)]);
  return { items, total };
}

export async function getProductById(productId: string) {
  return Product.findById(productId).populate("_ownerId").lean();
}

export async function getProductBySlugOrId(slugOrId: string) {
  let product = await Product.findOne({ slug: slugOrId }).populate("_ownerId").lean();
  if (!product && /^[a-f0-9]{24}$/i.test(slugOrId)) {
    product = await Product.findById(slugOrId).populate("_ownerId").lean();
  }
  return product;
}

export async function addProduct(data: Record<string, unknown>) {
  return Product.create(data);
}

export async function updateProduct(productId: string, data: any) {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404);
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
  return product.save();
}

export async function deleteProduct(productId: string) {
  return Product.findByIdAndDelete(productId);
}

export async function getOwn(userId: string) {
  return Product.find({ _ownerId: userId });
}
