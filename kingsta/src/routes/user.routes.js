import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { changePassword, followUser, getFollowers, getMe, getUserProfile,  searchUser,  unfollowUser,  updateProfile, updateProfilePicture } from "../controllers/user.controller.js";

import { upload } from "../config/multer.js";

const router = express.Router();

router.get('/getMe',authMiddleware,getMe)
router.patch('/update-profile',authMiddleware,updateProfile)

router.get('/search',authMiddleware,searchUser)
router.patch('/follow/:id',authMiddleware,followUser)
router.patch('/unfollow/:id',authMiddleware,unfollowUser)
router.get('/:id/followers',authMiddleware,getFollowers)
router.patch('/update-profile-pic',authMiddleware,upload.single("profile_pic"),updateProfilePicture

)
router.patch("/change-password",authMiddleware,changePassword)
router.get('/:username',authMiddleware,getUserProfile)

export default router;
