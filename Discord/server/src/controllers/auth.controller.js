import sendFiles  from "../services/storage.service.js";
import userModel from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import redis from "../config/redis.config.js";
export const registerUser = async (req,res)=>{
    const {username,email,password,dob,fullname,mobile_no}= req.body
    const file = req.file

    if(!username || !email || !fullname) return res.status(400).json({
        success:false,
        message:"field are required"
    })

    let uploadImage = null;

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


   

    return res.status(201).json({
        success:true,
        message:"user register successfully",
        user
    })
}

export const loginUser = async (req,res)=>{
    const {email,password} = req.body

    if(!email || !password) return res.status(400).json({
        success:false,
        message:"email and password are required"
    })

    const user = await userModel.findOne({email}).select("password")

    if(!user) return res.status(404).json({
        success:false,
        message:"user not found"
    })


    if(!user.password || user.authProvider==='google') return res.status(400).json({
        success:false,
        message:"continue with google"
    })

    const isPasswordCorrect = comparePass(password)

    if(!isPasswordCorrect) return res.status(401).json({
        success:false,
        message:"Invalid credential"
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


    let userData = user.toObject()

    delete userData.password
    return res.status(200).json({
        success:true,
        message:"user login successfully",
        user:userData
    })
    

}

export const googleAuth = async (req,res)=>{
   const {email,name,given_name,picture,sub} =req.user._json
  console.log(req.user)
   const user = await userModel.findOne({email})

   if(user){
    if(!user.googleId){
        user.googleId = sub
        await user.save()
    }

    const accessToken = generateToken(user._id,"15min")
    const refreshToken = generateToken(user._id,"2d")


    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        maxAge:15*60*1000
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge:2*24*60*60*1000
    })

    return res.status(200).json({
        success:true,
        message:"user loggedin successfully",
        user
    })

   }

   const newUser = await userModel.create({
    username:given_name,
    fullname:name,
    email,
    profile_pic:picture,
    googleId:sub,
    authProvider:req.user.provider
   })


   
    const accessToken = generateToken(newUser._id,"15min")
    const refreshToken = generateToken(newUser._id,"2d")


    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        maxAge:15*60*1000
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge:2*24*60*60*1000
    })

    return res.status(201).json({
        success:true,
        message:"user register successfully",
        newUser
    })

}

export const logoutUser = async (req,res)=>{


    //befor using redis three credential is required
    // ->host,port and password

    const {refreshToken,accessToken} = req.cookies

   if(accessToken){
    await redis.set(`Bearer:accessToken:${accessToken}`,"true")
   }
   if(refreshToken){
    await redis.set(`Bearer:refreshToken:${refreshToken}`,"true")
   }


    res.clearCookie("refreshToken")
    res.clearCookie("accessToken")

    return res.status(200).json({
        success:true,
        message:"user logout successfully"
    })
}