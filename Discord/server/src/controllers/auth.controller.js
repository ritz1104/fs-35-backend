import sendFiles  from "../services/storage.service.js";
import userModel from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import redis from "../config/redis.config.js";
import { generateOtp } from "../utils/otp.js";
import bcrypt from 'bcrypt'
import sendEmail from "../services/email.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
export const registerUser = async (req,res,next)=>{
  try {
      const {username,email,password,dob,fullname,mobile_no}= req.body
      
    const file = req.file

  
    let uploadImage = null;

    if(file) {
        uploadImage = await sendFiles(file.buffer,file.originalname)
    }

    const user = await userModel.create({
        username,
        fullname,
        email,
        password,
        profile_pic:uploadImage?.url || "",
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
  } catch (error) {
    console.log(error.message)
    next(error.message)
  }
}

export const loginUser = async (req,res,next)=>{
   try {
     const {email,password} = req.body

    

    const user = await userModel.findOne({email}).select("+password")

    if(!user) throw new ApiError(404,"user not found")


    if(!user.password || user.authProvider==='google') return res.status(400).json({
        success:false,
        message:"continue with google"
    })

    const isPasswordCorrect = user.comparePass(password)

    if(!isPasswordCorrect) throw new ApiError(401,"invalid credential")

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
    return res.status(200).json(
        new ApiResponse(200,userData,"user login successfully")
    )
   } catch (error) {
    next(error)
   }    
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

    res.redirect('http://localhost:5173/')

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

      res.redirect('http://localhost:5173/')
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


export const forgetPassword = async (req,res)=>{
   try {
     const  {email} = req.body

    if(!email) return res.status(400).json({
        success:false,
        message:"email is required"
    })

    const user = await userModel.findOne({email})

    if(!user) return res.status(404).json({
        success:false,
         message:"user not found"
    })

    const otp = generateOtp()

  const hashedOtp =  bcrypt.hashSync(otp,10)

 await redis.set(`reset-password-hashedOtp-${email}`,hashedOtp,"EX",10*60)

 await sendEmail(
    user.email,
    "Reset Your Discord Password",
    `Reset your password using this otp: ${otp}`,
    `
                <div style="font-family: Arial, sans-serif;">
                <h2>Password Reset Request</h2>

                <p>Your OTP for resetting your password is:</p>

                <h1 style="letter-spacing: 5px;">
                    ${otp}
                </h1>

                <p>This OTP will expire in <strong>10 minutes</strong>.</p>

                <p>If you did not request a password reset, please ignore this email.</p>
            </div>

    `
);

return res.status(200).json({
    success:true,
    message:"email sent successfully"
})

   } catch (error) {
    return res.status(500).json({
        success:false,
        message:"ist",
        error:error.message
    })
   }
}


export const verifyOtp = async  (req,res)=>{
   const {email,otp}= req.body

   if(!otp) return res.status(400).json({
    success:false,
    message:"otp is required"
   })

   const hashedOtp = await redis.get(`reset-password-hashedOtp-${email}`)
   
   if(!hashedOtp) return res.status(404).json({
    success:false,
    message:"otp is expired or not found"
   })


  const isValid =  bcrypt.compareSync(otp,hashedOtp)


  if(!isValid)  return res.status(403).json({
    success:false,
    message:"invalid otp "
  })


  await redis.del(`reset-password-hashedOtp-${email}`)

  const resetToken = generateToken(email,"10min")

 const hashedResetToken = bcrypt.hashSync(resetToken,10)

 await redis.set(`reset-token-hashedResetToken-${email}`,hashedResetToken,"EX",10*60)

 return res.status(200).json({
    success:true,
    message:"otp verified successfully",
    resetToken
 })
}

export const resetPassword = async(req,res)=>{
    const {email,resetToken,newPassword} = req.body

    if(!email || !resetToken|| !newPassword) return res.status(400).json({
        success:false,
        message:"email,resetToken and newpassword is required"
    })

    const hashedResetToken = await redis.get(`reset-token-hashedResetToken-${email}`)

    if(!hashedResetToken) return res.status(400).json({
        success:false,
        message:"your session for reset password is expired pls try again"
    })

    const user = await userModel.findOne({email}).select("password")

    if(!user) return res.status(404).json({
        success:false,
        message:"user not found"
    })

    user.password = newPassword

    await user.save()

  
    await redis.del(`reset-token-hashedResetToken-${email}`)

    return res.status(200).json({
        success:true,
        message:"password reset successfully"
    })

}

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`Bearer:refreshToken:${refreshToken}`);

    if (isBlacklisted) {
        return res.status(401).json({
            success: false,
            message: "Refresh token has been revoked",
        });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    const accessToken = generateToken(user._id, "15m");

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        secure: false,
        sameSite: "strict",
    });

    return res.status(200).json({
        success: true,
        message: "Access token regenerated successfully",
    });
};