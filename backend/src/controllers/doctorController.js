import pool from "../db/configDb.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { errorResponse, successResponse } from "../utils/resultUtil.js"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

const addDoctor = async(req,res)=>{
    const {
        first_name,
        last_name,
        phone_number,
        email,
        password,
        date_of_birth,
        gender,
        specialization_id
    } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt);
    const verifyToken = crypto.randomBytes(20).toString("hex")
    const verifyTokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 1000)


    const sql = `INSERT INTO doctors(
        first_name,
        last_name,
        phone_number,
        email,
        password,
        date_of_birth,
        gender,
        specialization_id,
        verify_token,
        verify_token_expiry) VALUES(?,?,?,?,?,?,?,?,?,?)`
    pool.query(sql,[first_name, last_name, phone_number, email, hashedPassword, date_of_birth,gender,specialization_id,verifyToken,verifyTokenExpiry],(error,data)=>{
        console.log(data)
        if(error!=null)
            return errorResponse(res,"Something went wrong",500,error)
        else
            return successResponse(res,"Doctor account created",201,data)
    })
}

const verifyEmail = (req,res)=>{
    const {token}=req.params
    const sql = "select * from doctors where verify_token = ?"
    pool.query(sql,[token],(error,data)=>{
        if(error)
            return errorResponse(res,"Something went wrong",500,error)

        if(data.length == 0)
            return errorResponse(res,"Token expired or Invalid Token",400,error)

        if(new Date(data[0]?.verify_token_expiry) > new Date()){
            const updateQuery = `update doctors set is_verified=true,verify_token=null, verify_token_expiry=null where id = ?`
            pool.query(updateQuery,[data[0].id],(error,data)=>{
                if(error)
                    return errorResponse(res,"Something wen wrong",500,error)
                return successResponse(res,"Doctor account verified",200,data)
            })
        }
        else
            return errorResponse(res,"Invalid Token",400,error)
    })
}

const loginDocter = async(req,res)=>{
    const {email,password} = req.body

    const sql = `select d.id,d.first_name,d.last_name,d.phone_number,d.email,d.date_of_birth,d.gender,d.password,s.name as specialization from doctors d join specializations s on d.specialization_id=s.id where d.is_verified=1 and email=?`
    const insertTokenQuery = `update doctors set auth_token=? where id=?`

    pool.query(sql,[email],async (error,data)=>{
        if(error)
            return errorResponse(res,"Internal Server Error",500,error)

        const validPassword = await bcrypt.compare(password,data[0].password)
        if(validPassword){
            const doctor = data[0]
            const authToken = jwt.sign({
                doctorId:doctor.id
            },"c27d6d95317574e3b2f211a17cf3e9a1")

            
            pool.query(insertTokenQuery,[authToken,doctor.id],(e,result)=>{
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

const getAllDoctors = async(req,res)=>{
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const offset = (page-1)*10

    const countSql = `select count(*) as total from doctors where is_verified=1`
    const dataSql = `select d.id,d.first_name,d.last_name,d.phone_number,d.email,d.date_of_birth,d.gender,s.name as specialization from doctors d join specializations s on d.specialization_id=s.id where d.is_verified=1 order by d.id limit ? offset ?`
    pool.query(countSql,(countError,countResult)=>{
        if(countError)
            return errorResponse(res,"Internal Server Error",500,error)

        const count = countResult[0].total
        const totalPages = Math.ceil(count/limit)

        pool.query(dataSql,[limit,offset],(error,data)=>{
            if(error)
                return errorResponse(res,"Something went wrong",500,error)

            return successResponse(res,"Doctors fetched successfully",200,{
                totalPages:totalPages,
                currentPage:page,
                totalRecords:count,
                data:data
            })
        })
    })
}

export {
    addDoctor,
    verifyEmail,
    loginDocter,
    getAllDoctors,
}