import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("connecting to db with this link", process.env.DB_LINK);
    await mongoose.connect(process.env.DB_LINK);
  } catch (err) {
    console.log("error while connecting to db", err);
  }
};
