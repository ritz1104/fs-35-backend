import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import redis from "../config/redis.config.js";
import ApiError from "../utils/ApiError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;

    if (!token) throw new ApiError(400,"token is required")


      const isTokenBlacklisted = await redis.get(`bearer:accessToken:${accessToken}`)

      if(isTokenBlacklisted) return res.status(401).json({
        success:false,
        message:"token is invalid"
      })

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
