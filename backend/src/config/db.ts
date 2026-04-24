import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB Atlas Connected");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};
