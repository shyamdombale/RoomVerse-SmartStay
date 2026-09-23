import React from 'react';
import { User, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import Badge from '../components/common/Badge';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tenant Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage active rental requests, visits, and monthly cost projections</p>
        </div>
        <Badge variant="brand">Tenant Portal</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Active Bookings</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">0</span>
          <span className="text-xs text-slate-500 mt-1 block">No active move-in requests</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Scheduled Visits</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">0</span>
          <span className="text-xs text-slate-500 mt-1 block">No upcoming property tours</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Estimated Monthly Outflow</span>
          <span className="text-2xl font-black text-brand-600 mt-1 block">₹0</span>
          <span className="text-xs text-slate-500 mt-1 block">Rent + Food + Utilities</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
        <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500">
          Booking status history and active tenant agreements will be displayed here in Phase 9.
        </p>
      </div>
    </div>
  );
}
