import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export const generateToken = (id,time)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn:time
    })
}
