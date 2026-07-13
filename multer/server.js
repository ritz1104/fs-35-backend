require("dotenv").config();
const express = require("express");
const cors = require("cors");
const postRoutes = require("./src/routes/post.routes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/api/post", postRoutes);

let PORT = process.env.port || 4000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

let arr = [
  "Prashant Jha",
  "Kaushik Sharma",
  "Pratibha Singh",
  "Rishabh Sahu",
  "Vanshika Raj",
  "Aditya Jaiswal",
  "Aakanksha Rajak",
  "somy manjhi",
  "AP Arnav",
  "Tanush Prajapati",
];

console.log(arr[Math.floor(Math.random() * arr.length - 1)]);
