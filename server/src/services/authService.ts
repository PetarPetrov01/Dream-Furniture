import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import User, { IUser } from "../models/User.js";
import { jwtSecret as secret } from "../config/env.js";
import AppError from "../util/AppError.js";

const TOKEN_TTL: SignOptions["expiresIn"] = "7d";

interface TokenPayload { _id: string; email: string; }

export async function login(email: string, password: string) {
  const existingUser = await User.findOne({ email }).collation({ locale: "en", strength: 2 });
  if (!existingUser) throw new AppError("Invalid email or password", 401);
  const matchPass = await bcrypt.compare(password, existingUser.hashedPassword);
  if (!matchPass) throw new AppError("Invalid email or password", 401);
  return createToken(existingUser);
}

export async function register(username: string, email: string, password: string) {
  const existingUser = await User.findOne({ email }).collation({ locale: "en", strength: 2 });
  if (existingUser) throw new AppError("This email is already taken", 409);
  const user = await User.create({ email, username, hashedPassword: await bcrypt.hash(password, 10) });
  return createToken(user);
}

export async function getUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return { email: user.email, username: user.username, _id: user._id, wishlist: user.wishlist };
}

export async function editUser(userId: string, username: string, email: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  user.username = username;
  user.email = email;
  await user.save();
  return { email: user.email, username: user.username, _id: user._id, wishlist: user.wishlist };
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, secret) as TokenPayload;
}

function createToken(user: HydratedDocument<IUser>) {
  const payload: TokenPayload = { _id: user._id.toString(), email: user.email };
  return {
    user: { _id: user._id, email: user.email, username: user.username, wishlist: user.wishlist },
    authToken: jwt.sign(payload, secret, { expiresIn: TOKEN_TTL }),
  };
}
