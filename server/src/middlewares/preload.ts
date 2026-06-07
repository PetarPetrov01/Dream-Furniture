import { RequestHandler } from "express";
import * as productService from "../services/productService.js";

export default (): RequestHandler => async (req, res, next) => {
  try {
    const item = await productService.getProductById(req.params.id as string);
    if (!item) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.locals.product = item;
    next();
  } catch {
    res.status(400).json({ message: "Invalid product id" });
  }
};
