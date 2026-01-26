import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export async function register(req, res) {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required", success: false })
    }
    try {
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(409).json({ message: "User already exists", success: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name, email, password: hashedPassword })

        return res.status(201).json({ message: `User ${newUser.name} registered successfully`, success: true })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message })
    }
}

export async function login(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required", success: false })
    }
    try {
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials", success: false })
        }

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })

        return res.status(200).json({ message: "User logged in successfully", success: true, user: { id: user._id, name: user.name, email: user.email }, token })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message })
    }
}