import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { assignTicket, changeAssignee, createTicket, deleteTicket, getOneTicket, listTicketsByProject, unassignTicket, updateTicket } from "../controllers/ticket.controller.js"
import { checkProjectAccess } from "../middlewares/project.middleware.js"

const router = express.Router()

router.use(protect)

router.post("/:projectId", checkProjectAccess, createTicket)
router.get("/:projectId", checkProjectAccess, listTicketsByProject)
router.get("/:projectId/:ticketId", checkProjectAccess, getOneTicket)
router.patch("/:projectId/:ticketId", checkProjectAccess, updateTicket)
router.delete("/:projectId/:ticketId", checkProjectAccess, deleteTicket)

router.patch("/:projectId/:ticketId/assign", checkProjectAccess, assignTicket)
router.patch("/:projectId/:ticketId/unassign", checkProjectAccess, unassignTicket)
router.patch("/:projectId/:ticketId/change-assignee", checkProjectAccess, changeAssignee)

export default router