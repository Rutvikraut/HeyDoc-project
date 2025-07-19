import express from "express"
import cors from "cors"
import patientRoutes from "./src/routes/patientRoutes.js"
import specializationRoutes from "./src/routes/specializationRoutes.js"
import doctorRoutes from "./src/routes/doctorRoutes.js"



const app = express()
app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send("Server Up")
})

app.use("/api",patientRoutes)
app.use("/api",specializationRoutes)
app.use("/api",doctorRoutes)



app.listen(4000,()=>{
    console.log("Server Running on Port 4000")
})