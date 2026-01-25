import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { assignTicket, createTicket, deleteTicket, getOneTicket, listTicketsByProject, updateTicket } from "../controllers/ticket.controller.js"

const router = express.Router()

router.use(protect)

router.post("/:projectId", createTicket)
router.get("/:projectId", listTicketsByProject)
router.get("/:projectId/:ticketId", getOneTicket)
router.patch("/:projectId/:ticketId", updateTicket)
router.delete("/:projectId/:ticketId", deleteTicket)

router.patch("/:projectId/:ticketId/assign", assignTicket)

export default router