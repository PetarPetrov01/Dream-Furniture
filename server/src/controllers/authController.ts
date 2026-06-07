import { Router, type CookieOptions } from "express";
import * as authService from "../services/authService.js";
import { authCookieName } from "../config/cookie.js";
import { isGuest, isUser } from "../middlewares/guards.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import { registerValidators } from "../middlewares/validators.js";
import validate from "../middlewares/validate.js";
import * as wishlistService from "../services/wishlistService.js";
import * as productService from "../services/productService.js";

const authController = Router();

const cookieOptions: CookieOptions =
  process.env.NODE_ENV === "production"
    ? { httpOnly: true, sameSite: "none", secure: true }
    : { httpOnly: false };

function setAuthCookie(res: import("express").Response, authToken: string) {
  res.cookie(authCookieName, authToken, cookieOptions);
}

authController.post(
  "/login",
  authLimiter,
  isGuest(),
  async (req, res) => {
    const { email, password } = req.body;
    const { user, authToken } = await authService.login(email, password);
    setAuthCookie(res, authToken);
    res.json(user);
  }
);

authController.post(
  "/register",
  authLimiter,
  isGuest(),
  ...registerValidators,
  validate,
  async (req, res) => {
    const { username, email, password } = req.body;
    const { user, authToken } = await authService.register(username, email, password);
    setAuthCookie(res, authToken);
    res.json(user);
  }
);

authController.get("/logout", (req, res) => {
  res
    .clearCookie(authCookieName, cookieOptions)
    .json({ message: "Succesfully logged out" });
});

authController.get(
  "/profile",
  isUser(),
  async (req, res) => {
    const user = await authService.getUser(req.user?._id as string);
    res.status(200).json(user);
  }
);

authController.patch(
  "/profile",
  isUser(),
  async (req, res) => {
    const user = await authService.editUser(
      req.user!._id,
      req.body.username,
      req.body.email
    );
    res.json(user);
  }
);

authController.get(
  "/wishlist",
  isUser(),
  async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user?._id as string);
    res.json(wishlist);
  }
);

authController.get(
  "/posts",
  isUser(),
  async (req, res) => {
    const ownProducts = await productService.getOwn(req.user?._id as string);
    res.json(ownProducts);
  }
);

export default authController;
