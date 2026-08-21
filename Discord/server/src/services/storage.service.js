import Imagekit from "imagekit";
import dotenv from 'dotenv'
dotenv.config()
const storageInstance = new Imagekit({
    urlEndpoint:process.env.IK_URL,
    privateKey:process.env.IK_PRIVATE_KEY,
    publicKey:process.env.IK_PUBLIC_KEY
})


const sendFiles = async (file,fileName)=>{
    let obj ={
        file,
        fileName,
        folder:"discord"
    }

    return await storageInstance.upload(obj)
}


export default sendFiles