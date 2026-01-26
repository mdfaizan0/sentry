import Project from "../models/Project.js";
import Ticket from "../models/Ticket.js";

export const checkProjectAccess = async (req, res, next) => {
    let { projectId, ticketId } = req.params

    try {
        // If projectId is missing but ticketId is present, find the project from the ticket
        if (!projectId && ticketId) {
            const ticket = await Ticket.findById(ticketId)
            if (ticket) {
                projectId = ticket.projectId
            }
        }

        if (!projectId) {
            return res.status(400).json({ message: "Project ID not provided", success: false })
        }

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false })
        }

        const isAllowedToAccess = (project.owner.toString() === req.user.id) ||
            (project.members.includes(req.user.id))

        if (!isAllowedToAccess) {
            return res.status(403).json({ message: "You are not authorized to access this project", success: false })
        }

        req.project = project
        next()
    } catch (error) {
        console.error("Failed to check project access", error.message)
        return res.status(500).json({ message: "Failed to check project access", success: false })
    }
}