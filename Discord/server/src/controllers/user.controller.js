import UserModel from "../models/user.model.js";
import sendFiles from "../services/storage.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, fullname, mobile_no, dob } = req.body;
    const updateData = {};

    if (username !== undefined) updateData.username = username;
    if (fullname !== undefined) updateData.fullname = fullname;
    if (mobile_no !== undefined) updateData.mobile_no = mobile_no;
    if (dob !== undefined) updateData.dob = dob;

    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) throw new ApiError(404, "User not found");
    return res.status(200).json(new ApiResponse(200, updatedUser, "User profile updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username }).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const searchUser = async (req, res, next) => {
  try {
    const users = await UserModel.find({
      $or: [
        { username: { $regex: req.query.query, $options: "i" } },
        { fullname: { $regex: req.query.query, $options: "i" } },
      ],
    }).select("username fullname profile_pic");

    if (!users.length) throw new ApiError(404, "User not found");
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;
    if (password === newPassword) throw new ApiError(409, "New password must be different");

    const user = await UserModel.findById(req.user.id).select("+password");
    if (!user) throw new ApiError(404, "User not found");
    if (!user.password || !user.comparePass(password)) throw new ApiError(401, "Incorrect password");

    user.password = newPassword;
    await user.save();
    return res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, "Profile picture is required");

    const user = await UserModel.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    const uploadFile = await sendFiles(req.file.buffer, req.file.originalname);
    user.profile_pic = uploadFile.url;
    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "Profile picture updated successfully"));
  } catch (error) {
    next(error);
  }
};