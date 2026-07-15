import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;

    if (!token)
      return res.status(404).json({
        success: false,
        message: "token not found",
      });

    let decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

    let user = await UserModel.findById(decode.id).select("-password");

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
    });
  }
};
