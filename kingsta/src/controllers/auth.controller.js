import UserModel from "../models/user.model.js";
import { sendFiles } from "../services/storage.service.js";
import { generateToken } from "../utils/token.js";

export const registerController = async (req, res) => {
  try {
    let { username, fullName, email, mobile, password, bio, dob } = req.body;
    let file = req.file;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadFile = await sendFiles(file.buffer, file.originalname);

    const newUser = await UserModel.create({
      username,
      fullName,
      email,
      password,
      bio,
      dob,
      mobile,
      profile_pic: uploadFile.url,
    });

    const accessToken = generateToken(newUser._id, "15min");
    const refreshToken = generateToken(newUser._id, "1d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let isExisted = await UserModel.findOne({ email }).select("-password");

    if (!isExisted)
      return res.status(404).json({
        success: false,
        message: "user not found",
      });

    let checkPass = isExisted.comparePass(password);

    if (!checkPass)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    const accessToken = generateToken(isExisted._id, "15min");
    const refreshToken = generateToken(isExisted._id, "1d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User loggedIn",
      data: isExisted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error,
    });
  }
};
