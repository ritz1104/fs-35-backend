import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

connectDB();

let PORT = process.env.port || 4000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
