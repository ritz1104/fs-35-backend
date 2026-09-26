import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMe, loginUser, logoutUser, registerUser } from "../services/auth.service";

const responseData = (response) => response?.data ?? response?.user ?? response;

export const loginUserAsync = createAsyncThunk("auth/login",async (data, { rejectWithValue })=>{
    try {
    const response = await loginUser(data)
        return responseData(response)
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Unable to sign in")
    }
})

export const registerUserAsync = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    try {
        const response = await registerUser(data)
        return responseData(response)
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Unable to create your account")
    }
})

export const getMeAsync = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
    try {
        return responseData(await getMe())
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Your session has expired")
    }
})

export const logoutUserAsync = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        return await logoutUser()
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Unable to sign out")
    }
})

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:true,
        error:null
    },
    reducers:{
       
        clearUser:(state)=>{
            state.user = null
            state.isAuthenticated = false
            state.loading = false
            state.error = null
        }
    },

    extraReducers:(builder)=>{
        builder.addCase(loginUserAsync.pending,(state)=>{
            state.loading = true
            state.error = null
        }).addCase(loginUserAsync.fulfilled,(state,action)=>{
            state.user= action.payload,
            state.loading = false
            state.error = null
            state.isAuthenticated = true
        }).addCase(loginUserAsync.rejected,(state,action)=>{
            state.user = null,
            state.isAuthenticated = false,
            state.loading = false
            state.error = action.payload || action.error.message
        })

        builder.addCase(getMeAsync.pending,(state)=>{
            state.loading = true
            state.error = null
        }).addCase(getMeAsync.fulfilled,(state, action)=>{
            state.user = action.payload
            state.isAuthenticated = true,
            state.error = null
            state.loading=false
        }).addCase(getMeAsync.rejected,(state,action)=>{
            state.user = null
            state.loading = false
            state.error = action.payload || action.error.message
             state.isAuthenticated = false
        })
        builder.addCase(registerUserAsync.fulfilled, (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.loading = false
            state.error = null
        }).addCase(registerUserAsync.pending, (state) => {
            state.loading = true
            state.error = null
        }).addCase(registerUserAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || action.error.message
        })
        builder.addCase(logoutUserAsync.fulfilled, (state) => {
            state.user = null
            state.isAuthenticated = false
            state.loading = false
            state.error = null
        }).addCase(logoutUserAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || action.error.message
        })
    }
})
 
export const {clearUser} = authSlice.actions

export default authSlice.reducer