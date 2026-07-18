import { response } from "express";
import UserModel from "../models/user.model.js";

export const getMe = async(req,res)=>{
   try {
    const user = await UserModel.findById(req.user.id).select('-password')

   if(!user) return res.status(404).json({
    success:false,
    message:"user not found"
   })

   return res.status(200).json({
    success:true,
    message:"user found successfully",
    user
   })
   } catch (error) {
     return res.status(500).json({
        success:false,
        message:"internal server error"
     })
   }

}

export const updateProfile= async (req,res)=>{
 const {username,fullName,mobile,dob,bio} = req.body

 const updateData = {}
 if(username) updateData.username = username
 if(fullName) updateData.fullName = fullName
 if(mobile) updateData.mobile = mobile
 if(dob) updateData.dob = dob
 if(bio) updateData.bio = bio

 const updatedUser = await UserModel.findByIdAndUpdate(req.user.id,updateData,{
    new:true
 })

 if(!updatedUser) return res.status(400).json({
    success:false,
    message:"user not found"
 })

 return res.status(200).json({
    success:true,
    message:"user profile updated successfully",
    updatedUser
 })

}


 export const getUserProfile = async (req,res) =>{
    try {
        const {username} = req.params

    const user = await UserModel.findOne({username}).select("-password")
    if(!user) return res.status(400).json({
        success:false,
        message:"user not found"
    })

    return res.status(200).json({
        success:true,
        message:"user found successfully",
        user
    })
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:"internal server error",
            error:error.message
         })
    }
}

export const searchUser = async (req,res)=>{
  const {query} = req.query
  //  query=rit
  if(!query) return res.status(400).json({
    success:false,
    message:"search query required"
  })
  const user = await UserModel.find({
    $or:[
        {username:{ "$regex":query,"$options":"i"}},
        {fullName:{"$regex":query,"$options":"i"}}
    ]
  }).select("username fullName profile_pic")

  if(user.length==0) return res.status(404).json({
    success:false,
    message:"user not found"
  })

  return res.status(200).json({
    success:true,
    message:"user fetched successfully",
    user
  })
}


export const followUser  = async(req,res)=>{
  const targetUserId = req.params.id

  if(targetUserId === req.user.id) return res.status(400).json({
    success:false,
    message:"you cannot follow yourself"
  })

  const loggedInUser = await UserModel.findById(req.user.id)
  const targetUser = await UserModel.findById(targetUserId)

  if(!targetUser) return res.status(404).json({
    success:false,
    message:"user not found"
  })

  const alreadyExist = loggedInUser.followings.includes(targetUserId)

  if(alreadyExist) return res.status(400).json({
    success:false,
    message:"you alredy follow this user"
  })

  loggedInUser.followings.push(targetUserId)
  targetUser.followers.push(req.user.id)

  loggedInUser.save()
  targetUser.save()

  return res.status(200).json({
    success:true,
    message:"user followed successfully",
    loggedInUser,
    targetUser
  })
}