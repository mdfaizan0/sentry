import Project from "../models/Project.js";
import User from "../models/User.js";
import crypto from "crypto";
import Invite from "../models/Invite.js";
import { sendInviteEmail } from "../utils/email/sendInviteEmail.js";

export async function listProjects(req, res) {
    try {
        const projects = await Project.find({ $or: [{ owner: req.user.id }, { members: { $in: [req.user.id] } }] })

        return res.status(200).json({ projects, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function getOneProject(req, res) {
    const { projectId } = req.params

    if (!projectId) {
        return res.status(400).json({ message: "Invalid Project ID", success: false })
    }
    try {
        const project = await Project.findById(projectId).populate("owner").populate("members")
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
        const project = await Project.create({ title, description, owner: req.user.id, members: [req.user.id] })
        return res.status(201).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function updateProject(req, res) {
    const { projectId } = req.params
    const { title, description } = req.body

    if (!title && !description) {
        return res.status(400).json({ message: "Nothing to update.", success: false })
    }

    try {
        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false })
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this project", success: false })
        }

        project.title = title || project.title
        project.description = description || project.description

        await project.save()

        return res.status(200).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function deleteProject(req, res) {
    const { projectId } = req.params

    try {
        const project = await Project.findByIdAndDelete(projectId)

        return res.status(200).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function addMember(req, res) {
    const { memberId } = req.body
    const project = req.project

    if (!memberId) {
        return res.status(400).json({ message: "Member ID required.", success: false })
    }

    try {
        const member = await User.findById(memberId)
        if (!member) {
            return res.status(404).json({ message: "Member not found", success: false })
        }

        if (project.members.includes(memberId)) {
            return res.status(409).json({ message: "Member already added to this project", success: false })
        }

        project.members.push(memberId)
        await project.save()
        await project.populate("members")
        return res.status(200).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export async function removeMember(req, res) {
    const project = req.project
    const { memberId } = req.body

    try {
        const memberIndex = project.members.indexOf(memberId)
        if (memberIndex === -1) {
            return res.status(404).json({ message: "Member not found in this project", success: false })
        }

        project.members.splice(memberIndex, 1)
        await project.save()
        await project.populate("members")
        return res.status(200).json({ project, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}