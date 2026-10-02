import React from 'react'
import { createBrowserRouter ,RouterProvider} from "react-router-dom";
import AdminPage from './pages/AdminPage'
import UserPage from './pages/UserPage'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Agent from './pages/Agent'
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter(
  [
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/admin",
      element:(
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminPage />
        </ProtectedRoute>
      )
    },
    {
      path:"/user",
      element:<ProtectedRoute allowedRoles={["user"]}>
          <UserPage />
        </ProtectedRoute>
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
      element:<ProtectedRoute allowedRoles={["agent"]}>
          <Agent />
        </ProtectedRoute>
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
