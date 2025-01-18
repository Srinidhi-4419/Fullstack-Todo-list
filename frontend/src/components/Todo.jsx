import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const token = localStorage.getItem('token');

  const fetchTodos = async () => {
    if (!token) {
      setError('You need to log in to view your todos.');
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const response = await axios.get('https://full-stack-todolist.onrender.com/api/v1/user/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.todos)) {
        setTodos(response.data.todos.filter(todo => !todo.completed));
        setCompletedTodos(response.data.todos.filter(todo => todo.completed));
      } else {
        setError('Invalid response structure for todos');
      }
    } catch (error) {
      
      setError('Failed to fetch todos. Please try again later.');
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [token]);

  const handleAddTask = async () => {
    if (!title || !description) {
      toast.error('Title and description are required');
      return;
    }
    if(title.length<3){
      toast.error("Title should be atleast of 3 characters");
      return;
    }
    if(description.length<5){
      toast.error("Description should be atleast of 5 characters");
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/api/v1/user/create',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle('');
      setDescription('');
      setError(null);
      fetchTodos();
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add the task');
    }
  };
  

  const handleCheckboxChange = async (todoId, completed) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/user/todos/completed/${todoId}`,
        { completed: !completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTodos();
      toast.success('Task completion status updated.');
    } catch (error) {
     
      toast.error('Failed to update task completion.');
    }
  };

  const handleDeleteTask = async (todoId) => {
    try {
      await axios.delete(`https://full-stack-todolist.onrender.com/api/v1/user/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Deleted task successfully');
      fetchTodos();
    } catch (error) {
      
      toast.error('Failed to delete the task');
    }
  };

  const handleEditTask = (todo) => {
    setCurrentTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
    setIsModalOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!title || !description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      await axios.put(
        `https://full-stack-todolist.onrender.com/api/v1/user/todos/${currentTodo._id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTodos();
      toast.success('Task updated successfully!');
      setIsModalOpen(false);
    } catch (error) {
    
      toast.error('Failed to update the task');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <ToastContainer />
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Update Task</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                placeholder="Enter new title"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <input
                placeholder="Enter new description"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
                onClick={handleUpdateTask}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <div className="flex-col bg-white shadow-lg rounded-lg p-8 max-w-xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add a Task</h2>
        <input
          placeholder="Title"
          className="w-full mb-4 p-3 border-2 border-gray-300 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          className="w-full mb-4 p-3 border-2 border-gray-300 rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      {/* Your Todos Section */}
      <h1 className="text-4xl mt-6">Your Todos</h1>
      <div className="bg-blue-200 p-4 mt-6 w-full max-w-4xl rounded-lg">
        {isLoading ? (
          <p>Loading...</p> // Show loading state
        ) : todos.length > 0 ? (
          todos.map((todo, index) => (
            <div
              key={todo._id || index}
              className={`mb-4 p-4 bg-white rounded-lg shadow-md flex justify-between items-center ${
                todo.completed ? 'bg-green-200' : ''
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleCheckboxChange(todo._id, todo.completed)}
                  className="mr-4"
                />
                <div>
                  <p className="font-bold text-xl">{todo.title}</p>
                  <p className="text-gray-700">{todo.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src="https://tse2.mm.bing.net/th?id=OIP.LEK7h-h95VZW5qrFh04JMgHaHa&rs=1&pid=ImgDetMain"
                  alt="Edit"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleEditTask(todo)}
                />
                <img
                  src="https://tse3.mm.bing.net/th?id=OIP.h34-YZFupmVzJd6rKwTJJgAAAA&rs=1&pid=ImgDetMain"
                  alt="Delete"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleDeleteTask(todo._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No todos available.</p>
        )}
      </div>

      {/* Completed Todos Section */}
      <h1 className="text-4xl mt-6">Completed Todos</h1>
      <div className="bg-green-200 p-4 mt-6 w-full max-w-4xl rounded-lg">
        {completedTodos.length > 0 ? (
          completedTodos.map((todo, index) => (
            <div
              key={todo._id || index}
              className="mb-4 p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleCheckboxChange(todo._id, todo.completed)}
                  className="mr-4"
                />
                <div>
                  <p className="font-bold text-xl">{todo.title}</p>
                  <p className="text-gray-700">{todo.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src="https://tse3.mm.bing.net/th?id=OIP.h34-YZFupmVzJd6rKwTJJgAAAA&rs=1&pid=ImgDetMain"
                  alt="Delete"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleDeleteTask(todo._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No completed todos yet.</p>
        )}
      </div>
    </div>
  );
};

export default Todo;
