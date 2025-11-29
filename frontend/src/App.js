import React, { useState } from 'react';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const onLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) return (
    <div className="authWrap">
      <div><Register onAuth={onLogin} /></div>
      <div><Login onAuth={onLogin} /></div>
    </div>
  );

  return <Dashboard user={user} onLogout={logout} />;
}
