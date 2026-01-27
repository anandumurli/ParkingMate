import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import path from "path"

import { connectDB } from "./config/db.js"
dotenv.config(); //making sure the dotenv variables can be read/

const app = express()
app.use(express.json()) //middleware for being able to access json files across req, res.

// user manipulation apis
app.use("/api/users", userRoutes)
// auth apis
app.use("/api/auth", authRoutes)

// to serve the files.
app.use(express.static("src/public"));
app.get("/", (req, res) => {
    res.sendFile(path.resolve("src/public/index.html"));
});



connectDB().then(()=>{
    app.listen(3000, ()=>{
        console.log("Server listening on")
    })
})






