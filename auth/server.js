require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/user.routes");
const homeRoutes = require("./src/routes/home.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB();

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/home", homeRoutes);

app.listen(3000, () => {
  console.log("running on port 3000");
});
