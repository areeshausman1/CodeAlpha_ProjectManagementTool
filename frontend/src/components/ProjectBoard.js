import React, { useEffect, useState } from 'react';
import API from '../api';
import io from 'socket.io-client';
import TaskCard from './TaskCard';
import Comments from './Comments';

const socket = io(process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000');

export default function ProjectBoard({ project, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [title,setTitle] = useState('');

  const load = async () => {
    const res = await API.get(`/projects/${project._id}`);
    setTasks(res.data.tasks);
  };

  useEffect(()=>{
    load();
    socket.emit('joinProject', project._id);

    socket.on('task:created', (task) => {
      if (task.project === project._id) setTasks(t => [task, ...t]);
    });
    socket.on('task:updated', (task) => {
      setTasks(t => t.map(x => x._id === task._id ? task : x));
    });
    socket.on('task:deleted', ({ id }) => {
      setTasks(t => t.filter(x => x._id !== id));
    });

    return () => {
      socket.emit('leaveProject', project._id);
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, [project._id]);

  const create = async (e) => {
    e.preventDefault();
    const res = await API.post('/tasks', { project: project._id, title, description: '', status: 'todo' });
    setTitle('');
    // server emits; optimistic update optional
  };

  return (
    <div className="board">
      <button onClick={onClose}>Close</button>
      <h3>{project.name}</h3>

      <form onSubmit={create} className="createForm">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task title" required />
        <button type="submit">Add Task</button>
      </form>

      <div className="columns">
        {['todo','inprogress','done'].map(status => (
          <div key={status} className="column">
            <h4>{status.toUpperCase()}</h4>
            {tasks.filter(t=>t.status===status).map(task => <TaskCard key={task._id} task={task} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
