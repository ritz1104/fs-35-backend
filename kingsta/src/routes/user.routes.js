import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { followUser, getMe, getUserProfile,  searchUser,  updateProfile } from "../controllers/user.controller.js";


const router = express.Router();

router.get('/getMe',authMiddleware,getMe)
router.patch('/update-profile',authMiddleware,updateProfile)

router.get('/search',authMiddleware,searchUser)
router.patch('/follow/:id',authMiddleware,followUser)
router.get('/:username',authMiddleware,getUserProfile)
export default router;
