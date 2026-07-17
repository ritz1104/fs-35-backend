import express, { urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRouter from './routes/user.routes.js'
const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(urlencoded({extended:true}))

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users",userRouter)

export default app;
