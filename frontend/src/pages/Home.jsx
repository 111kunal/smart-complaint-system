import React from 'react'
import { NavLink,useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate  = useNavigate();
  return (
    <div>
      <button className='bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors' onClick={()=>navigate('/login')}>Login/Register</button>
      <div>
        <ul>
          <li><NavLink to='/'>Home</NavLink></li>
          <li><NavLink to='/admin'>Admin</NavLink></li>
          <li><NavLink to='/user'>User</NavLink></li>
          <li><NavLink to='/agent'>Agent</NavLink></li>
        </ul>
      </div>
    </div>
  )
}

export default Home
