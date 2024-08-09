import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    axios.get(`/tasks/${id}`).then((response) => {
      setTask(response.data);
    });
  }, [id]);

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Due: {new Date(task.dueDate).toDateString()}</p>
      <p>Status: {task.status}</p>
    </div>
  );
}

export default TaskDetails;
