const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const { databaseUrl, cookieSecret } = require("./env");

const session = require("../middlewares/session");
const queryParams = require("../middlewares/queryParams");

module.exports = async (app) => {
  const connection = await mongoose.connect(databaseUrl);
  console.log("Connected to Database");

  app.use(helmet());
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser(cookieSecret));
  app.use(
    cors({
      origin: [
        "http://localhost:4200",
        "http://localhost:3000",
        "https://dream-furniture-1e92c.web.app",
      ],
      credentials: true,
      exposedHeaders: ["X-Total-Count"],
    })
  );
  app.use(session());
  app.use(queryParams());
};
