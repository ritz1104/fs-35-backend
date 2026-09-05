import roleModel from "../models/role.model.js";
import serverModel from "../models/server.model.js";
import serverMemberModel from "../models/serverMember.model.js";
import userModel from "../models/user.model.js";
import { createServerMember } from "../services/serverMember.service.js";
import sendFiles from "../services/storage.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateInviteCode } from "../utils/inviteCode.js";
import { generateOtp } from "../utils/otp.js";
import bcrypt from 'bcrypt'

export const createServer = async (req,res,next)=>{
    try {
        
        const {name,description,isPublic,} = req.body

        const icon = req.files?.icon
        const banner = req.files?.banner;

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


        const ownerRole = await roleModel.create({
            name: "Owner",
    server: server._id,
    permissions: [
        "MANAGE_SERVER",
        "MANAGE_CHANNELS",
        "MANAGE_ROLES",
        "MANAGE_MEMBERS",
        "MANAGE_MESSAGES"
    ],
    position: 100
        })
        
     const serverMember = await createServerMember(req.user.id,server._id,[ownerRole._id])
    
        
        return res.status(201).json(
            new ApiResponse(201,server,"server created succesfully")
        )
       
    } catch (error) {
        next(error)
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

        if (!user) throw new ApiError(404, "User not found");

        const alreadyExists = (user.server || []).some((serverId) =>
            serverId.toString() === server._id.toString()
        )

        if(alreadyExists) throw new ApiError(400,"you are already a member of this server")


            const memberRole = roleModel.findOne({
                server:server._id,
                name:"member"
            })

        await createServerMember(req.user.id,server._id,[memberRole._id])
      


        return res.status(200).json(
            new ApiResponse(200,server,"server joined successfully")
        )
    } catch (error) {
        next(error)
    }
}

