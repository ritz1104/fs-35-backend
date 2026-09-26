import { createBrowserRouter, Navigate } from 'react-router-dom'
import ChatLayout from '../components/layout/ChatLayout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ServerWelcome from '../pages/ServerWelcome'
import PrivateRoutes from './privateRoutes'

const router = createBrowserRouter([
  { path: '/',
     element:<PrivateRoutes>
       <ChatLayout/>
     </PrivateRoutes> 
    },
  { path: '/welcome',
   element: <ServerWelcome /> 
},
  { path: '/login',
     element: <Login />
     },
  { path: '/register',
    element: <Register /> 
},
  { path: '*', 
    element: <Navigate to="/" replace /> 
},
])

export default router
