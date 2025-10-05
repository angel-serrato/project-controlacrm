import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"

const PORT = process.env.PORT || 5001
const VITE_URL = process.env.VITE_API_URL

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
    origin: [`http://localhost:${PORT}`, `${VITE_URL}`]
}))

app.use("/api/auth", authRoutes)


connectDB().then(() => {
    app.get('/', (req, res) => {
        res.send("Hello API")
    })

    app.listen(PORT, () => {
        console.log(`Server started http://localhost:${PORT}/`)
    })
})