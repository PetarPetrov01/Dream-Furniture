const authService = require("../services/authService");
const { authCookieName } = require("../config/cookie.js");

const { isGuest, isUser } = require("../middlewares/guards.js");
const { authLimiter } = require("../middlewares/rateLimit.js");
const { registerValidators } = require("../middlewares/validators.js");
const validate = require("../middlewares/validate.js");
const wishlistService = require("../services/wishlistService.js");
const productService = require("../services/productService.js");

const authController = require("express").Router();

const cookieOptions =
  process.env.NODE_ENV == "production"
    ? { httpOnly: true, sameSite: "none", secure: true }
    : { httpOnly: false };

function setAuthCookie(res, authToken) {
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
    const { user, authToken } = await authService.register(
      username,
      email,
      password
    );
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
    const user = await authService.getUser(req.user?._id);
    res.status(200).json(user);
  }
);

authController.patch(
  "/profile",
  isUser(),
  async (req, res) => {
    const user = await authService.editUser(
      req.user._id,
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
    const wishlist = await wishlistService.getWishlist(req.user?._id);
    res.json(wishlist);
  }
);

authController.get(
  "/posts",
  isUser(),
  async (req, res) => {
    const ownProducts = await productService.getOwn(req.user?._id);
    res.json(ownProducts);
  }
);

module.exports = authController;
