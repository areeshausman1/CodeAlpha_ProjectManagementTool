import React, { useState } from 'react';
import API from '../api';

export default function Login({ onAuth }) {
  const [data, setData] = useState({ email:'', password:'' });
  const submit = async (e) => {
    e.preventDefault();
    const res = await API.post('/auth/login', data);
    onAuth(res.data.token, res.data.user);
  };
  return (
    <form onSubmit={submit} className="authForm">
      <h3>Login</h3>
      <input placeholder="Email" onChange={e=>setData({...data,email:e.target.value})} required />
      <input placeholder="Password" type="password" onChange={e=>setData({...data,password:e.target.value})} required />
      <button type="submit">Login</button>
    </form>
  );
}
