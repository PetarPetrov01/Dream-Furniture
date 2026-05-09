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
