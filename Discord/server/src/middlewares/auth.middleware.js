import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

import UserModel from "../models/user.model.js";
import redis from "../config/redis.config.js";
import ApiError from "../utils/ApiError.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        // 1. Check token exists
        if (!token) {
            throw new ApiError(401, "Access token is required");
        }

        // 2. Check blacklist
        const isTokenBlacklisted = await redis.get(
            `bearer:accessToken:${token}`
        );

        if (isTokenBlacklisted) {
            throw new ApiError(401, "Token is invalid");
        }

        // 3. Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        // 4. Find user
        const user = await UserModel
            .findById(decoded.id)
            .select("-password");

        if (!user) {
            throw new ApiError(401, "User not found");
        }

        // 5. Attach user to request
        req.user = user;

        // 6. Continue
        next();

    } catch (error) {
        next(error);
    }
};