import mongoose from "mongoose";


const roleSchema =  new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    server:{
       type:mongoose.Schema.Types.ObjectId,
        ref:"servers"
    },
    permissions:{
        type:[String],
        default:[]
    },
    position:{
        type:Number,
        default:0,
    },
    color:{
        type:String,
        default:"#dadada"
    }

},{
    timeStamps:true
})

const roleModel = mongoose.model("roles",roleSchema)

export default roleModel