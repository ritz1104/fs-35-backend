const express = require("express");
const userRoutes = require("./src/routes/user.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("i m server");
});

app.use("/api/auth", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
