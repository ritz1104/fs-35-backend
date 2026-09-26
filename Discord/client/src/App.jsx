import { RouterProvider } from 'react-router-dom'
import './App.css'
import './polish.css'
import router from './routes/route'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMeAsync } from './features/authSlice'
import { fetchServers } from './features/serverSlice'

function App() {

  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  useEffect(()=>{
      dispatch(getMeAsync())
  },[dispatch])

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchServers())
  }, [dispatch, isAuthenticated])
  return <RouterProvider router={router} />
}

export default App
