import express from "express"
import dotenv from "dotenv"

import { connectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()

app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5001

connectDB().then(() => {
    app.get('/', (req, res) => {
        res.send("Hello API")
    })

    app.listen(PORT, () => {
        console.log(`Server started http://localhost:${PORT}/`)
    })
})