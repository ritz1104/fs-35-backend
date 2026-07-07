require("dotenv").config();
const express = require("express");
const postRoutes = require("./src/routes/post.routes");

const app = express();

app.use(express.json());

let PORT = process.env.port || 4000;

app.use("/api/post", postRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
