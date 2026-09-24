import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Heart, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-auto border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 text-white">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Room<span className="text-brand-400">Verse</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              RoomVerse is a cloud-ready smart rental, PG, and accommodation management platform.
              We eliminate hidden charges through transparent total living cost calculations and 100% physical property verification.
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>100% Admin Verified Listings & Physical Audits</span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-400 font-medium">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>Zero Brokerage Fees for Students & Professionals</span>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/properties" className="hover:text-white transition">Browse All Rooms</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition">Compare Living Costs</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition">Saved Favorites</Link>
              </li>
              <li>
                <Link to="/properties?city=pune" className="hover:text-white transition">Accommodations in Pune</Link>
              </li>
              <li>
                <Link to="/properties?city=bengaluru" className="hover:text-white transition">Accommodations in Bengaluru</Link>
              </li>
            </ul>
          </div>

          {/* For Hosts & Owners */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Hosts & Owners
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/owner/properties/new" className="text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1">
                  <span>List Your Property</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/owner" className="hover:text-white transition">Owner Dashboard</Link>
              </li>
              <li>
                <Link to="/owner/properties" className="hover:text-white transition">Room Inventory Manager</Link>
              </li>
              <li>
                <span className="text-slate-500">Zero Commission Policy</span>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Portals & Access
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/login" className="hover:text-white transition">Sign In to Account</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">Create Free Account</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">Tenant Portal</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">Admin Verification Portal</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RoomVerse Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
