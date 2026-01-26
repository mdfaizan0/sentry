import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { checkProjectAccess } from "../middlewares/project.middleware.js"
import { addComment, getComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.use(protect)

router.post("/:ticketId", checkProjectAccess, addComment);
router.get("/:ticketId", checkProjectAccess, getComments);

export default router;