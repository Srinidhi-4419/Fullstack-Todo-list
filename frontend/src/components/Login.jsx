import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({setIsAuthenticated}) => {
    const [formData,setform]=useState({
        username:'',
        password:''
    })
    const navigate = useNavigate();
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setform({
            ...formData,
            [name]:value
        })
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post("https://full-stack-todolist.onrender.com/api/v1/user/signin",formData)
        .then((response)=>{

            localStorage.setItem('token',response.data.token);
            setIsAuthenticated(true);
            navigate('/todo');
        })
        .catch((error)=>{
           
        })
    }
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-3xl mb-6">Login</h2>
      <form 
        className="bg-white p-6 rounded shadow-md w-80" 
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded-md"
            required
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-6 py-2 rounded-md w-full hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
    </>
  )
}

export default Login
