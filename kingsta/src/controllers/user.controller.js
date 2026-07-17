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