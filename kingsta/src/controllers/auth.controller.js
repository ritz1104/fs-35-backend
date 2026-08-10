import UserModel from "../models/user.model.js";
import { sendEmail } from "../services/email.service.js";
import { sendFiles } from "../services/storage.service.js";
import { generateToken } from "../utils/token.js";
import jwt from "jsonwebtoken"
export const registerController = async (req, res) => {
  try {
    let { username, fullName, email, mobile, password, bio, dob } = req.body;
    let file = req.file;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadFile = await sendFiles(file.buffer, file.originalname);

    const newUser = await UserModel.create({
      username,
      fullName,
      email,
      password,
      bio,
      dob,
      mobile,
      profile_pic: uploadFile.url,
    });

    const accessToken = generateToken(newUser._id, "15min");
    const refreshToken = generateToken(newUser._id, "1d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error:error.message,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordCorrect = user.comparePass(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate Tokens
    const accessToken = generateToken(user._id, "1m");
    const refreshToken = generateToken(user._id, "7d");

    // (Optional but Recommended)
    // user.refreshToken = refreshToken;
    // await user.save();

    // Set Cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1 * 60 * 1000,
      secure: false, // true in production
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false, // true in production
      sameSite: "strict",
    });

    // Remove password before sending response
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const refreshToken = async (req,res)=>{
  const refreshToken = req.cookies.refreshToken
  if(!refreshToken) return res.status(401).json({
    success:false,
    message:"unauthorized"
  })

 const verifyRefreshToken = jwt.verify("refreshToken",process.env.JWT_SECRET)

 const user = await UserModel.findById(verifyRefreshToken.id)

 if(!user) return res.status(404).json({
  success:false,
  message:"user not found"
 })

const accessToken = generateToken(user._id,"1m")

res.cookie("accessToken",accessToken,{
  httpOnly:true,
  maxAge:1*60*1000,
  secure:false,
  sameSite:"strict"
})

 return res.status(200).json({
  success:true,
  message:"access token re-generated successfully"
 })
}

export const forgotPassword = async(req,res)=>{
try {
    console.log(req.body)
  const {email} = req.body

  if(!email) return res.status(400).json({
    success:false,
    message:"email is required"
  })

  const user = await UserModel.findOne({email})
  
  if(!user) return res.status(404).json({
    success:false,
    message:"user not found"
  })

  const resetToken = generateToken(user._id,"10m")

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`


  await sendEmail(
    user.email,
    "Reset Your Kingsta Password",
    `Reset your password using this link: ${resetUrl}`,
    `
        <h2>Reset Your Password</h2>
        <p>Click the button below to reset your password.</p>

        <a href="${resetUrl}">
            Reset Password
        </a>

        <p>This link expires in 10 minutes.</p>
    `
)

return res.status(200).json({
  success:true,
  message:"email sent successfully"
})
} catch (error) {
  return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
}

}

export const resetPassword = async (req,res)=>{

  const {token,newPassword} = req.body

  if(!token|| !newPassword) return res.status(400).json({
    success:false,
    message:"token and new password is required"
  })


  const decoded = jwt.verify('token',process.env.JWT_SECRET)


    if(!decoded) return res.status(401).json({
      success:false,
      message:"unauthorize"
    })

  const user = await UserModel.findById(decoded.id)

  if(!user) return res.status(404).json({
    success:false,
    message:"user not found"
  })

  user.password = newPassword
  
  await user.save()

 return res.status(200).json({
  success:true,
  message:"password updated successfully"
 })
}