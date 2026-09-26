import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({children}) => {

   const {isAuthenticated, loading}= useSelector((state)=>state.auth)

   if (loading) return null

   if(!isAuthenticated) {
                 return <Navigate to="/login" replace />
   }

   return children;
}

export default PrivateRoutes