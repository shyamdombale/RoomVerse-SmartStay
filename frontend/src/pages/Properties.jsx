import React from 'react';
import { Search, SlidersHorizontal, MapPin, IndianRupee } from 'lucide-react';
import Badge from '../components/common/Badge';

export default function Properties() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Accommodations</h1>
          <p className="text-sm text-slate-500 mt-1">Verified student hostels, PG rooms, and shared apartments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="brand">Multi-Filter Engine (Phase 7)</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar Skeleton */}
        <aside className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-semibold text-sm text-slate-800 flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-brand-600" /> Filters
            </span>
            <span className="text-xs text-slate-400">Phase 7</span>
          </div>

          <div className="space-y-4 text-xs text-slate-600">
            <div>
              <label className="font-medium text-slate-700 block mb-1.5">City / Location</label>
              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-400">
                All Locations (Pune, Bengaluru, Delhi)
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1.5">Room Type</label>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2"><input type="checkbox" disabled /> <span>Single Occupancy</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" disabled /> <span>Double Sharing</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" disabled /> <span>Triple Sharing</span></label>
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1.5">Amenities</label>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2"><input type="checkbox" disabled /> <span>High-Speed Wi-Fi</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" disabled /> <span>Air Conditioning (AC)</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" disabled /> <span>Food Included</span></label>
              </div>
            </div>
          </div>
        </aside>

        {/* Listings Grid Placeholder */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center py-16">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Property Listings Scaffold</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Real MySQL property listings and filter query parameters will be integrated in Phase 6 & Phase 7.
            </p>
            <Badge variant="info">Phase 2 Route Skeleton Verified</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
