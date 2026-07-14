import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(express.json());

export default app;
