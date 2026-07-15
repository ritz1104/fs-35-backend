import express from "express";
import { upload } from "../config/multer.js";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerController);
router.post("/login", loginController);

export default router;
