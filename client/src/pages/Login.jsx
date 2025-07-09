// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', form);
      setAuth({ token: res.data.token, role: res.data.role });
      navigate(res.data.role === 'donor' ? '/donor-dashboard' : '/needy-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
