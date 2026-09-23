import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Badge from '../components/common/Badge';

export default function Compare() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compare Properties</h1>
          <p className="text-sm text-slate-500 mt-1">Side-by-side comparison of rent, amenities, rules, and estimated total costs</p>
        </div>
        <Badge variant="brand">Phase 10 Feature</Badge>
      </div>

      <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
        <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">Property Comparison Matrix</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
          Select up to 4 properties from search results to evaluate rent vs living cost side-by-side.
        </p>
        <Badge variant="default">Phase 2 Route Skeleton Active</Badge>
      </div>
    </div>
  );
}
