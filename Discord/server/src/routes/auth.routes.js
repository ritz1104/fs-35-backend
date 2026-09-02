import express from 'express'
import {upload} from '../config/multer.config.js'
import passport from 'passport'
import { forgetPassword, googleAuth, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js'
import { registerValidtors } from '../validators/auth.validator.js'
import { validate } from '../middlewares/validate.middleware.js'


const router = express.Router()

router.post('/register',upload.single("image"),registerValidtors,validate,registerUser)
router.get('/google',passport.authenticate('google',{scope:['profile','email']}))
router.post('/login',loginUser)
router.get('/google/callback',passport.authenticate('google',{session:false,
    failureRedirect:'/'
}),googleAuth)

router.post('/logout',logoutUser)

router.post('/forget-password',forgetPassword)
export default router
