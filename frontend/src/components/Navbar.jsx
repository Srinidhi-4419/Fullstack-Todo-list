import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [isLoggedIn, setLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLogin(true);
    }
  }, []);

  const handleClick = () => {
    localStorage.removeItem('token');
    setLogin(false);
    
    navigate('/');
    
  };

  return (
    <nav className="flex justify-between items-center text-white px-6 py-4 xs:flex-row xs:justify-start xs:space-x-8 xs:px-0">
      <ToastContainer />
      <div className="flex ml-10 xs:ml-0">
        <img
          src="https://img.freepik.com/free-vector/colorful-todo-list-illustration_1308-173328.jpg"
          className="h-12 w-12 xs:h-8 xs:w-8"
          alt="TodoApp"
        />
        <h1 className="text-3xl font-bold text-orange-400 xs:text-xl">TodoApp</h1>
      </div>
      <div>
        {!isLoggedIn ? (
          <>
            <Link
  to="/signup"
  className="bg-transparent border border-black text-black px-4 py-2 rounded hover:text-gray-800 transition duration-300 mr-4 xs:text-md xs:p-1 xs:m-0 xs:mr-2 xs:rounded-md "
>
  Sign Up
</Link>

<Link
  to="/login"
  className="bg-transparent border border-black text-black px-4 py-2 rounded hover:text-gray-800 transition duration-300 mr-4 xs:text-md xs:p-1 xs:m-0 xs:mr-2 xs:rounded-md "
>
  Login
</Link>

          </>
        ) : (
          <button
            onClick={handleClick}
            className="bg-transparent border border-black text-black px-4 py-2 rounded hover:text-gray-800 transition duration-300 mr-4"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;