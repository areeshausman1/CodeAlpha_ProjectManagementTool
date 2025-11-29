import React, { useEffect, useState } from 'react';
import API from '../api';
import ProjectBoard from './ProjectBoard';

export default function Dashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [name,setName] = useState('');

  const load = async () => {
    const res = await API.get('/projects');
    setProjects(res.data);
  };
  useEffect(()=>{ load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    const res = await API.post('/projects', { name, description: '' });
    setProjects([res.data, ...projects]);
    setName('');
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Projects</h2>
        <div>
          <span>{user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <form onSubmit={create} className="createForm">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="New project name" required />
        <button type="submit">Create</button>
      </form>

      <div className="projectList">
        {projects.map(p => (
          <div key={p._id} className="projectItem" onClick={()=>setSelected(p)}>
            <h4>{p.name}</h4>
            <p>{p.description}</p>
          </div>
        ))}
      </div>

      {selected && <ProjectBoard project={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
