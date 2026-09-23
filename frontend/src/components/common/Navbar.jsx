import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Building2, Search, SlidersHorizontal, Heart, Menu, X, Home, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from './Badge';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'warning';
      case 'owner': return 'brand';
      default: return 'info';
    }
  };

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
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Dynamic Role Portal Shortcut */}
                {hasRole('admin') && (
                  <NavLink to="/admin" className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md hover:bg-amber-100">
                    Admin Portal
                  </NavLink>
                )}
                {hasRole('owner') && (
                  <NavLink to="/owner" className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-md hover:bg-brand-100">
                    Owner Portal
                  </NavLink>
                )}
                {hasRole('customer', 'tenant') && (
                  <NavLink to="/dashboard" className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md hover:bg-indigo-100">
                    Tenant Portal
                  </NavLink>
                )}

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <UserCircle className="w-5 h-5 text-slate-400" />
                  <div className="text-left text-xs">
                    <span className="font-semibold text-slate-800 block truncate max-w-[120px]">{user?.name}</span>
                    <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
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
            )}
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

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between px-3 py-1">
                <div>
                  <div className="text-sm font-bold text-slate-800">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
                <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                  {user?.role}
                </Badge>
              </div>

              {hasRole('customer', 'tenant') && (
                <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                  Tenant Dashboard
                </NavLink>
              )}
              {hasRole('owner') && (
                <NavLink to="/owner" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                  Owner Portal
                </NavLink>
              )}
              {hasRole('admin') && (
                <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                  Admin Portal
                </NavLink>
              )}

              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left flex items-center space-x-2 text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </header>
  );
}