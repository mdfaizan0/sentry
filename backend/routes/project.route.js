import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { acceptInvite, addMember, addMemberByInvite, createProject, deleteProject, getInvites, getOneProject, listProjects, rejectInvite, removeMember, updateProject } from "../controllers/project.controller.js"
import { checkProjectAccess } from "../middlewares/project.middleware.js"

const router = express.Router()

router.get("/", protect, listProjects)
router.get("/:projectId", protect, checkProjectAccess, getOneProject)
router.post("/", protect, createProject)
router.put("/:projectId", protect, checkProjectAccess, updateProject)
router.delete("/:projectId", protect, checkProjectAccess, deleteProject)

router.post("/:projectId/add-member", protect, checkProjectAccess, addMember)
router.post("/:projectId/invite-member", protect, checkProjectAccess, addMemberByInvite)
router.post("/:projectId/remove-member", protect, checkProjectAccess, removeMember)


router.get("/invites/all/:projectId", protect, checkProjectAccess, getInvites)

router.get("/invite/accept", acceptInvite)
router.get("/invite/reject", rejectInvite)

export default router