import { Router } from "express"
import {addPatient, loginPatient, verifyEmail} from "../controllers/patientController.js"
const router = Router()

router.post('/addPatient',addPatient)
router.get('/verifyPatient/:token',verifyEmail)
router.post('/loginPatient',loginPatient)


export default router