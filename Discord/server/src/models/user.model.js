import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        select:false
    },
    dob:{
        type:Date,
    },
    mobile_no:{
        type:Number,
        unique:true,
        sparse:true
    },
    profile_pic:{
        type:String,
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true,
    },
    authProvider:{
        type:String,
        enum:["local","google"],
        default:"local"
    },
   

 friends:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"users"
    }],

},{timestamps:true})


userSchema.pre("save",function(){

    if(!this.password || !this.isModified("password")) return

    return this.password = bcrypt.hashSync(this.password,10)

})

userSchema.methods.comparePass =  function(password){

    return bcrypt.compareSync(password,this.password)
}

const userModel = mongoose.model("users",userSchema)


export default userModel