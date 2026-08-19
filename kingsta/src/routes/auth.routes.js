import express from "express";
import { upload } from "../config/multer.js";
import {
  forgotPassword,
  googleAuth,
  loginController,
  logoutUser,
  refreshToken,
  registerController,
} from "../controllers/auth.controller.js";
import passport from 'passport'

const router = express.Router();

router.post("/register", upload.single("image"), registerController);
router.post("/login", loginController);
router.post("/logout",logoutUser)
router.post("/refresh-token",refreshToken)
router.post("/forgot-password",forgotPassword)
router.get('/google',passport.authenticate('google',{scope:['profile','email']}))

router.get('/google/callback',passport.authenticate('google',{
    session:false,
    failureRedirect:'/'}),googleAuth)


export default router;
