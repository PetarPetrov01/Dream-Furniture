import { body } from "express-validator";

const emailPattern = "[a-zA-Z0-9]{5,}@[a-zA-Z]+.[a-zA-Z]{2,}$";

const registerValidators = [
  body("email").matches(emailPattern).withMessage("Invalid email"),
  body("username")
    .isLength({ min: 5 })
    .withMessage("Username must be atleast 5 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
];

// Shared by create (POST) and update (PUT) — both write the full document.
// Allowed category values are still enforced by the Mongoose schema.
const productValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("shortDescription")
    .trim()
    .notEmpty()
    .withMessage("Short description is required")
    .isLength({ max: 200 })
    .withMessage("Short description must be 200 characters or fewer"),
  body("images").isArray({ min: 1 }).withMessage("At least one image is required"),
  body("category").isArray({ min: 1 }).withMessage("At least one category is required"),
  body("style").trim().notEmpty().withMessage("Style is required"),
  body("dimensions.width").isNumeric().withMessage("Width must be a number"),
  body("dimensions.height").isNumeric().withMessage("Height must be a number"),
  body("dimensions.depth").isNumeric().withMessage("Depth must be a number"),
  body("material").isArray({ min: 1 }).withMessage("At least one material is required"),
  body("color").trim().notEmpty().withMessage("Color is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("inStock").optional().isBoolean().withMessage("inStock must be a boolean"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean"),
];

const orderValidators = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one product"),
  body("products.*.product").isMongoId().withMessage("Invalid product id in order"),
  body("products.*.count")
    .isInt({ gt: 0 })
    .withMessage("Product count must be a positive integer"),
];

export { registerValidators, productValidators, orderValidators };
