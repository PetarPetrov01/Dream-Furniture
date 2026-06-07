import "express";
import type { ProductQuery } from "../services/productService.js";

declare global {
  namespace Express {
    interface Request {
      user?: { _id: string; email: string };
    }
    interface Locals {
      query?: ProductQuery;
    }
  }
}

export {};
