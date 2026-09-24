import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-56 w-full bg-slate-200 relative">
        <div className="absolute top-3.5 left-3.5 flex space-x-2">
          <div className="h-6 w-20 bg-slate-300 rounded-full" />
          <div className="h-6 w-14 bg-slate-300 rounded-full" />
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-10 bg-slate-200 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-slate-200 rounded" />
          <div className="flex space-x-2 pt-1">
            <div className="h-4 w-16 bg-slate-100 rounded" />
            <div className="h-4 w-14 bg-slate-100 rounded" />
            <div className="h-4 w-20 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Price & CTA Skeleton */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-5 w-24 bg-slate-200 rounded" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
          <div className="h-8 w-24 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
