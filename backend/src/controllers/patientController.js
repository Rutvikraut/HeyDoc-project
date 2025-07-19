import pool from "../db/configDb.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { errorResponse, successResponse } from "../utils/resultUtil.js"

const addPatient = async(req,res)=>{
    const {
        first_name,
        last_name,
        phone_number,
        email,
        password,
        date_of_birth,
        gender
    } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt);
    const verifyToken = crypto.randomBytes(20).toString("hex")
    const verifyTokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 1000)

    const sql = `INSERT INTO patients(
        first_name,
        last_name,
        phone_number,
        email,
        password,
        date_of_birth,
        gender,
        verify_token,
        verify_token_expiry) VALUES(?,?,?,?,?,?,?,?,?)`
    pool.query(sql,[first_name, last_name, phone_number, email, hashedPassword, date_of_birth,gender,verifyToken,verifyTokenExpiry],(error,data)=>{
        console.log(data)
        if(error!=null)
            return errorResponse(res,"Something went wrong",500,error)
        else
            return successResponse(res,"Patient account created",201,data)
    })
}

export {
    addPatient
}