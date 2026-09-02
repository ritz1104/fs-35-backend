import serverModel from "../models/server.model.js";
import userModel from "../models/user.model.js";
import sendFiles from "../services/storage.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateInviteCode } from "../utils/inviteCode.js";
import { generateOtp } from "../utils/otp.js";
import bcrypt from 'bcrypt'

export const createServer = async (req,res,next)=>{
    try {
        
        const {name,description,isPublic,} = req.body

        const icon = req.files.icon
        const banner = req.files.banner;

        let uploadIcon = null;
        if(icon){
          uploadIcon = await  sendFiles(icon[0].buffer,icon[0].originalname)
        }

        let uploadBanner = null;
        if(banner){
          uploadBanner = await  sendFiles(banner[0].buffer,banner[0].originalname)
        }

        const inviteCode = generateInviteCode()

        console.log(inviteCode)
      

        const server = await serverModel.create({
            name,
            description,
            owner:req.user.id,
            icon:uploadIcon?.url || "",
            banner:uploadBanner?.url || "",
            isPublic,
            inviteCode
        })

        return res.status(201).json(
            new ApiResponse(201,server,"server created succesfully")
        )
       
    } catch (error) {
        console.log(error.message)
    }
}



export const joinServer = async(req,res,next)=>{
    try {
        
        const {inviteCode} = req.params

        const server = await serverModel.findOne({inviteCode})

        if(!server) {
            throw new ApiError(404,"invalid invite code")
        }

        const user = await userModel.findById(req.user.id)

        const alreadyExists = user.server.some((serverId)=>{
            user.server.serverId.toString() === server._id.toString()
        })

        if(alreadyExists) throw new ApiError(400,"you are already a member of this server")


        user.server.push(server._id)
        
        await user.save()


        return res.status(200).json(
            new ApiResponse(200,server,"server joined successfully")
        )
    } catch (error) {
        next(error.message)
    }
}