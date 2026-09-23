import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const labels: Record<string, string> = {
  dashboard: 'Dashboard',
  suppliers: 'Suppliers',
  orders: 'Orders',
  inventory: 'Inventory',
  analytics: 'Analytics',
  forecasting: 'Forecasting',
  risk: 'Risk Assessment',
};

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-slate-500">
      <Link to="/dashboard" className="transition hover:text-sky-600">Home</Link>
      {segments.map((segment, index) => {
        const route = `/${segments.slice(0, index + 1).join('/')}`;
        const current = index === segments.length - 1;
        return (
          <span key={route} className="flex items-center gap-1">
            <ChevronRight size={12} className="text-slate-300" />
            {current ? <span className="font-medium text-slate-700">{labels[segment] ?? segment}</span> : <Link to={route} className="hover:text-sky-600">{labels[segment] ?? segment}</Link>}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
