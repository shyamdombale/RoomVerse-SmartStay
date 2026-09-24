import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import propertyService from '../services/propertyService';
import PropertyCard from '../components/common/PropertyCard';
import SkeletonCard from '../components/common/SkeletonCard';
import Badge from '../components/common/Badge';
import {
  Search, SlidersHorizontal, MapPin, Building2,
  AlertCircle, Sparkles, Filter, X
} from 'lucide-react';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Local Filter Controls
  const [searchTerm, setSearchTerm] = useState(searchParams.get('city') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('type') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedGender, setSelectedGender] = useState('all');

  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoading(true);
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

  // Filtered & Sorted Properties List
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Filter by Search Keyword (City, Locality, or Title)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.city?.toLowerCase().includes(term) ||
          p.locality?.toLowerCase().includes(term)
      );
    }

    // Filter by Property Type Category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.property_type?.toLowerCase() === activeCategory);
    }

    // Filter by Gender
    if (selectedGender !== 'all') {
      result = result.filter(
        (p) => p.gender_preference?.toLowerCase() === selectedGender || p.gender_preference?.toLowerCase() === 'unisex'
      );
    }

    // Sort Order
    if (sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.min_rent) - Number(b.min_rent));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.min_rent) - Number(a.min_rent));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.avg_rating) || 4.8) - (Number(a.avg_rating) || 4.8));
    }

    return result;
  }, [properties, searchTerm, activeCategory, selectedGender, sortBy]);

  const categories = [
    { id: 'all', label: 'All Accommodations' },
    { id: 'pg', label: 'PG / Co-Living' },
    { id: 'hostel', label: 'Student Hostels' },
    { id: 'apartment', label: 'Flats & Apartments' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Verified Accommodations</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Explore Verified Stays
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Browse student hostels, PG rooms, and shared apartments with upfront living cost breakdowns and live room availability.
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city, locality, or property name..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Gender Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Gender:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="all">All Genders</option>
              <option value="male">Boys Only</option>
              <option value="female">Girls Only</option>
              <option value="unisex">Co-ed / Unisex</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/25'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredProperties.length}</strong>{' '}
          {filteredProperties.length === 1 ? 'accommodation' : 'accommodations'}
        </span>
        {searchTerm && (
          <span className="text-brand-600 font-semibold">
            Filtered by "{searchTerm}"
          </span>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-700 text-sm">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          {(error.toLowerCase().includes('token') || error.toLowerCase().includes('auth') || error.toLowerCase().includes('sign in')) && (
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700 transition self-start sm:self-auto"
            >
              Sign In to View Listings
            </Link>
          )}
        </div>
      )}

      {/* Properties Grid or Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-16 rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
          <Building2 className="w-14 h-14 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">No matching accommodations found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any properties matching your current search criteria. Try clearing some filters or searching a broader location.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
              setSelectedGender('all');
            }}
            className="px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl text-xs font-bold transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}