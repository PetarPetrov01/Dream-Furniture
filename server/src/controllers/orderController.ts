import { Router } from "express";
import { isUser } from "../middlewares/guards.js";
import { orderValidators } from "../middlewares/validators.js";
import validate from "../middlewares/validate.js";
import * as orderService from "../services/orderService.js";

const orderController = Router();

orderController.get("/", isUser(), async (req, res) => {
  const orders = await orderService.getOrders(req.user?._id as string);
  res.json(orders);
});

orderController.get("/:id", isUser(), async (req, res) => {
  const order = await orderService.getOrderById(req.params.id as string);
  res.json(order);
});

orderController.post("/create", isUser(), ...orderValidators, validate, async (req, res) => {
  const data = req.body;
  data._ownerId = req.user!._id;
  const order = await orderService.createOrder(data);
  res.json(order);
});

orderController.delete("/:id", isUser(), async (req, res) => {
  await orderService.deleteOrder(req.params.id as string);
  res.json({ message: "Successfully deleted" });
});

export default orderController;
