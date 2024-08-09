import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import {jwtDecode} from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
  });
  const [username, setUsername] = useState('');
  const [email,setemail] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState('');
const [priorityFilter, setPriorityFilter] = useState('');


  const navigate = useNavigate();

  // Calculate current tasks to display based on pagination
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;

  const filteredTasks = tasks.filter(task =>
    (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === '' || task.status === statusFilter) &&
    (priorityFilter === '' || task.priority === priorityFilter)
  );
  
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Handle previous page click
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page click
  const handleNextPage = () => {
    if (indexOfLastTask < filteredTasks.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setemail(decoded.email);
      } catch (error) {
        console.error('Error decoding token:', error);
      }

      const fetchTasks = async () => {
        try {
          const response = await axios.get(`${apiUrl}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTasks(response.data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
    } else {
      console.log('No token found');
    }
  }, [apiUrl]);

  const deleteTask = async (taskId) => {
    console.log('Deleting task with ID:', taskId);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/tasks/${taskId}`);
          setTasks(tasks.filter((task) => task._id !== taskId));
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting task:', error);
          Swal.fire('Error!', 'Failed to delete task.', 'error');
        }
      }
    });
  };

  const taskEdit = (task) => {
    setEditingTask(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split('T')[0],
      priority: task.priority,
    });
  };

  const formChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/tasks/${editingTask}`, formData);
      setTasks(tasks.map((task) => (task._id === editingTask ? response.data : task)));
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    console.log(`Updating task ${taskId} to status ${newStatus}`);
    try {
      const response = await axios.patch(`${apiUrl}/tasks/${taskId}`, { status: newStatus });
      console.log('Update response:', response.data);
      setTasks(tasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task)));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="bg-indigo-200 min-h-screen p-6">
      <div className="p-4 w-full mb-4 rounded shadow flex justify-between items-center bg-indigo-500">
        <h2 className="text-xl text-white">Your Task Manager</h2>
        <button
          className="font-bold text-rose-500 hover:text-rose-600 bg-white py-2 px-4 rounded"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>

      <h1 className="text-center text-2xl text-amber-500 bg-white p-2">Welcome {email} to the dashboard</h1>
      <div className="p-2 flex justify-end">
        <Link to="/createtask">
          <button className="font-bold text-white bg-indigo-700 hover:bg-indigo-800 py-2 px-4 rounded">
            Create Task
          </button>
        </Link>
      </div>

      <div className="p-2 mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto">
      <div className="p-2 mb-4 flex gap-4">
      <span className='text-lg font-semi-bold'>Filter By : </span>  
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-3 py-2 border rounded-md"
  >
    <option value="">All Statuses</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>
  <select
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
    className="px-3 py-2 border rounded-md"
  >
    <option value="">All Priorities</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>
</div>

        <table className="min-w-full bg-white shadow-md rounded">
          
          <thead className="bg-indigo-800 text-white">
            <tr>
              <th className="px-4 py-2">S.No</th>
              <th className="w-1/3 px-4 py-2">Title</th>
              <th className="w-1/3 px-4 py-2">Description</th>
              <th className="w-1/6 px-4 py-2">Due Date</th>
              <th className="w-1/6 px-4 py-2">Priority</th>
              <th className="w-1/6 px-4 py-2">Status</th>
              <th className="w-1/6 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task, index) => (
              <tr key={task._id} className="text-center border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{task.title}</td>
                <td className="px-4 py-2">{task.description}</td>
                <td className="px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{task.priority}</td>
                <td className="px-4 py-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="px-4 py-2 flex">
                  <button onClick={() => taskEdit(task)} className="text-blue-500 hover:underline mr-2">
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  </button>
                  <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:underline">
                    <FontAwesomeIcon icon={faDeleteLeft} className="mr-2" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-md w-full md:max-w-md">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setEditingTask(null)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl font-bold mb-4">Edit Task</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={formChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={formChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={formChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={formChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="border-indigo-600 border text-indigo-500 py-2 px-4 rounded hover:bg-indigo-700 hover:text-white"
                    onClick={() => setEditingTask(null)}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 p-2 ml-2 text-white py-2 px-4 rounded hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`bg-indigo-600 text-white py-2 px-4 rounded mr-2 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastTask >= filteredTasks.length}
            className={`bg-indigo-600 text-white py-2 px-4 rounded ${
              indexOfLastTask >= filteredTasks.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;