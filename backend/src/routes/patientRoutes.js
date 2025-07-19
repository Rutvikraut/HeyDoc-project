import { Router } from "express"
import {addPatient} from "../controllers/patientController.js"
const router = Router()

router.post('/addPatient',addPatient)

export default router