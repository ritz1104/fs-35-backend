const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing fields",
        success: false,
      });
    }

    // hash password

    const hashPass = bcrypt.hashSync(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashPass,
    });

    // token generation

    const token = jwt.sign({ id: user._id }, "x,ckcgacagcgcackgckcg", {
      expiresIn: "1h",
    });

    // set token in cookies

    res.cookie("token", token)

    return res.status(201).json({
      message: "user registered",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error,
    });
  }
};

module.exports = registerController;
