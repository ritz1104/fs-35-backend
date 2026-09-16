import express from 'express'
import { createMessage } from '../controllers/message.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post("/create/:channelId",authMiddleware,createMessage)

export default router