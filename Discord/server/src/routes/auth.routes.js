import express from 'express'
import {upload} from '../config/multer.config.js'
import passport from 'passport'
import { googleAuth, logoutUser, registerUser } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register',upload.single("image"),registerUser)
router.get('/google',passport.authenticate('google',{scope:['profile','email']}))

router.get('/google/callback',passport.authenticate('google',{session:false,
    failureRedirect:'/'
}),googleAuth)

router.post('/logout',logoutUser)
export default router
