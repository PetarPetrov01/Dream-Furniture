import { Router } from "express";
import { isUser, isOwner } from "../middlewares/guards.js";
import preload from "../middlewares/preload.js";
import { productValidators } from "../middlewares/validators.js";
import validate from "../middlewares/validate.js";
import * as wishlistService from "../services/wishlistService.js";
import * as productService from "../services/productService.js";

const productController = Router();

productController.get("/", async (req, res) => {
  const { items, total } = await productService.getProducts(res.locals.query ?? {});
  res.set("X-Total-Count", String(total));
  res.json(items);
});

// Slug-or-id lookup. Slug wins; 24-char hex falls back to id lookup.
productController.get("/:slug", async (req, res) => {
  const product: any = await productService.getProductBySlugOrId(req.params.slug as string);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const safeUser = product._ownerId
    ? {
        _id: product._ownerId._id,
        email: product._ownerId.email,
        username: product._ownerId.username,
      }
    : null;
  res.json({ ...product, _ownerId: safeUser });
});

productController.post("/", isUser(), ...productValidators, validate, async (req, res) => {
  const data = req.body;
  data._ownerId = req.user!._id;
  const product = await productService.addProduct(data);
  res.json(product);
});

productController.put("/:id", preload(), isOwner(), ...productValidators, validate, async (req, res) => {
  const product = await productService.updateProduct(req.params.id as string, req.body);
  res.json(product);
});

productController.delete("/:id", preload(), isOwner(), async (req, res) => {
  await productService.deleteProduct(req.params.id as string);
  res.status(204).end();
});

productController.post("/:id/wishlist", isUser(), async (req, res) => {
  const user = await wishlistService.toggleItemInWishlist(req.user?._id as string, req.params.id as string);
  res.json({
    _id: user?._id,
    email: user?.email,
    username: user?.username,
    wishlist: user?.wishlist,
  });
});

export default productController;
