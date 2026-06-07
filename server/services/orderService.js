const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../util/AppError");

async function getOrders(userId) {
  const orders = await Order.find({ _ownerId: userId })
    .select("_id products totalPrice count createdAt")
    .populate({
      path: "products.product",
    });

  return orders;
}

async function getOrderById(orderId) {
  return await Order.findById(orderId).populate("products.product");
}

async function createOrder(data) {
  data.totalPrice = await data.products.reduce(async (acc, p) => {
    const product = await Product.findById(p.product).lean();

    if (product._ownerId == data._ownerId) {
      throw new AppError("You can't buy your own product", 400);
    }

    return (await acc) + product.price * p.count;
  }, Promise.resolve(0));

  return await Order.create(data);
}

async function deleteOrder(id) {
  return await Order.findByIdAndDelete(id);
}

const orderService = { getOrders, getOrderById, createOrder, deleteOrder };

module.exports = orderService;
