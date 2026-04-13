import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h1 className="mb-4 text-4xl font-semibold text-slate-900">Page not found</h1>
      <p className="mb-6 text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="inline-flex rounded-2xl bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
        Go back home
      </Link>
    </section>
  );
}
