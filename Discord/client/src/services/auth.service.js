import api from "../config/api.js";




export const registerUser = async (data)=>{
  
    const response = await api.post('/auth/register',data)

   return response.data
} 

export const loginUser = async (data)=>{
    const response = await api.post('/auth/login',data)
    return response.data
}

export const getMe = async ()=>{
    const response  = await api.get("/users/me")
     return response.data
}

export const logoutUser = async ()=>{
    const response = await api.post('/auth/logout')
    return response
}