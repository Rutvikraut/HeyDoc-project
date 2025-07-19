import { Router } from "express"
import { getAllDoctors } from "../controllers/doctorController.js"
const router = Router()

router.get('/getAllDoctors',getAllDoctors)

export default router