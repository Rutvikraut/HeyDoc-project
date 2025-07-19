import { Router } from "express"
import { addDoctor, getAllDoctors, loginDocter, verifyEmail } from "../controllers/doctorController.js"
const router = Router()

router.get('/getAllDoctors',getAllDoctors)
router.post('/addDoctor',addDoctor)
router.get('/verifyDoctor/:token',verifyEmail)
router.post('/loginDoctor',loginDocter)




export default router