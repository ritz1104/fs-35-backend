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
      error:error.message,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordCorrect = user.comparePass(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate Tokens
    const accessToken = generateToken(user._id, "15m");
    const refreshToken = generateToken(user._id, "1d");

    // (Optional but Recommended)
    // user.refreshToken = refreshToken;
    // await user.save();

    // Set Cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: false, // true in production
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false, // true in production
      sameSite: "strict",
    });

    // Remove password before sending response
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
