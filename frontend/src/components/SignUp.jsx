import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(https://full-stack-todolist.onrender.com/api/v1/user/signup', formData)
      .then((response) => {
        toast.success('SignUp successful');
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true); 
        navigate('/todo'); 
        setFormData({ username: '', password: '', firstname: '', lastname: '' }); // Clear form
      })
      .catch((error) => {
        
        const errorMessage = error.response ? error.response.data.message : 'SignUp failed. Please try again.';
        toast.error(errorMessage);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-3xl mb-6">Sign Up</h2>
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="username">
            Username
          </label>
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
          <label className="block text-gray-700" htmlFor="password">
            Password
          </label>
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

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="firstname">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="lastname">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
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

      <ToastContainer />
    </div>
  );
};

export default SignUp;
