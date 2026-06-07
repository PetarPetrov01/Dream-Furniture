const productService = require("../services/productService");

module.exports = () => {
  return async (req, res, next) => {
    try {
      const item = await productService.getProductById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.locals.product = item;
      next();
    } catch (error) {
      // Malformed id (e.g. bad ObjectId) or lookup failure — fail cleanly
      // instead of throwing out of an async middleware.
      res.status(400).json({ message: "Invalid product id" });
    }
  };
};
