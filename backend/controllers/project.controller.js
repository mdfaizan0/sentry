import Project from "../models/Project.js";
import User from "../models/User.js";
import crypto from "crypto";
import Invite from "../models/Invite.js";
import { sendInviteEmail } from "../utils/email/sendInviteEmail.js";

export async function listProjects(req, res) {
    try {
        const projects = await Project.find({ owner: req.user.id })
        return res.status(200).json({ projects, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function getOneProject(req, res) {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ message: "Invalid Project ID", success: false })
    }
    try {
        const project = await Project.findById(id)
        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false })
        }
        return res.status(200).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function createProject(req, res) {
    const { title, description } = req.body

    if (!title || !description) {
        return res.status(400).json({ message: "Title and Description required.", success: false })
    }

    try {
        const project = await Project.create({ title, description, owner: req.user.id })
        return res.status(201).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function updateProject(req, res) {
    const { id } = req.params

    if (!title && !description) {
        return res.status(400).json({ message: "Nothing to update.", success: false })
    }

    try {
        const project = await Project.findByIdAndUpdate(id, { title, description }, { new: true })
        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false })
        }
        return res.status(200).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function deleteProject(req, res) {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ message: "Invalid Project ID", success: false })
    }

    try {
        const project = await Project.findByIdAndDelete(id)
        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false })
        }
        return res.status(200).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function addMember(req, res) {
    const { id } = req.params
    const { memberId } = req.body

    if (!id || !memberId) {
        return res.status(400).json({ message: "Invalid Project ID or Member ID", success: false })
    }

    try {
        const project = await Project.findById(id)

        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false })
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to add member to this project", success: false })
        }

        const member = await User.findById(memberId)
        if (!member) {
            return res.status(404).json({ message: "Member not found", success: false })
        }

        if (project.members.includes(memberId)) {
            return res.status(409).json({ message: "Member already added to this project", success: false })
        }

        project.members.push(memberId)
        await project.save().populate("members")
        return res.status(200).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function addMemberByInvite(req, res) {
    const { id } = req.params
    const { email, expiryHours } = req.body

    if (!id || !email) {
        return res.status(400).json({ message: "Invalid Project ID or Email", success: false })
    }

    if (!email.includes("@") && !email.match(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)) {
        return res.status(400).json({ message: "Invalid Email", success: false })
    }

    try {
        const project = await Project.findById(id).populate("owner")
        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false })
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to add member to this project", success: false })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }

        if (project.members.includes(user.id)) {
            return res.status(409).json({ message: "User already added to this project", success: false })
        }

        const existingInvite = await Invite.findOne({ email, projectId: project._id, status: "pending" })
        if (existingInvite) {
            return res.status(409).json({ message: "User already invited to this project", success: false })
        }

        const token = crypto.randomBytes(32).toString("hex")

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
    const { token } = req.query

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
    const { token } = req.query

    if (!token) {
        return res.status(400).json({ message: "Invalid Token", success: false })
    }

    try {
        const invite = await Invite.findOne({ token })
        if (!invite) {
            return res.status(404).json({ message: "Invite not found", success: false })
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
        const invites = await Invite.find({ projectId: req.params.id })
        return res.status(200).json({ invites, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function removeMember(req, res) {
    const { id: projectId } = req.params
    const { memberId } = req.body

    try {
        const project = await Project.findOne({ id: projectId })
        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false })
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to remove member from this project", success: false })
        }

        const memberIndex = project.members.indexOf(memberId)
        if (memberIndex === -1) {
            return res.status(404).json({ message: "Member not found in this project", success: false })
        }

        project.members.splice(memberIndex, 1)
        await project.save().populate("members")
        return res.status(200).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}