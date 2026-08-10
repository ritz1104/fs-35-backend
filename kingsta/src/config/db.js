
import mongoose from "mongoose";
console.log(process.env.MONGO_URI)

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected");
  } catch (error) {
    console.log("error in mongodb", error);
  }
};
