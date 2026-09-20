import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMe, loginUser } from "../services/auth.service";


export const loginUserAsync = createAsyncThunk("/auth/login",async (data)=>{
    const response = await loginUser(data)

    return response.data
})


export const getMeAsync = createAsyncThunk(_,async()=>
{
const response = await getMe()

return response.data
})
const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:false,
        error:false
    },
    reducers:{
       
        clearUser:(state,action)=>{
            state.user =null,
            state.isAuthenticated = false
            state.loading = false
        }
    },

    extraReducers:(builder)=>{
        builder.addCase(loginUserAsync.pending,(state)=>{
            state.loading = true,
            state.error = false
        }).addCase(loginUserAsync.fulfilled,(state,action)=>{
            state.user= action.payload,
            state.loading = false,
            state.error = false,
            state.isAuthenticated = true
        }).addCase(loginUserAsync.rejected,(state,action)=>{
            state.user = null,
            state.isAuthenticated = false,
            state.loading = false,
            state.error = action.error.message
        })

        builder.addCase(getMeAsync.pending,(state)=>{
            state.loading = true,
            state.error = false
        }).addCase(getMeAsync.fulfilled,(state)=>{
            state.isAuthenticated = true,
            state.error = false
            state.loading=false
        }).addCase(getMeAsync.rejected,(state,action)=>{
            state.loading = false,
            state.error = action.error.message,

             state.isAuthenticated = false
        })
    }
})
 
export const {clearUser} = authSlice.actions

export default authSlice.reducer