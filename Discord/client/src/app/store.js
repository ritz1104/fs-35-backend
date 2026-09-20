import {configureStore} from '@reduxjs/toolkit'
import authReducers from '../features/authSlice.js'
export const store = configureStore({
    reducer:{
     auth:authReducers
    }
})