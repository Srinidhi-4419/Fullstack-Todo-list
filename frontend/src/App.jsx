import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Navbar component
import Main from './components/Main';     // Main component
import SignUp from './components/SignUp'; // SignUp component
import Todo from './components/Todo';     // Todo page component
import Login from './components/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route 
            path="/signup" 
            element={<SignUp setIsAuthenticated={setIsAuthenticated} />} // Pass setIsAuthenticated as a prop 
          />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Main />
              </>
            }
          />
          <Route
            path="/todo"
            element={
              isAuthenticated ? (
                <>
                  <Navbar />
                  <Todo />
                </>
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <p>Please sign up to access your todo list.</p>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
