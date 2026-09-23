import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import {
  MapPin, ShieldCheck, ArrowLeft, Building2, User,
  Utensils, Zap, Wrench, Shield, Check, AlertCircle, Bed
} from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError(err.message || 'Failed to load property details');
      } finally {
        setIsLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  if (isLoading) {
    return <Loader message="Loading property details and room inventory..." />;
  }

  if (error || !property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm mb-4 inline-block">
          {error || 'Property not found'}
        </div>
        <div>
          <Link to="/properties" className="text-xs font-semibold text-brand-600 hover:underline">
            ← Back to all properties
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available': return <Badge variant="success" size="sm">Available</Badge>;
      case 'reserved': return <Badge variant="warning" size="sm">Reserved</Badge>;
      case 'occupied': return <Badge variant="danger" size="sm">Occupied</Badge>;
      case 'maintenance': return <Badge variant="default" size="sm">Maintenance</Badge>;
      default: return <Badge size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/properties" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-600 transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Properties
      </Link>

      {/* Header Info */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={property.verification_status === 'verified' ? 'success' : 'default'}>
              {property.verification_status === 'verified' ? 'Verified Accommodation' : 'Pending Verification'}
            </Badge>
            <Badge variant="brand">{property.property_type.toUpperCase()}</Badge>
            <Badge variant="info">Gender: {property.gender_preference.toUpperCase()}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-slate-400 flex-shrink-0" />
            <span>{property.address}, {property.locality}, {property.city} {property.pincode && `— ${property.pincode}`}</span>
          </p>
        </div>

        <div className="text-left md:text-right bg-brand-50/50 p-4 rounded-xl border border-brand-100">
          <span className="text-xs text-slate-500 block font-medium">Monthly Rent Range</span>
          <span className="text-2xl font-black text-brand-600">
            ₹{Number(property.min_rent).toLocaleString('en-IN')} - ₹{Number(property.max_rent).toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">Deposit: ₹{Number(property.security_deposit).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Image Gallery */}
      {property.images && property.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {property.images.map((img, idx) => (
            <div key={img.id || idx} className="h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img src={img.image_url} alt={img.caption || property.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Grid: Details & Room Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description, Living Costs & Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description & Rules */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About the Property</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description || 'No description provided.'}
            </p>
            {property.rules && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">House Rules</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{property.rules}</p>
              </div>
            )}
          </div>

          {/* Living Cost Components */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Monthly Expense Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 block">Est. Maintenance</span>
                <span className="text-base font-bold text-slate-800 mt-1 block">
                  ₹{Number(property.estimated_maintenance).toLocaleString('en-IN')}/mo
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 block">Est. Food Charges</span>
                <span className="text-base font-bold text-slate-800 mt-1 block">
                  {property.food_available ? `₹${Number(property.estimated_food_charge).toLocaleString('en-IN')}/mo` : 'Not Included'}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 block">Est. Electricity</span>
                <span className="text-base font-bold text-slate-800 mt-1 block">
                  ₹{Number(property.estimated_electricity_charge).toLocaleString('en-IN')}/mo
                </span>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Available Amenities</h2>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((a) => (
                  <div key={a.id} className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span className="font-medium">{a.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No amenities listed yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Rooms Inventory & Owner Details */}
        <div className="space-y-6">
          {/* Rooms Inventory */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Room Options</h2>
              <span className="text-xs text-slate-400 font-medium">{property.rooms?.length || 0} configurations</span>
            </div>

            <div className="space-y-3">
              {property.rooms && property.rooms.length > 0 ? (
                property.rooms.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{r.room_number_name}</span>
                      {getStatusBadge(r.status)}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <Bed className="w-3.5 h-3.5" />
                      <span>{r.room_type.toUpperCase()} • {r.is_ac ? 'AC' : 'Non-AC'} • {r.is_furnished ? 'Furnished' : 'Unfurnished'}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Capacity: {r.available_capacity}/{r.total_capacity} beds</span>
                      <span className="font-bold text-brand-600 text-sm">₹{Number(r.monthly_rent).toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No rooms added yet.</p>
              )}
            </div>
          </div>

          {/* Owner Profile Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Host</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{property.owner_name}</h4>
                <p className="text-xs text-slate-500">{property.owner_email}</p>
                {property.owner_phone && <p className="text-xs text-slate-400">{property.owner_phone}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}