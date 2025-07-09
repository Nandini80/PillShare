// src/components/RegisterModal.jsx
import { useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function RegisterModal({ onClose }) {
  const { setAuth } = React.useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor', region: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/register', form);
      const loginRes = await axios.post('/api/login', { email: form.email, password: form.password });
      setAuth({ token: loginRes.data.token, role: loginRes.data.role });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label>Name</label><input name="name" onChange={handleChange} required className="w-full border rounded p-2" /></div>
          <div><label>Email</label><input type="email" name="email" onChange={handleChange} required className="w-full border rounded p-2" /></div>
          <div><label>Password</label><input type="password" name="password" onChange={handleChange} required className="w-full border rounded p-2" /></div>
          <div><label>Region</label><input name="region" onChange={handleChange} required className="w-full border rounded p-2" /></div>
          <div>
            <label className="mr-2"><input type="radio" name="role" value="donor" checked={form.role==='donor'} onChange={handleChange} /> Donor</label>
            <label><input type="radio" name="role" value="needy" checked={form.role==='needy'} onChange={handleChange} /> Needy</label>
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">Register & Login</button>
        </form>
      </div>
    </div>
  );
}
