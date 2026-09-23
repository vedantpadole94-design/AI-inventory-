import React from 'react';
import { FileText, ShieldCheck, Truck, DollarSign } from 'lucide-react';
import type { SupplierScorecard as SupplierScorecardType } from '../../types';

const scoreTone = (score: number) => {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-amber-600';
  return 'text-rose-600';
};

export default function SupplierScorecard({ supplier }: { supplier: SupplierScorecardType }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_32px_rgba(31,38,135,0.15)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{supplier.name}</h3>
          <p className="text-sm text-slate-500">{supplier.country}</p>
        </div>
        <div className={`rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold ${scoreTone(supplier.score)}`}>
          {supplier.score}/100
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
        <Metric icon={<ShieldCheck size={14} />} label="Quality" value={supplier.quality} />
        <Metric icon={<Truck size={14} />} label="Delivery" value={supplier.delivery} />
        <Metric icon={<DollarSign size={14} />} label="Cost" value={supplier.cost} />
        <Metric icon={<FileText size={14} />} label="Sustainability" value={supplier.sustainability} />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
        Risk level: <span className="font-semibold capitalize text-slate-800">{supplier.risk}</span>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center gap-2 text-slate-500">{icon}<span>{label}</span></div>
      <div className="font-semibold text-slate-800">{value}</div>
    </div>
  );
}
