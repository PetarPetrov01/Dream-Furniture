const bcrypt = require("bcrypt");
const User = require("../models/User");

const HOUSE_EMAIL = "house@dreamfurniture.local";
const HOUSE_USERNAME = "DreamFurniture";

async function ensureHouseUser() {
  let user = await User.findOne({ email: HOUSE_EMAIL });
  if (user) return user;
  const password = require("crypto").randomBytes(16).toString("hex");
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    email: HOUSE_EMAIL,
    username: HOUSE_USERNAME,
    hashedPassword,
  });
  console.log(`[seed] Created house user ${HOUSE_EMAIL}`);
  return user;
}

module.exports = { ensureHouseUser, HOUSE_EMAIL };
