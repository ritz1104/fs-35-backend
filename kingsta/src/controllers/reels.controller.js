//create reels
//get reels
//like reels
//unlike reels
//comment reels
// get single reel
//delete reels
//view reels

import { comment } from "postcss";
import reelsModel from "../models/reels.model.js";
import commentModel from "../models/comment.model.js";


const commentReel = async (req,res)=>{
    const reelId = req.params.id
    const {text} = req.body

    const reel = await reelsModel.findById(reelId),

    if(!reel) return res.status(400).json({
        success:false,
        message:"reel not found"
    })

    const comment = await commentModel.create({
        reel:reelId,
        text,
        user:req.user.id
    })

    reel.comments.push(comment._id)

    await reel.save()

    return res.status(200).json({
        success:true,
        message:"comment added succesfully",
    })
}

