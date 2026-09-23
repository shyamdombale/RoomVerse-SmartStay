import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white font-bold text-lg">
              <Building2 className="w-6 h-6 text-brand-400" />
              <span>RoomVerse</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cloud-based smart rental, PG, and accommodation management platform for students and working professionals.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Admin Verified Accommodations</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/properties" className="hover:text-white transition">Browse All Properties</Link></li>
              <li><Link to="/compare" className="hover:text-white transition">Property Comparison</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition">Saved Favorites</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-white transition">Tenant Dashboard</Link></li>
              <li><Link to="/owner" className="hover:text-white transition">Property Owner Portal</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Admin Verification Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Free Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RoomVerse Platform. Built with modern full-stack engineering standards.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Designed for Students & Professionals</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
