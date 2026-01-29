import Invite from "../models/Invite.js"
import Project from "../models/Project.js"
import User from "../models/User.js"
import crypto from "crypto"
import { sendInviteEmail } from "../utils/email/sendInviteEmail.js"

export async function addMemberByInvite(req, res) {
    const project = req.project
    const { email, expiryHours } = req.body

    if (!email) {
        return res.status(400).json({ message: "Email required.", success: false })
    }

    if (!email.includes("@") && !email.match(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)) {
        return res.status(400).json({ message: "Invalid Email", success: false })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found, ask user to register", success: false })
        }

        if (project.members.includes(user.id)) {
            return res.status(409).json({ message: "User already added to this project", success: false })
        }

        const existingInvite = await Invite.findOne({ email, projectId: project._id, status: "pending" })
        if (existingInvite) {
            return res.status(409).json({ message: "User already invited to this project", success: false })
        }

        const token = crypto.randomBytes(32).toString("hex")

        await project.populate("owner")

        await sendInviteEmail(project, email, token, expiryHours)

        await Invite.create({
            projectId: project._id,
            email,
            token,
            expiresAt: Date.now() + expiryHours * 60 * 60 * 1000,
            status: "pending"
        })

        return res.status(200).json({ message: "Invite sent successfully", success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function acceptInvite(req, res) {
    const { token } = req.params

    if (!token) {
        return res.status(400).json({ message: "Invalid Token", success: false })
    }

    try {
        const invite = await Invite.findOne({ token })
        if (!invite) {
            return res.status(404).json({ message: "Invite not found", success: false })
        }

        if (invite.expiresAt < Date.now()) {
            return res.status(410).json({ message: "Invite has expired", success: false })
        }

        if (invite.status === "accepted") {
            return res.status(409).json({ message: "Invite already accepted", success: false })
        }

        if (invite.status === "rejected") {
            return res.status(409).json({ message: "Invite already rejected", success: false })
        }

        const project = await Project.findById(invite.projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false })
        }

        const user = await User.findOne({ email: invite.email })
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }

        if (project.members.includes(user.id)) {
            return res.status(409).json({ message: "User already added to this project", success: false })
        }

        project.members.push(user.id)
        invite.status = "accepted"
        await project.save()
        await invite.save()

        return res.status(200).json({ message: "Invite accepted successfully", success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function rejectInvite(req, res) {
    const { token } = req.params

    if (!token) {
        return res.status(400).json({ message: "Invalid Token", success: false })
    }

    try {
        const invite = await Invite.findOne({ token })
        if (!invite) {
            return res.status(404).json({ message: "Invite not found", success: false })
        }

        if (invite.status === "rejected") {
            return res.status(409).json({ message: "Invite already rejected", success: false })
        }

        if (invite.status === "accepted") {
            return res.status(409).json({ message: "Invite already accepted", success: false })
        }

        invite.status = "rejected"
        await invite.save()

        return res.status(200).json({ message: "Invite rejected successfully", success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function getInvites(req, res) {
    try {
        const invites = await Invite.find({ projectId: req.params.projectId })
        return res.status(200).json({ invites, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}