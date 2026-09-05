import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { createServer, joinServer } from '../controllers/server.controller.js'
import { upload } from '../config/multer.config.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createServerValidators, inviteCodeValidator } from '../validators/server.validator.js'

const router = express.Router()

router.post('/create',authMiddleware,upload.fields([
    {name:"icon",maxCount:1},
    {name:"banner",maxCount:1}
]),createServerValidators,validate,createServer)
router.post('/join/:inviteCode',authMiddleware,inviteCodeValidator,validate,joinServer)


export default router
