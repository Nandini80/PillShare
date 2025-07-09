// src/pages/Register.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'donor', region: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/register', form);
      const loginRes = await axios.post('/api/login', {
        email: form.email,
        password: form.password
      });
      setAuth({ token: loginRes.data.token, role: loginRes.data.role });
      navigate(loginRes.data.role === 'donor' ? '/donor-dashboard' : '/needy-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" required onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="region" placeholder="Region" required onChange={handleChange} className="w-full border p-2 rounded" />
        <div className="flex gap-4">
          <label><input type="radio" name="role" value="donor" checked={form.role==='donor'} onChange={handleChange}/> Donor</label>
          <label><input type="radio" name="role" value="needy" checked={form.role==='needy'} onChange={handleChange}/> Needy</label>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
