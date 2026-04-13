import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/customers', label: 'Customers' },
  { path: '/products', label: 'Products' },
  { path: '/orders', label: 'Orders' },
  { path: '/payments', label: 'Payments' },
  { path: '/reports', label: 'Reports' }
];

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const showAuthLinks = !user;

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <Link to="/" className="text-xl font-semibold tracking-tight text-white">
              FOSMS
            </Link>
            <p className="text-sm text-white/80">Inventory & sales dashboard</p>
          </div>
        </div>

        <nav className="hidden items-center gap-5 md:flex">
          {showAuthLinks ? (
            <>
              <Link to="/login" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20">
                Log in
              </Link>
              <Link to="/register" className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                Register
              </Link>
            </>
          ) : (
            <>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className={`text-sm font-medium transition ${location.pathname === link.path ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                  {link.label}
                </Link>
              ))}
              <button onClick={onLogout} className="rounded-xl bg-tertiary px-4 py-2 text-sm font-semibold text-white transition hover:bg-tertiary/90">
                Log out
              </button>
            </>
          )}
        </nav>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-primary/95 px-4 py-4 md:hidden">
          {showAuthLinks ? (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="block rounded-xl bg-white/10 px-4 py-3 text-sm text-white hover:bg-white/20">
                Log in
              </Link>
              <Link to="/register" className="block rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500">
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className="block rounded-xl px-4 py-3 text-sm text-white/90 hover:bg-white/10">
                  {link.label}
                </Link>
              ))}
              <button onClick={onLogout} className="rounded-xl bg-tertiary px-4 py-3 text-sm font-semibold text-white hover:bg-tertiary/90">
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
