import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { createServer, joinServer } from '../controllers/server.controller.js'
import { upload } from '../config/multer.config.js'

const router = express.Router()

router.post('/create',authMiddleware,upload.fields([
    {name:"icon",maxCount:1},
    {name:"banner",maxCount:1}
]),createServer)
router.post('/join/:inviteCode',authMiddleware,joinServer)
export default router
