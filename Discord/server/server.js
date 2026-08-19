import app from "./src/app/app.js";
import { connectDB } from "./src/config/db.config.js";

connectDB()

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})