import React from 'react';
import { Building2, Users, DollarSign, PlusCircle } from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function OwnerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Property Owner Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Manage listings, track room availability, and review booking applications</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="brand">Owner Portal</Badge>
          <Button variant="primary" disabled size="sm" className="flex items-center space-x-1.5">
            <PlusCircle className="w-4 h-4" />
            <span>Add Property (Phase 6)</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Total Listings</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">0</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Pending Enquiries</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">0</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Occupancy Rate</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">0%</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Monthly Inflow</span>
          <span className="text-2xl font-black text-brand-600 mt-1 block">₹0</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
        <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500">
          Owner property creation, room inventory management, and applicant reviews will be enabled in Phases 6, 8, and 13.
        </p>
      </div>
    </div>
  );
}
