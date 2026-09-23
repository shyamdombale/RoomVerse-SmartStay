import React from 'react';
import { Heart } from 'lucide-react';
import Badge from '../components/common/Badge';

export default function Favorites() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Favorites</h1>
          <p className="text-sm text-slate-500 mt-1">Quick access to shortlisted accommodations for easy booking</p>
        </div>
        <Badge variant="brand">Phase 10 Feature</Badge>
      </div>

      <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
        <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">Your Shortlist is Empty</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
          Click the heart icon on any property listing to save it here for fast comparison.
        </p>
        <Badge variant="default">Phase 2 Route Skeleton Active</Badge>
      </div>
    </div>
  );
}
