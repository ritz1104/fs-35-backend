import { RouterProvider } from 'react-router-dom'
import './App.css'
import './polish.css'
import router from './routes/route'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getMeAsync } from './features/authSlice'

function App() {

  const dispatch = useDispatch()

  useEffect(()=>{
      dispatch(getMeAsync())
  },[])
  return <RouterProvider router={router} />
}

export default App
