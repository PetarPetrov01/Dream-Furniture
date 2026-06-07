const { isUser } = require("../middlewares/guards");
const asyncHandler = require("../util/asyncHandler");
const orderService = require("../services/orderService");

const orderController = require("express").Router();

orderController.get(
  "/",
  isUser(),
  asyncHandler(async (req, res) => {
    const orders = await orderService.getOrders(req.user?._id);
    res.json(orders);
  })
);

orderController.get(
  "/:id",
  isUser(),
  asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  })
);

orderController.post(
  "/create",
  isUser(),
  asyncHandler(async (req, res) => {
    const data = req.body;
    data._ownerId = req.user._id;
    const order = await orderService.createOrder(data);
    res.json(order);
  })
);

orderController.delete(
  "/:id",
  isUser(),
  asyncHandler(async (req, res) => {
    await orderService.deleteOrder(req.params.id);
    res.json({ message: "Successfully deleted" });
  })
);

module.exports = orderController;
