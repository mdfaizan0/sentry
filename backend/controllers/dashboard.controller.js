import Project from "../models/Project.js"
import Ticket from "../models/Ticket.js"

export async function getDashboardData(req, res) {
    const userId = req.user.id

    try {
        // 1. Total Projects (Owner or Member)
        const projects = await Project.find({
            $or: [{ owner: userId }, { members: { $in: [userId] } }]
        })
        const totalProjects = projects.length
        const projectIds = projects.map(p => p._id)

        // 2. Active Tickets Assigned to Me across these projects
        // Active = Open or In Progress
        const activeTicketsCount = await Ticket.countDocuments({
            projectId: { $in: projectIds },
            assignee: userId,
            status: { $in: ["Open", "In Progress"] }
        })

        // 3. High Priority Tickets Assigned to Me
        const highPriorityCount = await Ticket.countDocuments({
            projectId: { $in: projectIds },
            assignee: userId,
            priority: "High"
        })

        // 4. "My Active Work" - List of tickets
        const activeWork = await Ticket.find({
            projectId: { $in: projectIds },
            assignee: userId,
            status: { $in: ["Open", "In Progress"] }
        })
            .populate("projectId", "title")
            .sort({ priority: -1, updatedAt: -1 }) // Sort by High priority first, then recency
            .limit(10)

        return res.status(200).json({
            success: true,
            stats: {
                totalProjects,
                activeTicketsCount,
                highPriorityCount
            },
            activeWork
        })
    } catch (error) {
        console.error("Dashboard data fetch error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data"
        })
    }
}
