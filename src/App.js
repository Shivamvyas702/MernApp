import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import TaskDetails from './components/TaskDetails';
import Login from './components/Login';
import Register from './components/Register';
import CreateTask from './components/CreateTask';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
        <Route path="/createtask" element={<CreateTask/>}/>
      </Routes>
    </Router>
  );
}

export default App;
