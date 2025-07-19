import { Router } from "express"
import { getAllSpecializations } from "../controllers/specializationController.js"
const router = Router()

router.get('/getAllSpecializations',getAllSpecializations)

export default router