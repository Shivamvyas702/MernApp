import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation

const Register = ({ history }) => {
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  console.log(name,'fgdfg')
const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/register', { name, email, password });
      localStorage.setItem('token', response.data.token);
      setSuccessMessage('Registration successful!'); // Set success message
      setname(''); // Clear input fields
      setEmail('');
      setPassword('');
      setTimeout(() => {
        setSuccessMessage(''); // Clear success message after 3 seconds
      }, 3000);
      history?.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register. Please try again.');
    }
  };

  return (<>
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
      {successMessage && <p className="text-green-500 mb-4 text-center font-bold">{successMessage}</p>}
        <h1 className="text-2xl mb-4 text-center font-bold bg-indigo-500 text-white rounded-md p-4">
          Registration Form
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}     
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">name</label>
            <input
              className="shadow appearance-none border rounded w-full  py-2 
              px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="name..."
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              className="shadow appearance-none border rounded w-full  py-2 
              px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email..."
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              className="shadow appearance-none  border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <Link to="/login" className="text-indigo-500 hover:text-indigo-700">
            <u>Login</u>
          </Link>
        </div>
      </div>
    </div>
    </>);
};

export default Register;
