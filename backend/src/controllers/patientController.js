import pool from "../db/configDb.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"

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

const verifyEmail = (req,res)=>{
    const {token}=req.params
    const sql = "select * from patients where verify_token = ?"
    pool.query(sql,[token],(error,data)=>{
        if(error)
            return errorResponse(res,"Something went wrong",500,error)

        if(data.length == 0)
            return errorResponse(res,"Token expired or Invalid Token",400,error)

        if(new Date(data[0]?.verify_token_expiry) > new Date()){
            const updateQuery = `update patients set is_verified=true,verify_token=null, verify_token_expiry=null where id = ?`
            pool.query(updateQuery,[data[0].id],(error,data)=>{
                if(error)
                    return errorResponse(res,"Something wen wrong",500,error)
                return successResponse(res,"Patient account verified",200,data)
            })
        }
        else
            return errorResponse(res,"Invalid Token",400,error)
    })
}

const loginPatient = async(req,res)=>{
    const {email,password} = req.body

    const sql = `select id,first_name,last_name,phone_number,email,date_of_birth,gender,password from patients where is_verified=1 and email=?`
    const insertTokenQuery = `update patients set auth_token=? where id=?`

    pool.query(sql,[email],async (error,data)=>{
        if(error)
            return errorResponse(res,"Internal Server Error",500,error)

        const validPassword = await bcrypt.compare(password,data[0].password)
        if(validPassword){
            const patient = data[0]
            const authToken = jwt.sign({
                patientId:patient.id
            },"c27d6d95317574e3b2f211a17cf3e9a1")

            
            pool.query(insertTokenQuery,[authToken,patient.id],(e,result)=>{
                if(e)
                    return errorResponse(res,"Something went wrong",500,e)
                
                res.cookie('authToken',authToken,{
                    httpOnly:true,
                    secure:true,
                })

                return successResponse(res,"Login success",200,{
                    token:authToken,
                    data
                })
            })
        }else{
            return errorResponse(res,"Invalid Password",404,error)
        }
    })
}

export {
    addPatient,
    verifyEmail,
    loginPatient
}