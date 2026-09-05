import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'

import authRoutes from '../routes/auth.routes.js'
import serverRoutes from '../routes/server.route.js'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import redis from '../config/redis.config.js'
import { errorMiddleware } from '../middlewares/error.middleware.js'
import serverMemberRoutes from '../routes/serverMember.routes.js'
import roleRoutes from '../routes/role.routes.js'
import userRoutes from '../routes/user.routes.js'
const app = express()



app.use(passport.initialize());


app.use(express.json())
app.use(cookieParser())


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL
},(_,__,profile,done)=>{
    return done(null,profile)
}
))    

console.log("🔥 APP FILE LOADED");

app.use('/api/auth', authRoutes);

console.log("🔥 AUTH ROUTES MOUNTED");
app.use('/api/server',serverRoutes)
app.use('/api/server',serverMemberRoutes)
app.use('/api/server',roleRoutes)
app.use('/api/user',userRoutes)

app.use(errorMiddleware)

export default app