import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { checkProjectAccess } from "../middlewares/project.middleware.js"
import { acceptInvite, addMemberByInvite, getInvites, rejectInvite } from "../controllers/invite.controller.js"

const router = express.Router()

router.post("/add/:projectId", protect, checkProjectAccess, addMemberByInvite)
router.get("/all/:projectId", protect, checkProjectAccess, getInvites)

router.patch("/accept/:token", acceptInvite)
router.patch("/reject/:token", rejectInvite)

export default router