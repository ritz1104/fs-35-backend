import commentModel from "../models/comment.model.js";
import PostModel from "../models/post.model.js";

export const createComments = async (req,res)=>{
    try {
        const {postId,text} = req.body

    if(!postId || !text) return res.status(400).json({
        success:false,
        message:"both field are required"
    })

    const post = await PostModel.findById(postId)

    if(!post) return res.status(404).json({
        success:false,
        message:"post not found"
    })

    const comment = await commentModel.create({
        text,
        post:postId,
        user:req.user.id
    })

    post.comments.push(comment._id)

   await post.save()

   return res.status(200).json({
    success:true,
    message:"comment created successfully"
   })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"internal server error",
            error:error.message
        })
    }
}

export const getComments = async (req,res)=>{
    const postId =  req.params.id

    if(!postId) return res.status(400).json({
        success:false,
        message:"invalid post id"
    })

    const post = await PostModel.findById(postId).populate({
        path:"comments",
        populate:{
            path:"user",
            select:"username profile_pic"
        } 
    })


    if(!post) return res.status(404).json   ({
        success:false,
        message:"post not found",
    })
    
    return res.status(200).json({
        success:true,
        message:"comments fetched successfully",
        comments:post.comments      
    })
}



export const updateComment = async (req,res)=>{

    const commentId = req.params.id

    const {updatedText} = req.body

    if(!commentId || !updatedText) return res.status(400).json({
        success:false,
        message:"comment id and text is required"
    })



   const comment = await commentModel.findById(commentId)

    if(!comment) return res.status(404).json({
        success:false,
        message:"comment not found"
    })

   if(!(String(comment.user)===req.user.id)) return res.status(403).json({
    success:false,
    message:"forbidden"
   })

   

   comment.text = updatedText

   await comment.save()

    return res.status(200).json({
        success:true,
        message:"comment updated successfully",
        comment

    })

}   

export const deleteComment = async (req,res)=>{
    try {
        const commentId = req.params.id

    if(!commentId) return res.status(400).json({
        success:false,
        message:"comment id required"
    })

    const comment = await commentModel.findById(commentId)

  if(!comment) return res.status(404).json({
        success:false,
        message:"comment not found"
    })

    if(!(String(comment.user)=== req.user.id)) return res.status(403).json({
        success:false,
        message:"forbidden"
    })

    const post = await PostModel.findById(comment.post)

    post.comments.pull(commentId)

  

    await commentModel.findByIdAndDelete(commentId)

    await post.save()
    
    return res.status(200).json({
        success:true,
        message:"comment delted successfully",
        comment:post.comments

    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"internal server error",
            error:error.message
    })
}
}

export const likeComment = async (req,res)=>{
    const commentId = req.params.id
    if(!commentId) return res.status(400).json({
        success:false,
        message:"comment id is required"
    })

    const comment = await commentModel.findById(commentId)

    if(!comment) return res.status(404).json({
        success:false,
        message:"comment not found"
    })

    const alreadyExist = comment.likes.includes(req.user.id)

    if(alreadyExist) return res.status(400).json({
        success:false,
        message:"you alredy like the comment"
    })

    comment.likes.push(req.user.id)

    await comment.save()
    return res.status(200).json({
        success:true,
        message:"comment liked successfully",
        likes:comment.likes,
        count:comment.likes.length
    })
}