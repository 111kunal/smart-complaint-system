import {useForm} from 'react-hook-form'
import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const [showPassword,setShowPassword] = useState(null);
  const [error,setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Login failed');
    }

    // store token so the user stays logged in
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result));

    navigate(result.role === 'admin' ? '/admin' : result.role === 'agent' ? '/agent' : '/user');
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md relative">
        {/* close button */}
        <button className=' text-gray-400 hover:text-gray-800 text-2xl hover:cursor-pointer absolute top-1 right-3.5' onClick={()=>navigate("/")}>x</button>
        <h2 className='text-center font-semibold text-2xl text-gray-800 mb-6'>ResolveIQ</h2>

        {/* Email */}
        <div className="relative mb-5">
          <input {...register('email', {required:true})}
            type="email"
            id="email"
            placeholder=" "
            className="peer w-full px-3 pt-5 pb-2 text-sm border border-gray-300 rounded-md 
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          <label
            htmlFor="email"
            className="absolute left-3 top-2 text-gray-500 text-sm 
                       peer-placeholder-shown:top-3.5 
                       peer-placeholder-shown:text-base 
                       peer-placeholder-shown:text-gray-400
                       peer-focus:top-2 
                       peer-focus:text-sm 
                       peer-focus:text-blue-500 
                       transition-all">
            Email address
          </label>
        </div>

        {/* Password */}
        <div className="relative mb-5">
          <div>
            <input
              type={showPassword ? "text" : "password"}
              {...register('password', {required:true})}
              autoComplete='current-password'
              id="password"
              placeholder=" "
              className="peer w-full px-3 pt-5 pb-2 text-sm border border-gray-300 rounded-md 
                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-2 text-gray-500 text-sm 
                        peer-placeholder-shown:top-3.5 
                        peer-placeholder-shown:text-base 
                        peer-placeholder-shown:text-gray-400
                        peer-focus:top-2 
                        peer-focus:text-sm 
                        peer-focus:text-blue-500 
                        transition-all">
              Password
            </label>
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-blue-600">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Role */}
        <select name="Role" id="role" {...register('role',{required:true})} className="peer w-full px-3 pt-5 pb-2 text-sm border border-gray-300 rounded-md mb-5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
          <option value="" hidden className='text-gray-400'>Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="agent">Agent</option>
        </select>

        {/* error messaage */}
        {error && (
          <p className='text-red-500 text-sm text-center mb-4'>{error}</p>
        )}


        {/* Button */}
        <input type="submit" disabled={isSubmitting} value={isSubmitting? "Loging" : "Login"} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"/>
        <p className="text-sm text-gray-600 text-center mt-4">
          don't have a account?{" "}
          <Link to="/signup" className='text-blue-600 hover:underline'>Sign Up</Link>
        </p>
      </div>
    </form>
  )
}
export default Login
