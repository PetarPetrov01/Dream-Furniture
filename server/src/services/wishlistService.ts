import Product from "../models/Product.js";
import User from "../models/User.js";
import AppError from "../util/AppError.js";

export async function toggleItemInWishlist(userId: string, productId: string) {
  const product = await Product.findById(productId).select("_ownerId");
  if (!product) throw new AppError("Product not found", 404);
  if (String(product._ownerId) === String(userId)) {
    throw new AppError("You can't add your own product to the wishlist", 400);
  }

  const present = await User.exists({ _id: userId, wishlist: productId });
  const update = present ? { $pull: { wishlist: productId } } : { $addToSet: { wishlist: productId } };

  return User.findByIdAndUpdate(userId, update, { new: true });
}

export async function getWishlist(userId: string) {
  const user = await User.findById(userId)
    .lean()
    .populate({ path: "wishlist", populate: { path: "_ownerId", select: { hashedPassword: 0, __v: 0 } } });
  if (!user) throw new AppError("User not found", 404);
  return user.wishlist;
}
