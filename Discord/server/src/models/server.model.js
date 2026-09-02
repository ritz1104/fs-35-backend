import mongoose from 'mongoose'

const serverSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type : String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
       
    },
    icon:{
        type:String,
        default:""
    },
    banner:{
        type:String,
        default:""
    },
    isPublic:{
        type:Boolean,
        default:false
    },
    inviteCode:{
        type:String,
        required:true
    }

},{
    timestamps:true
})

const serverModel = mongoose.model("servers",serverSchema)

export default serverModel