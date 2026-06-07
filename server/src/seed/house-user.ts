import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";

const HOUSE_EMAIL = "house@dreamfurniture.local";
const HOUSE_USERNAME = "DreamFurniture";

export async function ensureHouseUser() {
  let user = await User.findOne({ email: HOUSE_EMAIL });
  if (user) return user;
  const password = crypto.randomBytes(16).toString("hex");
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    email: HOUSE_EMAIL,
    username: HOUSE_USERNAME,
    hashedPassword,
  });
  console.log(`[seed] Created house user ${HOUSE_EMAIL}`);
  return user;
}

export { HOUSE_EMAIL };
