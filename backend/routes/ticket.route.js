import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { assignTicket, createTicket, deleteTicket, getOneTicket, listTicketsByProject, updateTicket } from "../controllers/ticket.controller.js"
import { checkProjectAccess } from "../middlewares/project.middleware.js"

const router = express.Router()

router.use(protect)

router.post("/:projectId", checkProjectAccess, createTicket)
router.get("/:projectId", checkProjectAccess, listTicketsByProject)
router.get("/:projectId/:ticketId", checkProjectAccess, getOneTicket)
router.patch("/:projectId/:ticketId", checkProjectAccess, updateTicket)
router.delete("/:projectId/:ticketId", checkProjectAccess, deleteTicket)

router.patch("/:projectId/:ticketId/assign", checkProjectAccess, assignTicket)

export default router