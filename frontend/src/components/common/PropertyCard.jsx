import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Star, ShieldCheck, Heart, ArrowUpRight,
  Wifi, Utensils, Zap, Bed, Sparkles, Building2
} from 'lucide-react';
import Badge from './Badge';

export default function PropertyCard({ property }) {
  const [isFavorited, setIsFavorited] = useState(() => {
    try {
      const saved = localStorage.getItem('roomverse_favorites');
      if (!saved) return false;
      const ids = JSON.parse(saved);
      return Array.isArray(ids) && ids.includes(property?.id);
    } catch {
      return false;
    }
  });

  if (!property) return null;

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('roomverse_favorites');
      let ids = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(ids)) ids = [];

      if (isFavorited) {
        ids = ids.filter((favId) => favId !== property.id);
        setIsFavorited(false);
      } else {
        ids.push(property.id);
        setIsFavorited(true);
      }
      localStorage.setItem('roomverse_favorites', JSON.stringify(ids));
    } catch (err) {
      setIsFavorited(!isFavorited);
    }
  };

  // Calculate estimated total monthly cost
  const baseRent = Number(property.min_rent) || 0;
  const maintenance = Number(property.estimated_maintenance) || 0;
  const food = property.food_available ? (Number(property.estimated_food_charge) || 0) : 0;
  const electricity = Number(property.estimated_electricity_charge) || 0;
  const totalEstimatedCost = baseRent + maintenance + food + electricity;

  // Derive rating (use default 4.8 if not provided)
  const rating = property.avg_rating ? Number(property.avg_rating).toFixed(1) : '4.8';

  // Room count / availability text
  const roomCount = property.room_count ?? (property.rooms ? property.rooms.length : 0);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image Header with Hover Zoom */}
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
        {property.primary_image_url ? (
          <img
            src={property.primary_image_url}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-brand-50/50 text-slate-400">
            <Building2 className="w-12 h-12 text-brand-300 stroke-[1.5]" />
            <span className="text-xs text-slate-400 mt-2 font-medium">RoomVerse Accommodation</span>
          </div>
        )}

        {/* Gradient Scrim for readable badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            {property.verification_status === 'verified' ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/95 text-white shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/95 text-white shadow-sm backdrop-blur-md">
                <span>Pending Audit</span>
              </span>
            )}

            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 shadow-sm backdrop-blur-md capitalize">
              {property.property_type || 'PG'}
            </span>
          </div>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleFavoriteToggle}
            aria-label="Save to favorites"
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500 flex items-center justify-center shadow-md backdrop-blur-md transition-transform active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              }`}
            />
          </button>
        </div>

        {/* Bottom Image Overlay: Gender & Availability */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-medium pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[11px] capitalize">
            {property.gender_preference ? `${property.gender_preference} only` : 'Co-ed'}
          </span>

          <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{roomCount > 0 ? `${roomCount} Rooms Listed` : 'Available Now'}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating & City Category */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-brand-600 flex-shrink-0" />
              <span className="line-clamp-1">{property.locality}, {property.city}</span>
            </div>
            <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold text-[11px] border border-amber-200/60">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/properties/${property.id}`} className="group-hover:text-brand-600 transition-colors">
            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Quick Amenities Preview Chips */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {property.food_available && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                <Utensils className="w-3 h-3 text-slate-500" />
                <span>Food/Meals</span>
              </span>
            )}
            <span className="inline-flex items-center space-x-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              <Wifi className="w-3 h-3 text-slate-500" />
              <span>WiFi</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              <Zap className="w-3 h-3 text-slate-500" />
              <span>Power Backup</span>
            </span>
          </div>
        </div>

        {/* Pricing & CTA Section */}
        <div className="pt-3.5 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-brand-600 tracking-tight">
                ₹{baseRent.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 font-medium">/month</span>
            </div>

            {/* Total Estimated Cost breakdown preview */}
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1" title="Estimated Base Rent + Food + Maintenance + Electricity">
              <span className="text-slate-400">Total Est:</span>
              <span className="font-semibold text-slate-700">₹{totalEstimatedCost.toLocaleString('en-IN')}/mo</span>
            </div>
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-600 hover:text-white px-3.5 py-2 rounded-xl transition-all duration-200 group/btn shadow-sm"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
