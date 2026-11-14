import React from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import Login from '../pages/auth/Login'

const Home = () => {
  const navigate  = useNavigate();
  return (
    <div>
      <div>
        <Login />
      </div>
    </div>
  )
}

export default Home
