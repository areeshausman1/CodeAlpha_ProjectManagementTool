import React, { useEffect, useState } from 'react';
import API from '../api';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000');

export default function Comments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [text,setText] = useState('');

  const load = async () => {
    // naive: fetch via tasks endpoint not provided; skipping, rely on realtime for new comments
  };

  useEffect(()=>{
    socket.on('comment:created', (c) => {
      if (c.task === taskId) setComments(prev => [c, ...prev]);
    });
    return () => { socket.off('comment:created'); };
  }, [taskId]);

  const submit = async (e) => {
    e.preventDefault();
    await API.post(`/tasks/${taskId}/comments`, { text });
    setText('');
  };

  return (
    <div className="comments">
      <form onSubmit={submit}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write comment" required />
        <button type="submit">Send</button>
      </form>

      <div className="commentsList">
        {comments.map(c => <div key={c._id} className="commentItem"><b>{c.author?.name}</b>: {c.text}</div>)}
      </div>
    </div>
  );
}
