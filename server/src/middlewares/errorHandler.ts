import { ErrorRequestHandler } from "express";
import errorParser from "../util/errorParser.js";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (Array.isArray(err)) {
    return res.status(422).json({ message: errorParser(err) });
  }
  if (err?.name === "ValidationError") {
    return res.status(422).json({ message: errorParser(err) });
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier" });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Resource already exists" });
  }
  if (typeof err?.status === "number") {
    return res.status(err.status).json({ message: err.message });
  }
  console.error("[error]", err);
  return res.status(500).json({ message: "Something went wrong" });
};

export default errorHandler;
