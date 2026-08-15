import React from 'react'
import { createBrowserRouter ,RouterProvider} from "react-router-dom";
import AdminPage from './pages/AdminPage'
import UserPage from './pages/UserPage'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Agent from './pages/Agent'

const router = createBrowserRouter(
  [
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/admin",
      element:<AdminPage/>
    },
    {
      path:"/user",
      element:<UserPage/>
    },
    {
      path:"/login",
      element:<Login/>
    },
    {
      path:"/signup",
      element:<SignUp/>
    },
    {
      path:"/agent",
      element:<Agent/>
    },
  ]
);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
