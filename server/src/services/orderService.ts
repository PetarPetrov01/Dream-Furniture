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
  // Fetch every referenced product in one query instead of N sequential lookups.
  const ids = data.products.map((p) => p.product);
  const products = await Product.find({ _id: { $in: ids } })
    .select("price _ownerId")
    .lean();
  const byId = new Map(products.map((p) => [String(p._id), p]));

  // Compute the total server-side; never trust a client-supplied price.
  let totalPrice = 0;
  for (const item of data.products) {
    const product = byId.get(String(item.product));
    if (!product) throw new AppError("Product not found", 404);
    if (String(product._ownerId) === String(data._ownerId)) {
      throw new AppError("You can't buy your own product", 400);
    }
    totalPrice += product.price * item.count;
  }

  data.totalPrice = totalPrice;
  return Order.create(data);
}

export async function deleteOrder(id: string) {
  return Order.findByIdAndDelete(id);
}
