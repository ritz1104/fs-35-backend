import express from "express";
import { upload } from "../config/multer.js";
import {
  forgotPassword,
  loginController,
  refreshToken,
  registerController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerController);
router.post("/login", loginController);
router.post("/refresh-token",refreshToken)
router.post("/forgot-password",forgotPassword)
export default router;
