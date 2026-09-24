import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import PropertyCard from '../components/common/PropertyCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { Heart, ArrowRight, Building2, Sparkles } from 'lucide-react';

export default function Favorites() {
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        setIsLoading(true);
        const saved = localStorage.getItem('roomverse_favorites');
        const favIds = saved ? JSON.parse(saved) : [];

        if (Array.isArray(favIds) && favIds.length > 0) {
          const allProperties = await propertyService.getProperties();
          const filtered = allProperties.filter((p) => favIds.includes(p.id));
          setFavoriteProperties(filtered);
        } else {
          setFavoriteProperties([]);
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFavorites();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Shortlisted Places</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Saved Favorites
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quick access to accommodations you shortlisted for fast living cost comparisons.
          </p>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2.5 rounded-xl transition self-start sm:self-auto"
        >
          <span>Explore More Stays</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-16 rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-rose-100 text-rose-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Your Shortlist is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Whenever you see an accommodation that catches your eye, tap the heart button on the top-right to save it here.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition"
          >
            <span>Browse Accommodations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
