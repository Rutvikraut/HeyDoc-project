const successResponse = (res,message,status,data)=>{
    return res.status(status).json({
        success:true,
        message:message,
        data:data
    })
}

const errorResponse = (res,message,status,error)=>{
    return res.status(status).json({
        success:false,
        message:message,
        error:error
    })
}

export {successResponse,errorResponse}
