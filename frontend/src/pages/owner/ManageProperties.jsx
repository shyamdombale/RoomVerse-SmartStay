import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../../services/propertyService';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { PlusCircle, Building2, MapPin, Edit3, Trash2, Eye, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyService.getProperties({ my: true });
      setProperties(data);
    } catch (err) {
      setError(err.message || 'Failed to load your properties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This will remove all associated rooms and images.`)) {
      return;
    }

    try {
      await propertyService.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete property');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loader message="Loading your accommodation inventory..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <Link to="/owner" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-brand-600 transition mb-1">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Accommodation Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure room types, assign amenities, update photo galleries, and monitor verification status.
          </p>
        </div>

        <Link
          to="/owner/properties/new"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
          <Building2 className="w-14 h-14 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No properties listed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by adding your first accommodation listing. You can configure room inventory right after.
            </p>
          </div>
          <Link
            to="/owner/properties/new"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List First Property</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={p.verification_status === 'verified' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {p.verification_status === 'verified' ? 'Verified' : 'Pending Audit'}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {p.room_count || 0} rooms
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 line-clamp-1">{p.title}</h3>

                <p className="text-xs text-slate-500 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-brand-600 flex-shrink-0" />
                  <span>{p.locality}, {p.city}</span>
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Rent Range:</span>
                  <span className="font-bold text-brand-600">
                    ₹{Number(p.min_rent).toLocaleString('en-IN')} - ₹{Number(p.max_rent).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/properties/${p.id}`}
                  className="text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/owner/properties/${p.id}/edit`}
                    className="bg-brand-50 text-brand-700 hover:bg-brand-100 px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Manage</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                    title="Delete Property"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}