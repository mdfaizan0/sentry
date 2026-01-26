import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import projectRouter from "./routes/project.route.js"
import ticketRouter from "./routes/ticket.route.js"
import commentRouter from "./routes/comment.route.js"
import { errorHandler } from "./middlewares/errorHandler.js"

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRouter)
app.use("/api/projects", projectRouter)
app.use("/api/tickets", ticketRouter)
app.use("/api/comments", commentRouter)


app.get("/health", (req, res) => {
    res.json({ message: "ok" })
})

app.get("/", (req, res) => {
    res.send("Sentry is live 🛡️")
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))