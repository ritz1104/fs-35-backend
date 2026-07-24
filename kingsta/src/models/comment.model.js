import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
     text:{
        type:String,
        required:[true,"text is required"]
     },
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
     },
     post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"posts"
     },
     likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
     }]   
},{timestamps:true}
)


const commentModel = mongoose.model("comments",commentSchema)

export default commentModel