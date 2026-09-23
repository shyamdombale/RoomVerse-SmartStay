import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../../services/propertyService';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Eye, AlertCircle } from 'lucide-react';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [comments, setComments] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
    setComments('');
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

  if (isLoading) {
    return <Loader message="Loading platform properties for admin audit..." />;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified': return <Badge variant="success" size="sm">Verified</Badge>;
      case 'pending': return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'rejected': return <Badge variant="danger" size="sm">Rejected</Badge>;
      case 'expired': return <Badge variant="default" size="sm">Expired</Badge>;
      default: return <Badge size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Property Moderation & Verification</h1>
          <p className="text-sm text-slate-500 mt-1">Audit accommodations, verify documents, and enforce platform trust</p>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total Listings: <span className="text-slate-900 font-bold">{properties.length}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Location</th>
                <th className="p-4">Owner / Host</th>
                <th className="p-4">Rent Range</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{p.title}</div>
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
                  <td className="p-4 font-bold text-slate-800">
                    ₹{Number(p.min_rent).toLocaleString('en-IN')} - ₹{Number(p.max_rent).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(p.verification_status)}
                  </td>
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    <Link
                      to={`/properties/${p.id}`}
                      className="inline-block p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                      title="Inspect Listing"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </Link>

                    {p.verification_status !== 'verified' && (
                      <button
                        onClick={() => openActionModal(p, 'verified')}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
                      >
                        Verify
                      </button>
                    )}

                    {p.verification_status !== 'rejected' && (
                      <button
                        onClick={() => openActionModal(p, 'rejected')}
                        className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg"
                      >
                        Reject
                      </button>
                    )}

                    {p.verification_status !== 'expired' && (
                      <button
                        onClick={() => openActionModal(p, 'expired')}
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
                      >
                        Expire
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Action Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Action: <span className="uppercase text-brand-600">{actionStatus}</span>
            </h3>
            <p className="text-xs text-slate-500">
              You are setting the verification status for <strong>{selectedProperty.title}</strong> to{' '}
              <strong className="uppercase">{actionStatus}</strong>. This action will be logged in the permanent audit trail.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Audit Comments / Reason</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="e.g. Fire safety clearance validated, occupancy certificates matched..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
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