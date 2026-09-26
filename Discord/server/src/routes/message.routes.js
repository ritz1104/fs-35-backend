import express from 'express'
import { createMessage, deleteMessage, getAllChannelMessage, getMessage, updateMessage } from '../controllers/message.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { upload } from '../config/multer.config.js'

const router = express.Router()

router.use(authMiddleware)
router.post("/:channelId/messages", upload.array("attachments"), createMessage)
router.get("/:channelId/messages", getAllChannelMessage)
router.get("/:channelId/messages/:messageId", getMessage)
router.patch("/:channelId/messages/:messageId", updateMessage)
router.delete("/:channelId/messages/:messageId", deleteMessage)

export default router