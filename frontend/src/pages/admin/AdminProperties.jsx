import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../../services/propertyService';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  ShieldCheck, CheckCircle2, XCircle, Clock, Eye,
  AlertCircle, Search, Filter, ArrowLeft, Building2,
  FileCheck, X
} from 'lucide-react';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [comments, setComments] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyService.adminGetAllProperties();
      setProperties(data);
    } catch (err) {
      setError(err.message || 'Failed to load properties for audit');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const openActionModal = (prop, status) => {
    setSelectedProperty(prop);
    setActionStatus(status);
    setComments(
      status === 'verified'
        ? 'Physical documents, lease agreement, and basic safety verified.'
        : status === 'rejected'
        ? 'Documentation mismatch or missing safety compliance.'
        : 'Listing expired or inactive.'
    );
  };

  const handleConfirmVerification = async () => {
    if (!selectedProperty || !actionStatus) return;
    setIsProcessing(true);
    try {
      await propertyService.adminVerifyProperty(selectedProperty.id, actionStatus, comments);
      setSelectedProperty(null);
      setActionStatus('');
      setComments('');
      await loadProperties();
    } catch (err) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.verification_status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.city?.toLowerCase().includes(term) ||
          p.locality?.toLowerCase().includes(term) ||
          p.owner_name?.toLowerCase().includes(term) ||
          p.owner_email?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [properties, statusFilter, searchTerm]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loader message="Loading platform properties for administrative verification..." />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Audit</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      case 'expired':
        return <Badge variant="default" size="sm">Expired</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <Link
            to="/admin"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-brand-600 transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Admin Overview
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Accommodation Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Validate property photos, address legitimacy, and assign verified trust badges.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-2xl self-start sm:self-auto">
          Total Accommodations: <span className="text-slate-900 font-black">{properties.length}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, locality, city, or owner name/email..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending Audit' },
              { id: 'verified', label: 'Verified' },
              { id: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Location</th>
                <th className="p-4">Host Details</th>
                <th className="p-4">Rent Range</th>
                <th className="p-4">Audit Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
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
                    <td className="p-4 text-slate-600">
                      <div className="font-bold text-slate-800">{p.owner_name}</div>
                      <div className="text-[11px] text-slate-400">{p.owner_email}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      ₹{Number(p.min_rent).toLocaleString('en-IN')} - ₹{Number(p.max_rent).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(p.verification_status)}
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        to={`/properties/${p.id}`}
                        className="inline-block p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        title="Inspect Public Listing"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </Link>

                      {p.verification_status !== 'verified' && (
                        <button
                          onClick={() => openActionModal(p, 'verified')}
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
                        >
                          Verify
                        </button>
                      )}

                      {p.verification_status !== 'rejected' && (
                        <button
                          onClick={() => openActionModal(p, 'rejected')}
                          className="px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
                        >
                          Reject
                        </button>
                      )}

                      {p.verification_status !== 'expired' && (
                        <button
                          onClick={() => openActionModal(p, 'expired')}
                          className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition"
                        >
                          Expire
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-slate-400">
                    No accommodations found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Action Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-black text-slate-900">
                  Audit Decision: <span className="uppercase text-brand-600">{actionStatus}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are updating verification status for <strong>{selectedProperty.title}</strong> to{' '}
              <strong className="uppercase">{actionStatus}</strong>. This status change will be logged in the permanent audit trail.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Audit Comments / Remarks</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide reason or audit check details..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSelectedProperty(null); setActionStatus(''); }}
              >
                Cancel
              </Button>
              <Button
                variant={actionStatus === 'rejected' ? 'danger' : 'primary'}
                size="sm"
                isLoading={isProcessing}
                onClick={handleConfirmVerification}
              >
                Confirm {actionStatus}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}