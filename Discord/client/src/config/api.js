import axios from 'axios'


const api = axios.create({
    baseURL:"http://localhost:3000/api",
    withCredentials:true
})


api.interceptors.response.use((response)=>{
    return response
},

    async (error)=>{
        const originalRequest = error.config

        if(error.response?.status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url.includes("/auth/refresh")){
            originalRequest._retry = true

            try {
                await api.post("/auth/refresh")
                return api(originalRequest)
            } catch (RefreshError) {
                 return Promise.reject(RefreshError)
            }
        }

        return Promise.reject(error)
    }

)

export default api


