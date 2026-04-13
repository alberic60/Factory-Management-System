import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api.js';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async event => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/auth/login', { username, password });
      localStorage.setItem('fosms-user', username);
      setUser(username);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to log in.');
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-secondary">Welcome back</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Log in to your account</h1>
      </div>
      <form className="space-y-6" onSubmit={handleLogin}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required className="mt-2 w-full" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required className="mt-2 w-full" />
        </label>
        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button type="submit" className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600">
          Log in
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        New to FOSMS?{' '}
        <Link to="/register" className="font-semibold text-secondary hover:text-blue-700">
          Register now
        </Link>
      </p>
    </section>
  );
}
