const { isUser, isOwner } = require("../middlewares/guards");
const preload = require("../middlewares/preload");
const asyncHandler = require("../util/asyncHandler");
const wishlistService = require("../services/wishlistService");
const productService = require("../services/productService");

const productController = require("express").Router();

productController.get(
  "/",
  asyncHandler(async (req, res) => {
    const { items, total } = await productService.getProducts(req.query);
    res.set("X-Total-Count", String(total));
    res.json(items);
  })
);

// Slug-or-id lookup. Slug wins; 24-char hex falls back to id lookup.
productController.get(
  "/:slug",
  asyncHandler(async (req, res) => {
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
  })
);

productController.post(
  "/",
  isUser(),
  asyncHandler(async (req, res) => {
    const data = req.body;
    data._ownerId = req.user._id;
    const product = await productService.addProduct(data);
    res.json(product);
  })
);

productController.put(
  "/:id",
  preload(),
  isOwner(),
  asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  })
);

productController.delete(
  "/:id",
  preload(),
  isOwner(),
  asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    res.status(204).end();
  })
);

productController.post(
  "/:id/wishlist",
  isUser(),
  asyncHandler(async (req, res) => {
    const user = await wishlistService.toggleItemInWishlist(
      req.user?._id,
      req.params.id
    );
    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      wishlist: user.wishlist,
    });
  })
);

module.exports = productController;
