import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {upload} from '../config/multer.js'
import { createStories, deleteStory, getStories, viewStories } from "../controllers/stories.controller.js";
const router = express.Router()

router.post('/create',authMiddleware,upload.single('file'),createStories)
router.get('/get-stories',authMiddleware,getStories)
router.patch('/viewers/:id',authMiddleware,viewStories)
router.delete('/delete/:id',authMiddleware,deleteStory)
export default router