import mongoose  from "mongoose";


const serverMemberSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    server:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"servers"
    },
    role:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"roles"
    }]
})

const serverMemberModel = mongoose.model("ServerMember",serverMemberSchema)

export default serverMemberModel