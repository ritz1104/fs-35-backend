import express from "express";
import { upload } from "../config/multer";
import { registerController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", upload.single("image"), registerController);

export default router;
