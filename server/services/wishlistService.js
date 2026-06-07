const Product = require("../models/Product");
const User = require("../models/User");
const AppError = require("../util/AppError");

async function toggleItemInWishlist(userId, productId) {
  const product = await Product.findById(productId).select("_ownerId");
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  if (String(product._ownerId) === String(userId)) {
    throw new AppError("You can't add your own product to the wishlist", 400);
  }

  // Atomic field-level toggle: pull if already present, otherwise add.
  // Avoids the load-filter-save race that can drop concurrent updates.
  const present = await User.exists({ _id: userId, wishlist: productId });
  const update = present
    ? { $pull: { wishlist: productId } }
    : { $addToSet: { wishlist: productId } };

  return await User.findByIdAndUpdate(userId, update, { new: true });
}

async function getWishlist(userId) {
  const user = await User.findById(userId).lean().populate({
    path: 'wishlist',
    populate: {
      path: '_ownerId',
      select: {hashedPassword: 0, __v:0}
    }
  });

  return user.wishlist;
}

const wishlistService = {
  toggleItemInWishlist,
  getWishlist,
};

module.exports = wishlistService;
