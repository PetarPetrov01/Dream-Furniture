const Product = require("../models/Product");
const User = require("../models/User");
const AppError = require("../util/AppError");

async function toggleItemInWishlist(userId, productId) {
  const user = await User.findById(userId);
  const product = await Product.findById(productId);

  if (product._ownerId.toString() == userId) {
    throw new AppError("You can't add your own product to the wishlist", 400);
  }

  const productInWishlist = user.wishlist.find((prodId) => {
    return prodId == productId;
  });

  if (productInWishlist) {
    //remove from wish list
    user.wishlist = user.wishlist.filter((prodId) => prodId != productId);
  } else {
    //add to wishlist
    user.wishlist.push(productId);
  }

  const newUser = await user.save();
  return newUser;
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
