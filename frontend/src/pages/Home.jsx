import React from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import Login from '../pages/auth/Login'

const Home = () => {
  const navigate  = useNavigate();
  return (
    <div>
      <button className='bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors' onClick={()=>navigate('/login')}>Login/Register</button>
      <div>
        <Login />
      </div>
    </div>
  )
}

export default Home
