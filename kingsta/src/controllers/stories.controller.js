import { create } from "axios";
import storyModel from "../models/story.model.js";
import { sendFiles } from "../services/storage.service.js";
import UserModel from "../models/user.model.js";


export const createStories = async (req,res)=>{
    const {caption} = req.body
    const file = req.file

    console.log(file)
    if(!file) return res.status(400).json({
        success:false,
        message:"file is required"
    })


    let media_Type;

    if(file.mimetype.startsWith("image")){
        media_Type = "image"
    }else if(file.mimetype.startsWith("video")){
        media_Type = "video"
    }else{
        return res.status(400).json({
            success:false,
            message:"invalid media type"
        })
    }


    const uploadFile = await sendFiles(file.buffer,file.originalname)

    const story = await storyModel.create({
        user:req.user.id,
        media_type:media_Type,
        media_url:uploadFile.url,
        caption
    })


    return res.status(201).json({
        success:true,
        message:"story created succesfully",
        story
    })
  
} 


export const getStories = async (req,res)=>{
    const user = await UserModel.findById(req.user.id)

    const fetchUser = [...user.followings,req.user.id] 

    const story = await storyModel.find({
        user:{$in:fetchUser}
    }).sort({createdAt:-1}).populate("user","username profile_pic")

    return res.status(200).json({
        success:true,
        message:"stories fetched successfully",
        story
    })
}

export const viewStories = async(req,res)=>{
        const storyId = req.params.id
        const story = await storyModel.findById(storyId)

        if(!story) return res.status(404).json({
            success:false,
            message:"story not found"
        })

        if(String(story.user)===req.user.id) return res.status(200).json({
            success:true,
            message:"you are watching your own story",
            story
        })


        const alreadyExist = story.viewers.includes(req.user.id)

        if(alreadyExist) return res.status(200).json({
            success:true,
            message:"you already view this story",
            story
        })

        story.viewers.push(req.user.id)


        await story.save()

        return res.status(200).json({
            success:true,
            message:"story viewed successfully",
            viewers:story.viewers,
            count:story.viewers.length
        })
}


export const deleteStory = async(req,res)=>{
    const storyId = req.params.id

    const story = await storyModel.findById(storyId)
   
    if(!story) return res.status(404).json({
        success:false,
        message:"story not found"
    })

    if(String(story.user)!== req.user.id) return res.status(403).json({
        success:false,
        message:"forbidden"
    })

    await story.deleteOne()

    return res.status(200).json({
        success:true,
        message:"story delted successfull"
    })
}
