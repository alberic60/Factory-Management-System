import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import Products from './pages/Products.jsx';
import Orders from './pages/Orders.jsx';
import Payments from './pages/Payments.jsx';
import Reports from './pages/Reports.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import api from './api/api.js';

function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn(error);
    }
    localStorage.removeItem('fosms-user');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="min-h-[calc(100vh-160px)] bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute user={user}><Customers /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute user={user}><Products /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute user={user}><Orders /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute user={user}><Payments /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute user={user}><Reports /></ProtectedRoute>} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('fosms-user'));

  useEffect(() => {
    const storedUser = localStorage.getItem('fosms-user');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes user={user} setUser={setUser} />
    </BrowserRouter>
  );
}
