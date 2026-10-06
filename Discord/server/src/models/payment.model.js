import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    orderId:{
        type:String,
        unique:true,
        required:true
    },
    paymentId:{
        type:String,
        unique:true,
        sparse:true
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
    type:String,
    default:"INR"    
    },
    status:{
        type:String,
        enum:["created","paid","failed"],
        default:"created"
    },
    product:{
        type:String,
        enum:["nitro"],
        required:true
    }

},{
    timestamps:true
})

const paymentModel = mongoose.model("payments",paymentSchema)

export default paymentModel