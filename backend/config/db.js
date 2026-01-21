import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${connected.connection.host}`)
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error}`)
        process.exit(1)
    }
}