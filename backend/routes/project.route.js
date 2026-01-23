import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { acceptInvite, addMember, addMemberByInvite, createProject, deleteProject, getOneProject, listProjects, rejectInvite, removeMember, updateProject } from "../controllers/project.controller.js"

const router = express.Router()

router.get("/", protect, listProjects)
router.get("/:id", protect, getOneProject)
router.post("/", protect, createProject)
router.put("/:id", protect, updateProject)
router.delete("/:id", protect, deleteProject)

router.post("/:id/add-member", protect, addMember)
router.post("/:id/invite-member", protect, addMemberByInvite)
router.post("/:id/remove-member", protect, removeMember)

router.get("/invite/accept", acceptInvite)
router.get("/invite/reject", rejectInvite)

export default router