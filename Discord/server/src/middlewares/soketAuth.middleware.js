import jwt from "jsonwebtoken"
import redis from "../config/redis.config.js"
import ApiError from "../utils/ApiError.js"
import userModel from "../models/user.model.js"

export const socketAuthMiddleware = async (socket,next)=>{

try {
    
    const cookies = socket.handshake.headers.cookie

    if(!cookies) {throw new ApiError(401,"authentication  is required")}

    const accessToken = cookies.split(";").find((cookie)=>cookie.startsWith("accessToken="))?.split("=")[1]


    if(!accessToken) {
        throw  new ApiError(401,"unauhtorized")
    }

    const isBlackListed = await redis.get(`Bearer:accessToken:${accessToken}`)

    if(isBlackListed) {
        throw new ApiError(403,"token is invalid")


    }

    const decoded = jwt.verify(accessToken,process.env.JWT_SECRET_KEY)

    console.log(decoded)

    const user = await userModel.findById(decoded.id)

    if(!user){
        throw new ApiError(404,"user not found")
    }

    socket.user = user

    next()
} catch (error) {
    next(error)
}
}