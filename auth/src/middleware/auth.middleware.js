const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  // try {
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
  // } catch (error) {
  //   return res.status(401).json({
  //     success: false,
  //     message: "Token expired",
  //   });
  // }
};

module.exports = authMiddleware;
