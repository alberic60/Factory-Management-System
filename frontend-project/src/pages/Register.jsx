import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api.js';

export default function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async event => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', { username, password });
      setSuccess('Registration complete. You can now log in.');
      localStorage.setItem('fosms-user', username);
      setUser(username);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to register.');
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-secondary">Create account</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Register for FOSMS</h1>
      </div>
      <form className="space-y-6" onSubmit={handleRegister}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" required className="mt-2 w-full" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required className="mt-2 w-full" />
        </label>
        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {success && <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}
        <button type="submit" className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
          Register
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-green-700">
          Sign in
        </Link>
      </p>
    </section>
  );
}
