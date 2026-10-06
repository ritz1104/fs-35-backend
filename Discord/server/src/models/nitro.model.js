import mongoose from "mongoose";


const nitroSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    plan:{
        type:String,
        enum:["nitro"],
        default:"nitro"
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
       type:Date,
        required:true  
    },
    status:{
        type:String,
        enum:["active","expired","cancelled"],
        default:"active"
    },
    razorpayOrderId:{
        type:String,
        required:true
    },
    razorpayPaymentId:{
        type:String,
        required:true,
        unique:true
    }

},{
    timestamps:true
})


const nitroModel = mongoose.model("nitros",nitroSchema)


export default nitroModel