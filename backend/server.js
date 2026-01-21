import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

app.get("/health", (req, res) => {
    res.json({ message: "ok" })
})

app.get("/", (req, res) => {
    res.send("Sentry is live 🛡️")
})