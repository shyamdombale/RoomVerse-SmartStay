import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to your RoomVerse account</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              disabled
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              disabled
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg text-xs text-brand-700">
            <strong>Phase 2 Scaffolding</strong>: Form inputs will be wired to the JWT authentication service in Phase 5.
          </div>

          <Button variant="primary" disabled className="w-full py-2.5">
            Sign In (Phase 5)
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
