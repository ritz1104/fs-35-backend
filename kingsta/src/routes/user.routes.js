import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getMe, getUserProfile, updateProfile } from "../controllers/user.controller.js";


const router = express.Router();

router.get('/getMe',authMiddleware,getMe)
router.patch('/update-profile',authMiddleware,updateProfile)
router.get('/:username',authMiddleware,getUserProfile)


export default router;
