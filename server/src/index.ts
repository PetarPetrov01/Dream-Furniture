import express from "express";
import config from "./config/express.js";
import authController from "./controllers/authController.js";
import productController from "./controllers/productController.js";
import orderController from "./controllers/orderController.js";
import errorHandler from "./middlewares/errorHandler.js";

const PORT = Number(process.env.PORT) || 3030;

async function start() {
  const app = express();
  await config(app);

  app.use("/auth", authController);
  app.use("/products", productController);
  app.use("/orders", orderController);

  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

start();
