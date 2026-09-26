import { useEffect } from "react"
import socket from "../socket/scoket.js"


const useChannelSocket = (channelId) => {
 

    useEffect(()=>{
        if (!channelId) return
        
        // event for join channel
        console.log(channelId)
        socket.emit("join-channel",channelId)
 

        
        // runs where a user switch the channel or unmount 
        return ()=>{
        socket.emit("leave-channel",channelId)
        console.log(channelId)
        }
    },[channelId])
}

export default useChannelSocket