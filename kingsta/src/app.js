import express, { urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRouter from './routes/user.routes.js'
import commentRouter from "./routes/comment.routes.js"
import reelsRouter from './routes/reels.routes.js'
import storyRouter from './routes/stories.routes.js'
import morgan from "morgan"
import passport from 'passport'
import {Strategy as GoogleStrategy } from 'passport-google-oauth20'

import UserModel from "./models/user.model.js";
import { generateToken } from "./utils/token.js";
import redis from "./config/redis.config.js";
const app = express();

app.use(cookieParser());
app.use(morgan('dev'));

app.use(express.json());
app.use(urlencoded({extended:true}))

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
   callbackURL:process.env.GOOGLE_CALLBACK_URL
},(_,__,profile,done)=>{
    return done(null,profile)
}))





app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users",userRouter)
app.use("/api/comments",commentRouter)
app.use("/api/stories",storyRouter)
app.use("/api/reels",reelsRouter)




export default app;
