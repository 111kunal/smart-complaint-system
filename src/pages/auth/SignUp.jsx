import React from 'react'
import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const SignUp = () => {
  const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const password = watch('password');
  const onSubmit = (data)=>{
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md relative">
        {/* close button */}
        <button className=' text-gray-400 hover:text-gray-800 text-2xl hover:cursor-pointer absolute top-1 right-3.5' onClick={()=>navigate("/")}>×</button>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Create your account
        </h2>

        {/* Name */}
        <div className="relative mb-5">
          <input
            {...register('username',{required:true,pattern:{value:/^[a-zA-Z0-9_]{3,15}$/,message:'the username can only contain alphabets and numbers'}})}
            type="text"
            id="name"
            placeholder=" "
            className="peer w-full px-3 pt-5 pb-2 text-sm border border-gray-300 rounded-md 
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          <label
            htmlFor="name"
            className="absolute left-3 top-2 text-gray-500 text-sm 
                       peer-placeholder-shown:top-3.5 
                       peer-placeholder-shown:text-base 
                       peer-placeholder-shown:text-gray-400
                       peer-focus:top-2 
                       peer-focus:text-sm 
                       peer-focus:text-blue-500 
                       transition-all">
            User Name
          </label>
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className="relative mb-5">
          <input
            {...register('email',{required:true})}
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
          <input
            {...register('password', {required:true,autoComplete:'current-password', pattern: {value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,message: "Must include uppercase, lowercase, number and special character"} , minLength:{value:8,message:"Password must be at least 8 characters"}})}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
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
          {/* Toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-blue-600">
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative mb-6">
          <input
            {...register('cpassword',{required:true,validate:(value)=>password === value || "password do not match"})}
            type="password"
            id="confirmPassword"
            placeholder=" "
            className="peer w-full px-3 pt-5 pb-2 text-sm border border-gray-300 rounded-md 
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          <label
            htmlFor="confirmPassword"
            className="absolute left-3 top-2 text-gray-500 text-sm 
                       peer-placeholder-shown:top-3.5 
                       peer-placeholder-shown:text-base 
                       peer-placeholder-shown:text-gray-400
                       peer-focus:top-2 
                       peer-focus:text-sm 
                       peer-focus:text-blue-500 
                       transition-all">
            Confirm Password
          </label>
          {errors.cpassword && <p>{errors.cpassword.message}</p>}
        </div>

        {/* Role */}
        <select name="Role" id="role" {...register('role',{required:true})} className="peer w-full px-3 pt-5 pb-2 text-sm border border-gray-300 rounded-md mb-5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
          <option value="" hidden className='text-gray-400'>Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="agent">Agent</option>
        </select>

        {/* Button */}
        <input type="submit" disabled={isSubmitting} value={isSubmitting? "Signing" : "Sign Up"} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"/>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className='text-blue-600 hover:underline'>Login</Link>
        </p>

      </div>
    </form>
  )
}

export default SignUp
