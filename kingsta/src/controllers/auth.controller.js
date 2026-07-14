import UserModel from "../models/user.model";
import { sendFiles } from "../services/storage.service";
import { generateToken } from "../utils/token";

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
