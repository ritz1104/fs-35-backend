import { useEffect } from "react"
import socket from "../socket/scoket"

const useChannelEvent = ()=>{
    useEffect(()=>{

        const handleChannelJoin = (data)=>{
            console.log("succesffuly joined",data.channelId)
        }

        const handleChannelError = (error)=>{
            console.log("channel erroe",error.message)
        }

        socket.on("channel:join",handleChannelJoin)        
        socket.on("errors",handleChannelError)   
        
        return ()=>{
            socket.off("channel:join",handleChannelJoin)
            socket.off("errors",handleChannelError)   
        
        }

    },[])
}

export default useChannelEvent