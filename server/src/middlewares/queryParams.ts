import { RequestHandler } from "express";
import type { ProductQuery } from "../services/productService.js";

export default (): RequestHandler => (req, res, next) => {
  const query: Record<string, unknown> = { ...req.query };

  if (typeof query.sort === "string" && query.sort !== "") {
    const [sortKey, order] = query.sort.split(":");
    query.sort = { [sortKey]: order === "asc" ? 1 : -1 };
  }
  if (typeof query.priceRange === "string" && query.priceRange !== "") {
    const [lower, upper] = query.priceRange.split(":");
    query.priceRange = { lower, upper };
  }

  res.locals.query = query as ProductQuery;
  next();
};
