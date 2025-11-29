import React, { useState } from 'react';
import API from '../api';

export default function Register({ onAuth }) {
  const [data, setData] = useState({ name:'', email:'', password:'' });
  const submit = async (e) => {
    e.preventDefault();
    const res = await API.post('/auth/register', data);
    onAuth(res.data.token, res.data.user);
  };
  return (
    <form onSubmit={submit} className="authForm">
      <h3>Register</h3>
      <input placeholder="Name" onChange={e=>setData({...data,name:e.target.value})} required />
      <input placeholder="Email" onChange={e=>setData({...data,email:e.target.value})} required />
      <input placeholder="Password" type="password" onChange={e=>setData({...data,password:e.target.value})} required />
      <button type="submit">Register</button>
    </form>
  );
}
