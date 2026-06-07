const authService = require("../services/authService");
const { authCookieName } = require("../config/cookie.js");
const errorParser = require("../util/errorParser.js");

const { body, validationResult } = require("express-validator");
const { isGuest, isUser } = require("../middlewares/guards.js");
const wishlistService = require("../services/wishlistService.js");
const productService = require("../services/productService.js");

const authController = require("express").Router();

const emailPattern = "[a-zA-Z0-9]{5,}@[a-zA-Z]+.[a-zA-Z]{2,}$";

authController.post("/login", isGuest(), async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, authToken } = await authService.login(email, password);

    if (process.env.NODE_ENV == "production") {
      res.cookie(authCookieName, authToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    } else {
      res.cookie(authCookieName, authToken, { httpOnly: false });
    }

    res.json(user);
  } catch (error) {
    const errorMessage = errorParser(error);
    res.status(400).json({ message: errorMessage });
  }
});

authController.post(
  "/register",
  isGuest(),
  body("email").matches(emailPattern).withMessage("Invalid email"),
  body("username")
    .isLength({ min: 5 })
    .withMessage("Username must be atleast 5 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
  async (req, res) => {
    try {
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

      if (process.env.NODE_ENV == "production") {
        res.cookie(authCookieName, authToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      } else {
        res.cookie(authCookieName, authToken, { httpOnly: false });
      }

      res.json(user);
    } catch (error) {
      const errorMessage = errorParser(error);
      res.status(400).json({ message: errorMessage });
    }
  }
);

authController.get("/logout", async (req, res) => {
  try {
    if (process.env.NODE_ENV == "production") {
      res
        .clearCookie(authCookieName, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .json({ message: "Succesfully logged out" });
    } else {
      res
        .clearCookie(authCookieName, { httpOnly: false })
        .json({ message: "Succesfully logged out" });
    }
  } catch (error) {
    const errorMessage = errorParser(error);
    res.status(400).json({ message: errorMessage });
  }
});

authController.get("/profile", isUser(), async (req, res) => {
  try {
    const userId = req.user?._id;

    const user = await authService.getUser(userId);
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = errorParser(error);
    res.status(400).json({ message: errorMessage });
  }
});

authController.patch("/profile", isUser(), async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await authService.editUser(
      userId,
      req.body.username,
      req.body.email
    );
    res.json(user);
  } catch (error) {
    const errorMessage = errorParser(error);
    res.status(400).json({ message: errorMessage });
  }
});

authController.get("/wishlist", isUser(), async (req, res) => {
  try {
    const userId = req.user?._id;
    const wishlist = await wishlistService.getWishlist(userId);
    res.json(wishlist);
  } catch (error) {
    const errorMessage = errorParser(error);
    res.status(400).json({ message: errorMessage });
  }
});

authController.get("/posts", isUser(), async (req, res) => {
  try {
    const userId = req.user?._id;
    const ownProducts = await productService.getOwn(userId);
    res.json(ownProducts);
  } catch (error) {
    const errorMessage = errorParser(error);
    res.status(400).json({ message: errorMessage });
  }
});

module.exports = authController;
