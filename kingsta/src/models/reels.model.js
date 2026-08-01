import mongoose from "mongoose";

const reelsScema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    media_url:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        trim:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comments"
    }],
    viwers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }]


},{timestamps:true})

const reelsModel = mongoose.model("reels",reelsScema)

export default reelsModel