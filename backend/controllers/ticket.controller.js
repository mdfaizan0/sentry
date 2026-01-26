import Ticket from "../models/Ticket.js"
import User from "../models/User.js"
import Comment from "../models/Comment.js"

export async function createTicket(req, res) {
    const { projectId } = req.params
    const { title, description, priority, status } = req.body

    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required", success: false })
    }

    try {
        const ticket = await Ticket.create({ title, description, priority, status, projectId })

        return res.status(201).json({ message: "Ticket created successfully", success: true, ticket })
    } catch (error) {
        console.error("Failed to create ticket", error.message)
        return res.status(500).json({ message: "Failed to create ticket", success: false })
    }
}

export async function listTicketsByProject(req, res) {
    const { projectId } = req.params
    const { status, priority, assignee } = req.query

    const filters = { projectId }
    if (status) filters.status = status
    if (priority) filters.priority = priority
    if (assignee) filters.assignee = assignee

    try {
        const tickets = await Ticket.find(filters).populate("assignee")

        return res.status(200).json({ message: "Tickets fetched successfully", success: true, tickets })
    } catch (error) {
        console.error("Failed to list tickets by ID", error.message)
        return res.status(500).json({ message: "Failed to fetch tickets", success: false })
    }
}

export async function getOneTicket(req, res) {
    const { projectId, ticketId } = req.params
    try {
        const ticket = await Ticket.findById(ticketId).populate("assignee")

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        if (ticket.projectId.toString() !== projectId) {
            return res.status(400).json({ message: "Ticket does not belong to this project" })
        }

        return res.status(200).json({ message: "Ticket fetched successfully", success: true, ticket })
    } catch (error) {
        console.error("Failed to get a ticket", error.message)
        return res.status(500).json({ message: "Failed to fetch ticket", success: false })
    }
}

export async function updateTicket(req, res) {
    const { projectId, ticketId } = req.params
    const { title, description, priority, status } = req.body

    if (!title && !description && !priority && !status) {
        return res.status(400).json({ message: "Title, description, priority or status is required", success: false })
    }

    let updates = {}
    if (title) updates.title = title
    if (description) updates.description = description
    if (priority) updates.priority = priority
    if (status) updates.status = status

    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updates, { new: true })

        if (!updatedTicket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        if (updatedTicket.projectId.toString() !== projectId) {
            return res.status(400).json({ message: "Ticket does not belong to this project" })
        }

        return res.status(200).json({ message: "Ticket updated successfully", success: true, ticket: updatedTicket })
    } catch (error) {
        console.error("Failed to update a ticket", error.message)
        return res.status(500).json({ message: "Failed to update ticket", success: false })
    }
}

export async function deleteTicket(req, res) {
    const { projectId, ticketId } = req.params
    try {

        const deletedTicket = await Ticket.findByIdAndDelete(ticketId)

        if (!deletedTicket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        if (deletedTicket.projectId.toString() !== projectId) {
            return res.status(400).json({ message: "Ticket does not belong to this project" })
        }

        await Comment.deleteMany({ ticketId })

        return res.status(200).json({ message: "Ticket deleted successfully", success: true, ticket: deletedTicket })
    } catch (error) {
        console.error("Failed to delete a ticket", error.message)
        return res.status(500).json({ message: "Failed to delete ticket", success: false })
    }
}

export async function assignTicket(req, res) {
    const { ticketId } = req.params
    const { assigneeId } = req.body
    const project = req.project

    try {
        const ticket = await Ticket.findById(ticketId).populate("assignee")

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        if (ticket?.assignee) {
            return res.status(400).json({ message: `Ticket is already assigned to ${ticket.assignee.name}`, success: false })
        }

        const isOwner = project.owner.toString() === req.user.id

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to assign this ticket", success: false })
        }

        if (!project.members.includes(assigneeId)) {
            return res.status(403).json({ message: "Assignee has not been included in this project, add them into the project, then assign the ticket", success: false })
        }

        const user = await User.findById(assigneeId)

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }

        ticket.assignee = assigneeId
        await ticket.save()

        return res.status(200).json({ message: "Ticket assigned successfully", success: true, ticket })
    } catch (error) {
        console.error("Failed to assign a ticket", error.message)
        return res.status(500).json({ message: "Failed to assign ticket", success: false })
    }
}