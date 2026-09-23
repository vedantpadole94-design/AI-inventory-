import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-[60vh] items-center justify-center p-8">
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_32px_rgba(31,38,135,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">404</p>
      <h1 className="mt-4 text-4xl font-bold text-slate-800">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-500">The route you requested doesn’t exist in the procurement dashboard.</p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-medium text-white hover:bg-sky-600"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
