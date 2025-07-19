import { Router } from "express"
import {addPatient, verifyEmail} from "../controllers/patientController.js"
const router = Router()

router.post('/addPatient',addPatient)
router.get('/verifyPatient/:token',verifyEmail)

export default router