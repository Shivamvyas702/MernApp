import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate  } from 'react-router-dom';
function AddTaskForm() {

    const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = { title, description, dueDate, priority };

    try {
      const response = await axios.post('http://localhost:5000/tasks', newTask);
      console.log('Task added:', response.data);
      
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="">
<div className="bg-indigo-400 p-4 w-full mb-4 rounded shadow flex justify-between items-center">
  <h1 className='text-xl font-bold text-white'>Task Manager</h1>
  <Link to="/dashboard">
    <button className="font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded">
      All Task
    </button>
  </Link>
</div>      <form onSubmit={handleSubmit} className="bg-purple-200 mb-12 mt-2 my-12 mx-16  p-8 rounded shadow-md">
  <div className='p-2 m-2 text-lg font-bold'>
    Create Task 
  </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder='Title here...'
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder='description'
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="flex justify-end">

       <Link to="/">
        <button
        type='button'
         className='boeder-indigo-500 border mr-2 text-indigo-500 font-bold py-2 px-4'>
         Close
         </button>
         </Link>
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTaskForm;
