import mongoose from "mongoose";


const storySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    caption:{
        type:String,
        trim:true
    },
    media_type:{
        enum:["image","video"],
        type:String,
        required:true
    },
    media_url:{
        type:String,
        required:true,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    }],
    viewers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    }],
    expiresAt:{
        type:Date,
        default:()=> new Date(Date.now()+24*60*60*1000),
        index:{
            expires:0
        }
}
},{timestamps:true})

const storyModel = mongoose.model("stories",storySchema)

export default storyModel