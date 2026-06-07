const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret: secret } = require("../config/env");

const TOKEN_TTL = "7d";

async function login(email, password) {
  const existingUser = await User.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  });
  if (!existingUser) {
    throw new Error("Invalid email or password");
  }

  const matchPass = await bcrypt.compare(password, existingUser.hashedPassword);
  if (!matchPass) {
    throw new Error("Invalid email or password");
  }

  return createToken(existingUser);
}

async function register(username, email, password) {
  const existingUser = await User.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  });

  if (existingUser) {
    throw new Error("This email is already taken");
  }

  const user = await User.create({
    email,
    username,
    hashedPassword: await bcrypt.hash(password, 10),
  });

  return createToken(user);
}

async function getUser(userId) {
  const user = await User.findOne({ _id: userId });
  return {
    email: user.email,
    username: user.username,
    _id: user._id,
    wishlist: user.wishlist,
  };
}

async function editUser(userId, username, email) {
  const user = await User.findOne({_id: userId});

  user.username = username;
  user.email = email;

  await user.save();
  return {
    email: user.email,
    username: user.username,
    _id: user._id,
    wishlist: user.wishlist,
  };
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

function createToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  return {
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      wishlist: user.wishlist,
    },
    authToken: jwt.sign(payload, secret, { expiresIn: TOKEN_TTL }),
  };
}

const authService = {
  login,
  register,
  getUser,
  editUser,
  verifyToken,
};

module.exports = authService;
