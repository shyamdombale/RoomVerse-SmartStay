import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import Badge from '../components/common/Badge';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Verification & Oversight</h1>
          <p className="text-sm text-slate-500 mt-1">Verify accommodations, moderate reports, and maintain platform integrity</p>
        </div>
        <Badge variant="warning">Admin Clearance</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Pending Verification</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">0</span>
          <span className="text-xs text-slate-500 mt-1 block">Listings awaiting audit</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Verified Properties</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">0</span>
          <span className="text-xs text-slate-500 mt-1 block">Live with verified badge</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Reported Listings</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">0</span>
          <span className="text-xs text-slate-500 mt-1 block">Flagged for review</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
        <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500">
          Admin verification approval queue, document verification logs, and platform management tools will be wired in Phase 14.
        </p>
      </div>
    </div>
  );
}
