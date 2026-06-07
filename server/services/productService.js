const Product = require("../models/Product");

// Escape regex metacharacters so user input is matched literally (no ReDoS / injection).
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getProducts(query) {
  let products;
  const optionsArr = [];

  if (query.category) {
    optionsArr.push({ category: { $in: query.category } });
  }

  if (query.search) {
    optionsArr.push({ name: { $regex: new RegExp(escapeRegex(query.search), "i") } });
  }

  if (query.priceRange) {
    optionsArr.push({
      price: { $gte: query.priceRange.lower || 0, $lte: query.priceRange.upper },
    });
  }

  const queryObj = optionsArr.length > 0 ? { $and: optionsArr } : {};
  products = await Product.find(queryObj)
    .sort(query.sort || null)
    .limit(query.limit || null);

  return products;
}

async function getProductById(productId) {
  return await Product.findById(productId).populate("_ownerId").lean();
}

async function addProduct(data) {
  return await Product.create(data);
}

async function updateProduct(productId, data) {
  const product = await Product.findById(productId);

  product.name = data.name;
  product.name = data.name;
  product.description = data.description;
  product.image = data.image;
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
  addProduct,
  updateProduct,
  deleteProduct,
  getOwn,
};

module.exports = productService;
