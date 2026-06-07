const authService = require("../services/authService");
const { authCookieName } = require("../config/cookie.js");
const asyncHandler = require("../util/asyncHandler.js");

const { body, validationResult } = require("express-validator");
const { isGuest, isUser } = require("../middlewares/guards.js");
const { authLimiter } = require("../middlewares/rateLimit.js");
const wishlistService = require("../services/wishlistService.js");
const productService = require("../services/productService.js");

const authController = require("express").Router();

const emailPattern = "[a-zA-Z0-9]{5,}@[a-zA-Z]+.[a-zA-Z]{2,}$";

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
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, authToken } = await authService.login(email, password);
    setAuthCookie(res, authToken);
    res.json(user);
  })
);

authController.post(
  "/register",
  authLimiter,
  isGuest(),
  body("email").matches(emailPattern).withMessage("Invalid email"),
  body("username")
    .isLength({ min: 5 })
    .withMessage("Username must be atleast 5 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
      throw errors;
    }

    const { username, email, password } = req.body;
    const { user, authToken } = await authService.register(
      username,
      email,
      password
    );
    setAuthCookie(res, authToken);
    res.json(user);
  })
);

authController.get("/logout", (req, res) => {
  res
    .clearCookie(authCookieName, cookieOptions)
    .json({ message: "Succesfully logged out" });
});

authController.get(
  "/profile",
  isUser(),
  asyncHandler(async (req, res) => {
    const user = await authService.getUser(req.user?._id);
    res.status(200).json(user);
  })
);

authController.patch(
  "/profile",
  isUser(),
  asyncHandler(async (req, res) => {
    const user = await authService.editUser(
      req.user._id,
      req.body.username,
      req.body.email
    );
    res.json(user);
  })
);

authController.get(
  "/wishlist",
  isUser(),
  asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user?._id);
    res.json(wishlist);
  })
);

authController.get(
  "/posts",
  isUser(),
  asyncHandler(async (req, res) => {
    const ownProducts = await productService.getOwn(req.user?._id);
    res.json(ownProducts);
  })
);

module.exports = authController;
