import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {upload} from '../config/multer.js'
import { createStories, getStories } from "../controllers/stories.controller.js";
const router = express.Router()

router.post('/create',authMiddleware,upload.single('file'),createStories)
router.get('/get-stories',authMiddleware,getStories)
export default router