import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import {
  Building2, Users, DollarSign, PlusCircle, ShieldCheck,
  CheckCircle2, Clock, AlertTriangle, ArrowRight, Eye, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOwnerData() {
      try {
        setIsLoading(true);
        const data = await propertyService.getProperties({ my: true });
        setProperties(data);
      } catch (err) {
        console.error('Failed to load owner properties:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOwnerData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loader message="Loading your owner portfolio and occupancy metrics..." />
      </div>
    );
  }

  // Calculate live statistics
  const totalProperties = properties.length;
  const verifiedProperties = properties.filter((p) => p.verification_status === 'verified').length;
  const pendingProperties = properties.filter((p) => p.verification_status === 'pending').length;
  const totalRooms = properties.reduce((acc, curr) => acc + (Number(curr.room_count) || 0), 0);
  const totalMinRent = properties.reduce((acc, curr) => acc + (Number(curr.min_rent) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-bold border border-white/10">
            <Building2 className="w-3.5 h-3.5" />
            <span>Host Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Property Host'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitor property verification status, room availability, and expand your accommodation portfolio.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/owner/properties/new"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-600/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Property</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Properties
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 block">{totalProperties}</span>
          <span className="text-[11px] text-slate-500 block">Listed in your portfolio</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verified & Live
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-600 block">{verifiedProperties}</span>
          <span className="text-[11px] text-slate-500 block">Visible in public search</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Audit
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-amber-600 block">{pendingProperties}</span>
          <span className="text-[11px] text-slate-500 block">Awaiting admin clearance</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Room Types
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-indigo-600 block">{totalRooms}</span>
          <span className="text-[11px] text-slate-500 block">Active room configurations</span>
        </div>
      </div>

      {/* Properties List Table / Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Your Accommodation Listings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage room inventory, photo galleries, and living costs</p>
          </div>
          <Link
            to="/owner/properties"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>Full Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No properties listed yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by listing your hostel, PG, or apartment with zero middleman brokerage.
            </p>
            <Link
              to="/owner/properties/new"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List First Property</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Rent Range</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {p.property_type} • {p.gender_preference}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{p.locality}</div>
                      <div className="text-[11px] text-slate-400">{p.city}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      ₹{Number(p.min_rent).toLocaleString('en-IN')} - ₹{Number(p.max_rent).toLocaleString('en-IN')}/mo
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={p.verification_status === 'verified' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {p.verification_status === 'verified' ? 'Verified' : 'Pending Audit'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/properties/${p.id}`}
                        className="p-1.5 inline-block text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </Link>
                      <Link
                        to={`/owner/properties/${p.id}/edit`}
                        className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-xs inline-flex items-center space-x-1 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
