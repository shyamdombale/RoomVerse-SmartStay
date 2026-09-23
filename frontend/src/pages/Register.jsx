import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function Register() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join RoomVerse as a Student, Tenant, or Property Owner</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              disabled
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Role
            </label>
            <select disabled className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 cursor-not-allowed">
              <option>Tenant / Student</option>
              <option>Property Owner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              disabled
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg text-xs text-brand-700">
            <strong>Phase 2 Scaffolding</strong>: Registration workflow with bcrypt hashing will activate in Phase 5.
          </div>

          <Button variant="primary" disabled className="w-full py-2.5">
            Register Account (Phase 5)
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
