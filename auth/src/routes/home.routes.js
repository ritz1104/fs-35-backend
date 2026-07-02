const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const router = express.Router();

router.get(
  "/",
  async (req, res, next) => {
    const token = req.cookies.secret;

    if (!token)
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode)
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });

    const user = await UserModel.findById(decode.id);

    req.user = user;

    next();
  },
  (req, res) => {
    res.status(200).json({
      message: "I m home route",
      data: req.user,
    });
  }
);

module.exports = router;
