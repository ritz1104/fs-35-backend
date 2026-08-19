import sendFiles  from "../services/storage.service.js";
import userModel from "../models/user.model.js";
import { generateToken } from "../utils/token.js";

export const registerUser = async (req,res)=>{
    const {username,email,password,dob,fullname,mobile_no}= req.body
    const file = req.file

    if(!username || !email || !fullname) return res.status(400).json({
        success:false,
        message:"field are required"
    })

    const uploadImage;

    if(file) {
        uploadImage = await sendFiles(file.buffer,file.originalname)
    }

    const user = await userModel.create({
        username,
        fullname,
        email,
        password,
        profile_pic:uploadImage.url,
        mobile_no,
        dob
    })


    const accessToken = generateToken(user._id,"15min")
    const refreshToken = generateToken(user._id,"2d")


    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        maxAge:15*60*1000,
        secure:false,
        sameSite:"strict"
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge:2*24*60*60*1000,
        secure:false,
        sameSite:"strict"
    })


    const userData = user.toObject()

    delete userData.password

    return res.status(201).json({
        success:true,
        message:"user register successfully",
        user:userData
    })
}