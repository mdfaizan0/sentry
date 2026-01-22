import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function protect(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid/Expired token" })
    }
}