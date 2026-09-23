import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../../services/propertyService';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { PlusCircle, Building2, MapPin, Edit3, Trash2, Eye, AlertCircle } from 'lucide-react';

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
    return <Loader message="Loading your properties..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Properties</h1>
          <p className="text-sm text-slate-500 mt-1">Manage listings, rooms inventory, and property metadata</p>
        </div>
        <Link to="/owner/properties/new">
          <Button variant="primary" className="flex items-center space-x-1.5 shadow-md shadow-brand-500/20">
            <PlusCircle className="w-4 h-4" />
            <span>Add New Property</span>
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No properties listed yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Get started by adding your first accommodation listing. You can configure room types and amenities right after.
          </p>
          <Link to="/owner/properties/new">
            <Button variant="primary" size="sm">Add First Property</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={p.verification_status === 'verified' ? 'success' : 'default'} size="sm">
                    {p.verification_status === 'verified' ? 'Verified' : 'Pending Verification'}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">{p.room_count || 0} rooms</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                <p className="text-xs text-slate-500 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                  <span>{p.locality}, {p.city}</span>
                </p>
                <div className="text-xs text-slate-700 font-semibold pt-1">
                  ₹{Number(p.min_rent).toLocaleString('en-IN')} - ₹{Number(p.max_rent).toLocaleString('en-IN')}/mo
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/properties/${p.id}`}
                  className="text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/owner/properties/${p.id}/edit`}
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Manage</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
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