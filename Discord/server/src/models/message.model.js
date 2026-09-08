import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema({
    content:{
        type:String,
        trim:true,
    },
    channel_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"channels",
        required:true,
    },
    author_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    attachments:[
        {
            url:{
            type:String,
            required:true
        },
        type:{
            type:String,
            enum:["image","video","file"]
        }
        }
    ]
},{
    timestamps:true
})


const messageModel = mongoose.model("messages",messageSchema)

export default messageModel