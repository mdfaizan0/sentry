import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { addMember, createProject, deleteProject, getOneProject, listProjects, removeMember, updateProject } from "../controllers/project.controller.js"
import { checkProjectAccess } from "../middlewares/project.middleware.js"

const router = express.Router()

router.get("/", protect, listProjects)
router.get("/:projectId", protect, checkProjectAccess, getOneProject)
router.post("/", protect, createProject)
router.put("/:projectId", protect, checkProjectAccess, updateProject)
router.delete("/:projectId", protect, checkProjectAccess, deleteProject)

router.post("/:projectId/add-member", protect, checkProjectAccess, addMember)
router.post("/:projectId/remove-member", protect, checkProjectAccess, removeMember)

export default router