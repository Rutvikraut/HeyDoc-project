import pool from "../db/configDb.js"
import { errorResponse, successResponse } from "../utils/resultUtil.js"

const getAllSpecializations = async(req,res)=>{

    const sql = `select * from specializations order by 1`
    pool.query(sql,(error,data)=>{
        if(error)
            return errorResponse(res,"Something went wrong",500,error)

        return successResponse(res,"Specialization fetched successfully",200,data)
    })
}

export {
    getAllSpecializations
}