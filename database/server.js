const express = require("express");
const { default: mongoose } = require("mongoose");
const UserModel = require("./models/user.model");

const app = express();

app.use(express.json());

const connectDb = async () => {
  await mongoose.connect(
    "mongodb://0.0.0.0/test"
  );
  console.log("mongodb connected");
};  

connectDb();

app.get("/", (req, res) => {
  res.send("ok");
});

app.post("/create", async (req, res) => {
  const { name, email, password, mobile, gender } = req.body;

  if (!name || !email || !password || !mobile || !gender)
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });

  const newUser = await UserModel.create({
    name,
    email,
    password,
    mobile,
    gender,
  });

  return res.status(201).json({
    success: true,
    message: "User created",
    data: newUser,
  });
});

app.listen(3000, () => {
  console.log("server run hogya hai 3000 pe");
});
