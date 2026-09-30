import { useEffect } from "react"
import { useDispatch } from "react-redux"
import socket from "../socket/scoket"
import { addMessage } from "../features/messageSlice"

const useMessageSocket = ()=>{

    const dispatch = useDispatch()
    useEffect(()=>{

         const handleNewMessage = (message)=>{
            console.log("new message",message)

            dispatch(addMessage(message))
         }

        socket.on("message:new",handleNewMessage)

        return ()=>{
            socket.off("message:new",handleNewMessage)
        }

    },[dispatch])
}

export default useMessageSocket