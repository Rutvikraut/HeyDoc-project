import express from "express"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send("Server Up")
})

app.listen(4000,()=>{
    console.log("Server Running on Port 4000")
})