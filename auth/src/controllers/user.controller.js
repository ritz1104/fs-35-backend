const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");

const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    const hashPass = bcrypt.hashSync(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashPass,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "User registration failed",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("secret", token);

    return res.status(201).json({
      success: true,
      message: "User registered",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and password is required",
      });

    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const comparePass = bcrypt.compareSync(password, user.password);

    if (!comparePass)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("secret", token);

    return res.status(200).json({
      success: true,
      message: "User loggedIn",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
};
