import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { acceptInvite, addMember, addMemberByInvite, createProject, deleteProject, getInvites, getOneProject, listProjects, rejectInvite, removeMember, updateProject } from "../controllers/project.controller.js"
import { checkProjectAccess } from "../middlewares/project.middleware.js"

const router = express.Router()

router.use(protect)

router.get("/", listProjects)
router.get("/:projectId", checkProjectAccess, getOneProject)
router.post("/", createProject)
router.put("/:projectId", checkProjectAccess, updateProject)
router.delete("/:projectId", checkProjectAccess, deleteProject)

router.post("/:projectId/add-member", checkProjectAccess, addMember)
router.post("/:projectId/invite-member", checkProjectAccess, addMemberByInvite)
router.post("/:projectId/remove-member", checkProjectAccess, removeMember)

router.get("/invite/accept", acceptInvite)
router.get("/invite/reject", rejectInvite)
router.get("/invites/all/:projectId", checkProjectAccess, getInvites)

export default router