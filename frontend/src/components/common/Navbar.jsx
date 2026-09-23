import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Building2, Search, SlidersHorizontal, Heart, User, Menu, X, ShieldAlert, Home } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center text-sm font-medium px-3 py-2 rounded-md transition-colors ${
      isActive
        ? 'text-brand-600 bg-brand-50 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? 'text-brand-600 bg-brand-50 font-semibold'
        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Room<span className="text-brand-600">Verse</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/" className={navLinkClass}>
                <Home className="w-4 h-4 mr-1.5" />
                Home
              </NavLink>
              <NavLink to="/properties" className={navLinkClass}>
                <Search className="w-4 h-4 mr-1.5" />
                Explore
              </NavLink>
              <NavLink to="/compare" className={navLinkClass}>
                <SlidersHorizontal className="w-4 h-4 mr-1.5" />
                Compare
              </NavLink>
              <NavLink to="/favorites" className={navLinkClass}>
                <Heart className="w-4 h-4 mr-1.5" />
                Favorites
              </NavLink>
            </nav>
          </div>

          {/* Desktop Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Portals dropdown/links */}
            <div className="flex items-center space-x-1 border-r border-slate-200 pr-3">
              <NavLink to="/dashboard" className="text-xs font-medium text-slate-600 hover:text-brand-600 px-2 py-1 rounded">
                Tenant
              </NavLink>
              <NavLink to="/owner" className="text-xs font-medium text-slate-600 hover:text-brand-600 px-2 py-1 rounded">
                Owner
              </NavLink>
              <NavLink to="/admin" className="text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-1 rounded">
                Admin
              </NavLink>
            </div>

            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-brand-600 px-3 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg shadow-sm transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/properties" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Explore Properties
          </NavLink>
          <NavLink to="/compare" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Compare Properties
          </NavLink>
          <NavLink to="/favorites" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Favorites
          </NavLink>
          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
              Portals
            </div>
            <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              Tenant Dashboard
            </NavLink>
            <NavLink to="/owner" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              Owner Portal
            </NavLink>
            <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              Admin Portal
            </NavLink>
          </div>
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm font-medium border border-slate-300 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm font-medium bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
