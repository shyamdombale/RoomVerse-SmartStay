import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, ShieldCheck, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12">
        <div className="inline-flex items-center space-x-2 bg-brand-50 border border-brand-200 text-brand-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6">
          <Badge variant="brand" size="sm">Phase 2 Ready</Badge>
          <span>Cloud-Enabled Smart PG & Accommodation Management</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Find, Verify & Calculate Total Cost for <span className="text-brand-600">Your Next Stay</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          No hidden electricity bills, no surprise maintenance, and no outdated listings.
          RoomVerse provides realistic accommodation discovery with explainable monthly costs.
        </p>

        {/* Quick Search Bar Placeholder */}
        <div className="mt-8 max-w-2xl mx-auto bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center px-3 py-2 w-full text-slate-400">
            <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              readOnly
              placeholder="Search by city (e.g. Pune, Bengaluru, Delhi NCR)..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none cursor-default"
            />
          </div>
          <Link to="/properties" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center space-x-2">
              <span>Explore Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Admin Verified Listings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every property undergoes admin workflow approval with timestamped badges to eliminate fake listings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Total Monthly Cost Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculates transparent total expenditure: Rent + Food + Maintenance + Electricity + Daily Commute.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Atomic Room Availability</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time room and bed-level inventory tracking (`Available`, `Reserved`, `Occupied`, `Maintenance`).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
