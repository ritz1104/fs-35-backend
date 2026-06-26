const express = require("express");
const userRoutes = require("./src/routes/user.routes");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");

connectDB();

const app = express();

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("i m server");
});

app.use("/api/auth", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
