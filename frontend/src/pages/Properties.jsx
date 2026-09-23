import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { MapPin, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await propertyService.getProperties();
        setProperties(data);
      } catch (err) {
        setError(err.message || 'Failed to load properties');
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, []);

  if (isLoading) {
    return <Loader message="Loading available accommodations..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Accommodations</h1>
          <p className="text-sm text-slate-500 mt-1">Verified student hostels, PG rooms, and shared apartments</p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{properties.length}</span> properties
        </div>
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
          <h3 className="text-base font-bold text-slate-700">No properties available</h3>
          <p className="text-xs text-slate-500 mt-1">Check back later or register as an owner to list your property.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                {p.primary_image_url ? (
                  <img
                    src={p.primary_image_url}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Building2 className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge variant={p.verification_status === 'verified' ? 'success' : 'default'} size="sm">
                    {p.verification_status === 'verified' ? 'Verified' : 'Pending Verification'}
                  </Badge>
                  <Badge variant="brand" size="sm">
                    {p.property_type.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                    <span>{p.locality}, {p.city}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
                    <span className="text-lg font-extrabold text-brand-600">₹{Number(p.min_rent).toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400"> /mo</span>
                  </div>

                  <Link
                    to={`/properties/${p.id}`}
                    className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3.5 py-2 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}