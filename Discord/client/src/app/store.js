import {configureStore} from '@reduxjs/toolkit'
import authReducers from '../features/authSlice.js'
import serverReducer from '../features/serverSlice.js'
import channelReducer from '../features/channelSlice.js'
import messageReducer from '../features/messageSlice.js'
export const store = configureStore({
    reducer:{
     auth:authReducers,
     servers:serverReducer,
     channels:channelReducer,
     messages:messageReducer
    }
})