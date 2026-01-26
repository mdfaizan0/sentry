import Comment from "../models/Comment.js"
import Ticket from "../models/Ticket.js";
import Project from "../models/Project.js";

export async function addComment(req, res) {
    const { ticketId } = req.params;
    const { comment } = req.body;
    try {
        const ticket = await Ticket.findById(ticketId).populate("assignee")

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        const isAllowedToComment = (ticket.assignee._id.toString() === req.user.id) ||
            (req.project.owner.toString() === req.user.id) ||
            (req.project.members.includes(req.user.id))

        if (!isAllowedToComment) {
            return res.status(403).json({ message: "You are not authorized to comment on this ticket", success: false })
        }

        const newComment = await Comment.create({
            ticketId,
            userId: req.user.id,
            comment
        })

        return res.status(201).json({ message: "Comment added successfully", success: true, comment: newComment })
    } catch (error) {
        console.error("Failed to add comment", error.message)
        return res.status(500).json({ message: "Failed to add comment", success: false })
    }
}

export async function getComments(req, res) {
    const { ticketId } = req.params
    try {
        const ticket = await Ticket.findById(ticketId)

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        const isAllowedToViewComments = (ticket.assignee._id.toString() === req.user.id) ||
            (req.project.owner.toString() === req.user.id) ||
            (req.project.members.includes(req.user.id))

        if (!isAllowedToViewComments) {
            return res.status(403).json({ message: "You are not authorized to view comments on this ticket", success: false })
        }

        const comments = await Comment.find({ ticketId }).populate("userId")

        return res.status(200).json({ message: "Comments fetched successfully", success: true, comments })
    } catch (error) {
        console.error("Failed to get comments", error.message)
        return res.status(500).json({ message: "Failed to get comments", success: false })
    }
}