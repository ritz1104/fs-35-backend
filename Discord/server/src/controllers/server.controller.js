import channelModel from "../models/channel.model.js";
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
        
        
        const memberRole = await roleModel.create({
            name: "member",
            server: server._id,
            permissions: [],
            position: 10
        })

        const defaultChannels = await channelModel.create([
            {
                name:"#general-chat",
                server:server._id,
                position:1
            },
            {
                name:"announcement",
                server:server._id,
                position:2,
                type:"voice"
            }
        ])
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

        const alreadyExists = await serverMemberModel.exists({ user: req.user._id, server: server._id })

        if(alreadyExists) throw new ApiError(400,"you are already a member of this server")


            const memberRole = await roleModel.findOne({
                server:server._id,
                name:"member"
            })

            console.log(memberRole,server,req.user.id)

        await createServerMember(req.user.id,server._id,[memberRole._id])
      


        return res.status(200).json(
            new ApiResponse(200,server,"server joined successfully")
        )
    } catch (error) {
        next(error)
    }
}

export const getServers = async (req, res, next) => {
    try {
        const memberships = await serverMemberModel.find({ user: req.user._id }).select("server")
        const servers = await serverModel.find({ _id: { $in: memberships.map((member) => member.server) } })
        return res.status(200).json(new ApiResponse(200, servers, "Servers fetched successfully"))
    } catch (error) { next(error) }
}

export const getServer = async (req, res, next) => {
    try {
        const server = await serverModel.findById(req.params.serverId)
        if (!server) throw new ApiError(404, "Server not found")
        const member = await serverMemberModel.exists({ server: server._id, user: req.user._id })
        if (!member) throw new ApiError(403, "You are not a member of this server")
        return res.status(200).json(new ApiResponse(200, server, "Server fetched successfully"))
    } catch (error) { next(error) }
}

export const updateServer = async (req, res, next) => {
    try {
        const server = await serverModel.findById(req.params.serverId)
        if (!server) throw new ApiError(404, "Server not found")
        if (server.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Only server owner can update this server")
        const updated = await serverModel.findByIdAndUpdate(server._id, req.body, { new: true, runValidators: true })
        return res.status(200).json(new ApiResponse(200, updated, "Server updated successfully"))
    } catch (error) { next(error) }
}

export const deleteServer = async (req, res, next) => {
    try {
        const server = await serverModel.findById(req.params.serverId)
        if (!server) throw new ApiError(404, "Server not found")
        if (server.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Only server owner can delete this server")
        await Promise.all([
            serverModel.findByIdAndDelete(server._id),
            serverMemberModel.deleteMany({ server: server._id }),
            channelModel.deleteMany({ server: server._id }),
            roleModel.deleteMany({ server: server._id }),
        ])
        return res.status(200).json(new ApiResponse(200, null, "Server deleted successfully"))
    } catch (error) { next(error) }
}

export const createInvite = async (req, res, next) => {
    try {
        const server = await serverModel.findById(req.params.serverId)
        if (!server) throw new ApiError(404, "Server not found")
        if (!(await serverMemberModel.exists({ server: server._id, user: req.user._id }))) throw new ApiError(403, "You are not a member of this server")
        return res.status(200).json(new ApiResponse(200, { inviteCode: server.inviteCode }, "Invite created successfully"))
    } catch (error) { next(error) }
}

export const leaveServer = async (req, res, next) => {
    try {
        const server = await serverModel.findById(req.params.serverId)
        if (!server) throw new ApiError(404, "Server not found")
        if (server.owner.toString() === req.user._id.toString()) throw new ApiError(400, "Server owner cannot leave the server")
        const member = await serverMemberModel.findOneAndDelete({ server: server._id, user: req.user._id })
        if (!member) throw new ApiError(404, "You are not a member of this server")
        return res.status(200).json(new ApiResponse(200, null, "Left server successfully"))
    } catch (error) { next(error) }
}

