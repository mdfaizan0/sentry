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
        const ticket = await Ticket.findById(ticketId).populate("assignee").populate("projectId")

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        if (ticket.projectId._id.toString() !== projectId) {
            return res.status(400).json({ message: "Ticket does not belong to this project" })
        }

        return res.status(200).json({ message: "Ticket fetched successfully", success: true, ticket })
    } catch (error) {
        console.error("Failed to get a ticket", error.message)
        return res.status(500).json({ message: "Failed to fetch ticket", success: false })
    }
}

export async function updateTicket(req, res) {
    const { projectId, ticketId } = req.params;
    const { title, description, priority, status } = req.body;

    try {
        const ticket = await Ticket.findOne({ _id: ticketId, projectId }).populate("projectId");

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", success: false });
        }

        const isProjectOwner = ticket.projectId.owner.toString() === req.user.id;
        const isTicketAssignee = ticket.assignee?.toString() === req.user.id;

        if (!isProjectOwner && !isTicketAssignee) {
            return res.status(403).json({ message: "You are not authorized to update this ticket", success: false });
        }

        if (title) ticket.title = title;
        if (description) ticket.description = description;
        if (priority) ticket.priority = priority;
        if (status) ticket.status = status;

        const updatedTicket = await ticket.save();

        return res.status(200).json({
            message: "Ticket updated successfully",
            success: true,
            ticket: updatedTicket
        });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function deleteTicket(req, res) {
    const { projectId, ticketId } = req.params
    try {

        const ticket = await Ticket.findOne({ _id: ticketId, projectId }).populate("projectId")

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        if (ticket.projectId._id.toString() !== projectId) {
            return res.status(400).json({ message: "Ticket does not belong to this project" })
        }

        const isProjectOwner = ticket.projectId.owner.toString() === req.user.id

        if (!isProjectOwner) {
            return res.status(403).json({ message: "You are not authorized to delete this ticket", success: false })
        }

        await Comment.deleteMany({ ticketId: ticket._id })
        const deletedTicket = await ticket.deleteOne()

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

export async function unassignTicket(req, res) {
    const { ticketId } = req.params
    const project = req.project

    try {
        const ticket = await Ticket.findById(ticketId).populate("assignee")

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        if (!ticket.assignee) {
            return res.status(400).json({ message: "Ticket is not assigned to anyone", success: false })
        }

        const isOwner = project.owner.toString() === req.user.id

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to unassign this ticket", success: false })
        }

        ticket.assignee = null
        await ticket.save()

        return res.status(200).json({ message: "Ticket unassigned successfully", success: true, ticket })
    } catch (error) {
        console.error("Failed to unassign a ticket", error.message)
        return res.status(500).json({ message: "Failed to unassign ticket", success: false })
    }
}

export async function changeAssignee(req, res) {
    const { ticketId } = req.params
    const { assigneeId } = req.body
    const project = req.project

    try {
        const user = await User.findById(assigneeId)

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }

        const ticket = await Ticket.findById(ticketId).populate("assignee")

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        if (!ticket.assignee) {
            return res.status(400).json({ message: "Ticket is not assigned to anyone", success: false })
        }

        const isOwner = project.owner.toString() === req.user.id

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to change the assignee of this ticket", success: false })
        }

        if (!project.members.includes(assigneeId)) {
            return res.status(403).json({ message: "Assignee has not been included in this project, add them into the project, then assign the ticket", success: false })
        }

        ticket.assignee = assigneeId
        await ticket.save()

        return res.status(200).json({ message: "Ticket assignee changed successfully", success: true, ticket })
    } catch (error) {
        console.error("Failed to change the assignee of a ticket", error.message)
        return res.status(500).json({ message: "Failed to change the assignee of ticket", success: false })
    }
}