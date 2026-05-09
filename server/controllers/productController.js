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
