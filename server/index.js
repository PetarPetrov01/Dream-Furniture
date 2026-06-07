const express = require("express");
const config = require("./config/express.js");

const authController = require("./controllers/authController.js");
const productController = require("./controllers/productController.js");
const orderController = require("./controllers/orderController.js");
const errorHandler = require("./middlewares/errorHandler.js");

start();
async function start() {
  const app = express();

  await config(app);

  app.use("/auth", authController);
  app.use("/products", productController);
  app.use("/orders", orderController);

  app.use(errorHandler);

  app.listen(3030, () => {
    console.log(`Listening on port 3030`);
  });
}
