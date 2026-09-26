import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/soketAuth.middleware.js";
import channelModel from "../models/channel.model.js";
import serverMemberModel from "../models/serverMember.model.js";
import ApiError from "../utils/ApiError.js";


let io;

export const initializeSocket = (server)=>{
    io = new Server(server, { 
        cors: { origin: "http://localhost:5173", credentials: true } })


     io.use(socketAuthMiddleware)
    
    io.on("connection",(socket)=>{
        console.log("socket connected",socket.id)


        socket.on("join-channel",async (channelId)=>{

            try {
                const channel = await channelModel.findById(channelId)

            if(!channel) {
                throw new ApiError(404,"channel not found pls enter a valid channel id")
            }

            const member = await serverMemberModel.findOne
            ({
                server:channel.server,
                user:socket.user._id
            })

            if(!member){
                throw new ApiError(404,"you are not the member of this server")
            }

            socket.join(`channel:${channelId}`)
            console.log("join :",channelId)
            } catch (error) {
                socket.emit("channel:error", { message: error.message, statusCode: error.statusCode || 500 })
            }
        })
          

        socket.on("leave-channel",(channelId)=>{
            socket.leave(`channel:${channelId}`)
               console.log(`sokcet:${socket.id} leaves : ${channelId}`)
        })

        socket.on("disconnect",()=>{
             console.log("socket disconnected",socket.id)
        })
    })

    return io
}

export const getIO = ()=>{
    if(!io){
        console.log("socket is not initialize")
        return
    }


    return io
}