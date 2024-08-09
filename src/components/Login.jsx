import React, { useState } from 'react';
import axios from 'axios';
import { Link ,useNavigate} from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email,setemail] = useState('')
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);
      navigate('/dashboard'); // Redirect to dashboard on successful login
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <>
       <div className="bg-indigo-500 p-4 w-full  rounded shadow flex justify-between items-center">
    <h1 className="text-xl font-bold text-white flex items-center ">
      <span>Task Management System</span>  </h1>
      <div className="ml-auto flex ">
        <button className="bg-white font-bold hover:bg-indigo-700 hover:text-white text-indigo-500 py-2 px-4 rounded mr-2"
        onClick={()=>navigate(`/`)}>
          Register Here!
        </button>
        <button className="bg-white font-bold hover:bg-indigo-700 hover:text-white text-indigo-500 py-2 px-4 rounded"
         onClick={()=>navigate(`/login`)}>
          Login
        </button>
      </div>
  </div>
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <div className="bg-white shadow-md p-8 mb-2 rounded-md w-full sm:w-96">
        <h1 className="text-2xl mb-4 text-center font-bold bg-slate-600 text-white rounded-md p-4">
          Login Form
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              className="shadow appearance-none border bg-orange-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Enter email..."
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              className="shadow appearance-none border bg-orange-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              required
            />
          </div>
          <button
            className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>Don't have an account?</p>
          <Link to="/" className="text-indigo-500 hover:text-indigo-700">
            <u>Register</u>
          </Link>
        </div>
      </div>
    </div>
    </>
  
  );
};

export default Login;
