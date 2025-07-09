// src/components/LoginModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ onClose }) {
  const { setAuth } = React.useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', form);
      setAuth({ token: res.data.token, role: res.data.role });
      onClose();
      navigate(res.data.role === 'donor' ? '/donor-dashboard' : '/needy-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label>Email</label><input type="email" name="email" onChange={handleChange} required className="w-full border rounded p-2" /></div>
          <div><label>Password</label><input type="password" name="password" onChange={handleChange} required className="w-full border rounded p-2" /></div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
}
