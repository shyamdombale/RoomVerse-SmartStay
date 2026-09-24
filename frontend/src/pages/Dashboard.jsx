import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, CreditCard, ShieldCheck, Heart, Search, ArrowRight, Building2 } from 'lucide-react';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-bold border border-white/10">
            <User className="w-3.5 h-3.5" />
            <span>Tenant Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {user?.name || 'Tenant'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track your shortlisted accommodations, upcoming property visits, and monthly living budget.
          </p>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md transition self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          <span>Find Accommodations</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Saved Favorites
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <Link to="/favorites" className="text-3xl font-black text-slate-900 block hover:text-brand-600">
            View Shortlist
          </Link>
          <span className="text-[11px] text-slate-500 block">Accommodations saved for comparison</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Scheduled Tours
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 block">0</span>
          <span className="text-[11px] text-slate-500 block">No physical visits scheduled yet</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Projected Monthly Cost
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-brand-600 block">₹0</span>
          <span className="text-[11px] text-slate-500 block">Calculated once you select a stay</span>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Looking for a verified PG or shared flat?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Explore 100% verified listings with zero brokerage fees and transparent monthly living bills.</p>
          </div>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-xs transition whitespace-nowrap"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
