import { RequestHandler } from "express";
import { validationResult } from "express-validator";

const validate: RequestHandler = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(result.array());
  }
  next();
};

export default validate;
