import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import {
  ShieldCheck, CheckCircle2, XCircle, Clock,
  AlertTriangle, Building2, ArrowRight, Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setIsLoading(true);
        const data = await propertyService.adminGetAllProperties();
        setProperties(data);
      } catch (err) {
        console.error('Failed to load admin properties:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loader message="Loading platform compliance & verification statistics..." />
      </div>
    );
  }

  const pendingCount = properties.filter((p) => p.verification_status === 'pending').length;
  const verifiedCount = properties.filter((p) => p.verification_status === 'verified').length;
  const rejectedCount = properties.filter((p) => p.verification_status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Oversight & Trust Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Admin Verification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Audit newly registered accommodations, verify host credentials, and maintain platform quality standards.
          </p>
        </div>

        <Link
          to="/admin/properties"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition self-start sm:self-auto"
        >
          <span>Open Moderation Queue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Audit
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-amber-600 block">{pendingCount}</span>
          <span className="text-[11px] text-slate-500 block">Listings awaiting manual verification</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verified & Live
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-600 block">{verifiedCount}</span>
          <span className="text-[11px] text-slate-500 block">Live with verified trust badges</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Rejected Listings
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-rose-600 block">{rejectedCount}</span>
          <span className="text-[11px] text-slate-500 block">Blocked due to documentation mismatch</span>
        </div>
      </div>

      {/* Moderation Queue Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Pending Review Queue</h3>
            <p className="text-xs text-slate-500 mt-0.5">Accommodations submitted by hosts awaiting admin audit</p>
          </div>
          <Link
            to="/admin/properties"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>All Moderations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Location</th>
                <th className="p-4">Owner Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-[11px] text-slate-400 capitalize">{p.property_type} • {p.gender_preference}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div>{p.locality}</div>
                    <div className="text-[11px] text-slate-400">{p.city}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div className="font-semibold text-slate-800">{p.owner_name}</div>
                    <div className="text-[11px] text-slate-400">{p.owner_email}</div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={p.verification_status === 'verified' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {p.verification_status === 'verified' ? 'Verified' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to="/admin/properties"
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs inline-flex items-center space-x-1 transition"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
