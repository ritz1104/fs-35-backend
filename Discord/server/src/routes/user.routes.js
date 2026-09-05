import express from "express";
import { upload } from "../config/multer.config.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { changePassword, getMe, getUserProfile, searchUser, updateProfile, updateProfilePicture } from "../controllers/user.controller.js";
import { changePasswordValidators, searchUserValidators, updateProfileValidators, usernameValidator } from "../validators/user.validator.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/me", getMe);
router.patch("/me", updateProfileValidators, validate, updateProfile);
router.patch("/me/password", changePasswordValidators, validate, changePassword);
router.patch("/me/profile-picture", upload.single("image"), updateProfilePicture);
router.get("/search", searchUserValidators, validate, searchUser);
router.get("/:username", usernameValidator, validate, getUserProfile);

export default router;