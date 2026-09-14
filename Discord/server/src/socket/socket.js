import { Server } from "socket.io";
import { server } from "../app/app.js";

export const initializeSocket = (server)=>{
    const io = new Server(server)

    io.on("connection",(socket)=>{
        console.log("socket connected",socket.id)

        socket.on("disconnect",()=>{
             console.log("socket disconnected",socket.id)
        })
    })
}