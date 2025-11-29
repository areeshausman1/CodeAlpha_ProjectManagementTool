import React, { useState } from 'react';
import API from '../api';
import Comments from './Comments';

export default function TaskCard({ task }) {
  const [showComments, setShowComments] = useState(false);
  const changeStatus = async (s) => {
    await API.put(`/tasks/${task._id}`, { status: s });
  };
  const del = async () => {
    await API.delete(`/tasks/${task._id}`);
  };

  return (
    <div className="taskCard">
      <h5>{task.title}</h5>
      <p>{task.description}</p>
      <div className="taskActions">
        <select value={task.status} onChange={e=>changeStatus(e.target.value)}>
          <option value="todo">Todo</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={()=>setShowComments(s=>!s)}>Comments</button>
        <button onClick={del}>Delete</button>
      </div>
      {showComments && <Comments taskId={task._id} />}
    </div>
  );
}
