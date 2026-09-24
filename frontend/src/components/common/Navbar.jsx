import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2, Search, SlidersHorizontal, Heart, Menu, X,
  LogOut, UserCircle, Shield, PlusCircle, Sparkles, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from './Badge';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll listener for sticky blur & elevation effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `relative inline-flex items-center text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 ${
      isActive
        ? 'text-brand-700 bg-brand-50/80 font-bold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'text-brand-700 bg-brand-50 font-bold'
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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80'
          : 'bg-white/70 backdrop-blur-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  Room<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Verse</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                  Smart Living
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink to="/properties" className={navLinkClass}>
                <Search className="w-4 h-4 mr-1.5 text-slate-400" />
                Explore
              </NavLink>
              <NavLink to="/compare" className={navLinkClass}>
                <SlidersHorizontal className="w-4 h-4 mr-1.5 text-slate-400" />
                Compare
              </NavLink>
              <NavLink to="/favorites" className={navLinkClass}>
                <Heart className="w-4 h-4 mr-1.5 text-slate-400" />
                Favorites
              </NavLink>
              <Link
                to={isAuthenticated && hasRole('owner') ? '/owner' : '/register?role=owner'}
                className="inline-flex items-center text-sm font-semibold px-3.5 py-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 transition-all duration-200"
              >
                <span>For Owners</span>
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  0% Fee
                </span>
              </Link>
            </nav>
          </div>

          {/* Desktop Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Role Specific Shortcuts */}
                {hasRole('owner') && (
                  <Link
                    to="/owner/properties/new"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 px-3.5 py-2 rounded-xl shadow-sm transition-all duration-200"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>List Property</span>
                  </Link>
                )}

                {hasRole('admin') && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin Console</span>
                  </Link>
                )}

                {/* User Profile Pill / Dropdown Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2.5 pl-3 pr-2 py-1.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:bg-slate-50/80 transition-all bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-100 to-indigo-100 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left hidden sm:block">
                      <span className="font-bold text-slate-800 text-xs block leading-tight truncate max-w-[120px]">
                        {user?.name}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {user?.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        <div className="mt-1">
                          <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                            {user?.role}
                          </Badge>
                        </div>
                      </div>

                      <div className="py-1">
                        {hasRole('customer', 'tenant') && (
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                          >
                            Tenant Dashboard
                          </Link>
                        )}
                        {hasRole('owner') && (
                          <>
                            <Link
                              to="/owner"
                              className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                            >
                              Owner Dashboard
                            </Link>
                            <Link
                              to="/owner/properties"
                              className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                            >
                              My Properties
                            </Link>
                          </>
                        )}
                        {hasRole('admin') && (
                          <Link
                            to="/admin/properties"
                            className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                          >
                            Verification Queue
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {isAuthenticated && (
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 shadow-xl animate-slide-up">
          <NavLink to="/" className={mobileNavLinkClass}>
            <span>Home</span>
          </NavLink>
          <NavLink to="/properties" className={mobileNavLinkClass}>
            <Search className="w-4 h-4 text-slate-400" />
            <span>Explore Accommodations</span>
          </NavLink>
          <NavLink to="/compare" className={mobileNavLinkClass}>
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Compare Listings</span>
          </NavLink>
          <NavLink to="/favorites" className={mobileNavLinkClass}>
            <Heart className="w-4 h-4 text-slate-400" />
            <span>Saved Favorites</span>
          </NavLink>

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{user?.name}</div>
                    <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
                  <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                    {user?.role}
                  </Badge>
                </div>

                {hasRole('customer', 'tenant') && (
                  <NavLink to="/dashboard" className={mobileNavLinkClass}>
                    <span>Tenant Dashboard</span>
                  </NavLink>
                )}
                {hasRole('owner') && (
                  <>
                    <NavLink to="/owner" className={mobileNavLinkClass}>
                      <span>Owner Dashboard</span>
                    </NavLink>
                    <NavLink to="/owner/properties/new" className={mobileNavLinkClass}>
                      <PlusCircle className="w-4 h-4 text-brand-600" />
                      <span>List New Property</span>
                    </NavLink>
                  </>
                )}
                {hasRole('admin') && (
                  <NavLink to="/admin" className={mobileNavLinkClass}>
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Admin Moderation Console</span>
                  </NavLink>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 text-rose-600 px-3.5 py-2.5 rounded-xl hover:bg-rose-50 text-sm font-semibold transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  className="text-center text-sm font-semibold border border-slate-200 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-center text-sm font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 text-white py-2.5 rounded-xl shadow-md transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}