import { RequestHandler } from "express";
import { authCookieName } from "../config/cookie.js";
import { verifyToken } from "../services/authService.js";

export default (): RequestHandler => (req, res, next) => {
  const token = req.cookies[authCookieName];
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      res.clearCookie(authCookieName);
    }
  }
  next();
};
