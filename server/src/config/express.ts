import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { databaseUrl, cookieSecret } from "./env.js";
import session from "../middlewares/session.js";
import queryParams from "../middlewares/queryParams.js";

export default async (app: Express) => {
  await mongoose.connect(databaseUrl);
  console.log("Connected to Database");

  app.use(helmet());
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser(cookieSecret));
  app.use(
    cors({
      origin: ["http://localhost:4200", "http://localhost:3000", "https://dream-furniture-1e92c.web.app"],
      credentials: true,
      exposedHeaders: ["X-Total-Count"],
    })
  );
  app.use(session());
  app.use(queryParams());
};
