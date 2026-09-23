import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, ArrowLeft, ShieldCheck, MapPin, Calculator, Calendar } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function PropertyDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/properties" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Listings
      </Link>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="success">Verified Property</Badge>
              <span className="text-xs text-slate-400">ID: {id}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Property Detail Overview</h1>
            <p className="text-xs text-slate-500 flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> Hinjewadi Phase 1, Pune, Maharashtra
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Starting From</span>
            <span className="text-2xl font-black text-brand-600">₹8,500</span>
            <span className="text-xs text-slate-500"> / month</span>
          </div>
        </div>

        <div className="p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
          <strong>Phase 2 Scaffolding</strong>: Room inventory list, cost calculator widget, photo gallery, and booking enquiry modal will be wired in Phases 6, 8, 9, and 11.
        </div>
      </div>
    </div>
  );
}
