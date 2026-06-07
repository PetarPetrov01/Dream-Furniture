import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AppError from "../util/AppError.js";

interface OrderInput {
  products: { product: string; count: number }[];
  _ownerId: string;
  totalPrice?: number;
}

export async function getOrders(userId: string) {
  return Order.find({ _ownerId: userId })
    .select("_id products totalPrice count createdAt")
    .populate({ path: "products.product" });
}

export async function getOrderById(orderId: string) {
  return Order.findById(orderId).populate("products.product");
}

export async function createOrder(data: OrderInput) {
  data.totalPrice = await data.products.reduce<Promise<number>>(async (acc, p) => {
    const product = await Product.findById(p.product).lean();
    if (!product) throw new AppError("Product not found", 404);
    if (String(product._ownerId) === String(data._ownerId)) {
      throw new AppError("You can't buy your own product", 400);
    }
    return (await acc) + product.price * p.count;
  }, Promise.resolve(0));

  return Order.create(data);
}

export async function deleteOrder(id: string) {
  return Order.findByIdAndDelete(id);
}
