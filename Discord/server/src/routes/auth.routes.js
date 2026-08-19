import express from 'express'
import upload from '../config/multer.config.js'

const router = express.Router()

router.post('/register',upload.single("image"))

export default router
