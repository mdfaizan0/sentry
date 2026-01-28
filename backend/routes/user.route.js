import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { searchUsers } from "../controllers/user.controller.js"

const router = express.Router()

router.use(protect)

router.get("/search", searchUsers)

export default router
