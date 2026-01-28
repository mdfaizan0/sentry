import User from "../models/User.js"

export async function searchUsers(req, res) {
    const { query } = req.query
    if (!query || query.length < 2) {
        return res.status(200).json({ users: [], success: true })
    }

    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).limit(10).select("name email")

        return res.status(200).json({ users, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}
