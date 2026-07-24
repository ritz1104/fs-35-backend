import { response } from "express";
import UserModel from "../models/user.model.js";
import { sendFiles } from "../services/storage.service.js";

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

  console.log(query)
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


export const followUser = async (req,res)=>{

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
    success :false,
    message:"you  alredy follow this user"
  })

  loggedInUser.followings.push(targetUserId)
  targetUser.followers.push(req.user.id)

  await loggedInUser.save()
   await targetUser.save()

  return res.status(200).json({
    success:true,
    message:"user followed successfully",
    targetUser,
    loggedInUser

  })
}


export const unfollowUser = async (req,res)=>{

  const targetUserId = req.params.id

  if(req.user.id === targetUserId) return res.status(400).json({
    success:false,
    message:"you cannot unfollow youself"
  })

  const loggedInUser = await UserModel.findById(req.user.id)
  const targetUser = await UserModel.findById(targetUserId)

  if(!targetUser) return res.status(404).json({
    success:false,
    message:"user not found"
  })

  const alreadyExist = loggedInUser.followings.includes(targetUserId)

  if(!alreadyExist) return res.status(400).json({
    success:false,
    message:"you did not follow this user"
  })

  loggedInUser.followings.pull(targetUserId)
  targetUser.followers.pull(req.user.id)

  loggedInUser.save()
  targetUser.save()

  return res.status(200).json({
    success:true,
    message:"user unfollowed successfully",
    loggedInUser,
    targetUser
  })

}





export const getFollowers = async (req,res)=>{
  const targetUserId = req.params.id

  if(!targetUserId) return res.status(400).json({
    success:false,
    message:"id is required"
  })

  const user = await UserModel.findById(targetUserId).populate("followers","username fullName profile_pic")

  if(!user) return res.status(404).json({
    success:false,
    message:"user not found"
  })

  return res.status(200).json({
    success:true,
    message:"followers fetched successfully",
    followers:user.followers,
    count:user.followers.length
  })
}


export const changePassword = async(req,res)=>{
  const {password,newPassword} = req.body

  if(!password || !newPassword) return res.status(400).json({
    success:false,
    message:"both fields are required"
  })

  if(password === newPassword) return res.status(409).json({
    success:false,
    message:"enter different password"
  })

  const user = await UserModel.findById(req.user.id)

  if(!user) return res.status(404).json({
    success:false,
    message:"user details not found"
  })

  const isPassworMatched = user.comparePass(password)

  if(!isPassworMatched) return res.status(400).json({
    success:false,
    message:"incorrect password"
  })

  user.password = newPassword

  await user.save()

  return res.status(200).json({
    success:true,
    message:"password changed successfully"
  })

}


export const updateProfilePicture = async (req,res)=>{
  const file = req.file
  console.log(file)
  if(!file) return res.status(400).json({
    success:false,
    message:"file is required"
  })

  const user = await UserModel.findById(req.user.id)

  if(!user) return res.status(404).json({
    success:false,
    message:"user not found"
  })

 
const uploadFile = await sendFiles(file.buffer,file.originalname)

user.profile_pic = uploadFile.url

await user.save()

return res.status(200).json({
  success:true,
  message:"profile pic updated successfully",
  user

})
}