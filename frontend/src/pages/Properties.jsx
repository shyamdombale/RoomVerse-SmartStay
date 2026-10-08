import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import PropertyCard from '../components/common/PropertyCard';
import SkeletonCard from '../components/common/SkeletonCard';
import Badge from '../components/common/Badge';
import {
  Search, SlidersHorizontal, MapPin, Building2,
  AlertCircle, Sparkles, Filter, X, ChevronDown,
  ChevronLeft, ChevronRight, Check, RotateCcw,
  Zap, Utensils, Bed, ShieldCheck, Wind, CheckCircle2
} from 'lucide-react';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data & State
  const [properties, setProperties] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [filterMeta, setFilterMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter States from URL / Defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || searchParams.get('propertyType') || 'all');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || 'all');
  const [maxRent, setMaxRent] = useState(searchParams.get('budget') || searchParams.get('maxRent') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [selectedRoomType, setSelectedRoomType] = useState(searchParams.get('roomType') || '');
  const [isAc, setIsAc] = useState(searchParams.get('isAc') === 'true');
  const [isFurnished, setIsFurnished] = useState(searchParams.get('isFurnished') === 'true');
  const [foodAvailable, setFoodAvailable] = useState(searchParams.get('foodAvailable') === 'true');
  const [availableOnly, setAvailableOnly] = useState(searchParams.get('availableOnly') === 'true');
  const [selectedAmenities, setSelectedAmenities] = useState(() => {
    const raw = searchParams.get('amenities');
    return raw ? raw.split(',').filter(Boolean) : [];
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Load Filter Metadata (Cities, Price Range, Amenities) once
  useEffect(() => {
    async function loadMeta() {
      try {
        const meta = await propertyService.getFilterMeta();
        setFilterMeta(meta);
      } catch (err) {
        console.warn('Could not load filter metadata:', err.message);
      }
    }
    loadMeta();
  }, []);

  // Fetch Filtered Properties from Backend
  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const queryParams = {
        page,
        limit: 9,
        sortBy,
      };

      if (searchTerm.trim()) queryParams.q = searchTerm.trim();
      if (selectedCity && selectedCity !== 'all') queryParams.city = selectedCity;
      if (selectedType && selectedType !== 'all') queryParams.propertyType = selectedType;
      if (selectedGender && selectedGender !== 'all') queryParams.genderPreference = selectedGender;
      if (minRent) queryParams.minRent = minRent;
      if (maxRent) queryParams.maxRent = maxRent;
      if (selectedRoomType && selectedRoomType !== 'all') queryParams.roomType = selectedRoomType;
      if (isAc) queryParams.isAc = true;
      if (isFurnished) queryParams.isFurnished = true;
      if (foodAvailable) queryParams.foodAvailable = true;
      if (availableOnly) queryParams.availableOnly = true;
      if (selectedAmenities.length > 0) queryParams.amenities = selectedAmenities.join(',');

      const res = await propertyService.searchProperties(queryParams);
      setProperties(res.properties);
      setPaginationMeta(res.meta);
    } catch (err) {
      setError(err.message || 'Failed to search accommodations');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchTerm, selectedCity, selectedType, selectedGender,
    minRent, maxRent, selectedRoomType, isAc, isFurnished,
    foodAvailable, availableOnly, selectedAmenities, sortBy, page
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Sync state to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity);
    if (selectedType && selectedType !== 'all') params.set('type', selectedType);
    if (selectedGender && selectedGender !== 'all') params.set('gender', selectedGender);
    if (minRent) params.set('minRent', minRent);
    if (maxRent) params.set('maxRent', maxRent);
    if (selectedRoomType && selectedRoomType !== 'all') params.set('roomType', selectedRoomType);
    if (isAc) params.set('isAc', 'true');
    if (isFurnished) params.set('isFurnished', 'true');
    if (foodAvailable) params.set('foodAvailable', 'true');
    if (availableOnly) params.set('availableOnly', 'true');
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
    if (sortBy && sortBy !== 'newest') params.set('sortBy', sortBy);
    if (page > 1) params.set('page', String(page));

    setSearchParams(params, { replace: true });
  }, [
    searchTerm, selectedCity, selectedType, selectedGender,
    minRent, maxRent, selectedRoomType, isAc, isFurnished,
    foodAvailable, availableOnly, selectedAmenities, sortBy, page,
    setSearchParams
  ]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedType('all');
    setSelectedGender('all');
    setMinRent('');
    setMaxRent('');
    setSelectedRoomType('');
    setIsAc(false);
    setIsFurnished(false);
    setFoodAvailable(false);
    setAvailableOnly(false);
    setSelectedAmenities([]);
    setSortBy('newest');
    setPage(1);
  };

  // Toggle single amenity in selection
  const handleToggleAmenity = (slug) => {
    setSelectedAmenities((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setPage(1);
  };

  // Compute Active Filter Count
  const activeFiltersCount = [
    selectedCity && selectedCity !== 'all',
    selectedType && selectedType !== 'all',
    selectedGender && selectedGender !== 'all',
    minRent,
    maxRent,
    selectedRoomType && selectedRoomType !== 'all',
    isAc,
    isFurnished,
    foodAvailable,
    availableOnly,
    selectedAmenities.length > 0,
    searchTerm.trim(),
  ].filter(Boolean).length;

  const categories = [
    { id: 'all', label: 'All Stays' },
    { id: 'pg', label: 'PG / Co-Living' },
    { id: 'hostel', label: 'Student Hostels' },
    { id: 'coliving', label: 'Tech Coliving' },
    { id: 'flat', label: 'Flats & Apartments' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Room Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Find Your Ideal Accommodation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Search verified student residences, hostels, and shared flats with real-time bed inventory and transparent monthly living cost breakdowns.
          </p>
        </div>
      </div>

      {/* Main Search & Primary Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box (6 cols) */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by area, college, IT park, or property name..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPage(1);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* City Selector (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="">All Locations / Cities</option>
              {filterMeta?.cities?.map((city) => (
                <option key={city} value={city}>{city}</option>
              )) || (
                <>
                  <option value="Pune">Pune, Maharashtra</option>
                  <option value="Bengaluru">Bengaluru, Karnataka</option>
                </>
              )}
            </select>
          </div>

          {/* Sort By Dropdown (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Student Rating</option>
              <option value="popular">Most Popular (Views)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips & Advanced Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedType(cat.id);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === cat.id
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/25'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                isFilterDrawerOpen || activeFiltersCount > 0
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Advanced Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Reset All Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {isFilterDrawerOpen && (
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-5 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Gender Preference */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Gender Preference
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'male', label: 'Boys' },
                    { id: 'female', label: 'Girls' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSelectedGender(g.id);
                        setPage(1);
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                        selectedGender === g.id
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Configuration */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Room Sharing Type
                </label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => {
                    setSelectedRoomType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Any Sharing</option>
                  <option value="single">Single Private Room</option>
                  <option value="double">Double Sharing (2 Beds)</option>
                  <option value="triple">Triple Sharing (3 Beds)</option>
                </select>
              </div>

              {/* Budget Range (Max Rent) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Max Monthly Budget
                </label>
                <select
                  value={maxRent}
                  onChange={(e) => {
                    setMaxRent(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Any Budget</option>
                  <option value="8000">Under ₹8,000</option>
                  <option value="12000">Under ₹12,000</option>
                  <option value="16000">Under ₹16,000</option>
                  <option value="25000">Under ₹25,000</option>
                </select>
              </div>

              {/* Toggle Switches (AC, Furnished, Food, Vacancy) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Preferences & Availability
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => {
                      setIsAc(!isAc);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition ${
                      isAc ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Wind className="w-3 h-3" />
                    <span>AC Room</span>
                  </button>

                  <button
                    onClick={() => {
                      setFoodAvailable(!foodAvailable);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition ${
                      foodAvailable ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Utensils className="w-3 h-3" />
                    <span>Food Included</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsFurnished(!isFurnished);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition ${
                      isFurnished ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Bed className="w-3 h-3" />
                    <span>Furnished</span>
                  </button>

                  <button
                    onClick={() => {
                      setAvailableOnly(!availableOnly);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition ${
                      availableOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Available Vacancy Only</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Amenities Multi-Checklist */}
            <div className="pt-4 border-t border-slate-200/80">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Included Amenities (Must Have)
              </label>
              <div className="flex flex-wrap gap-2">
                {filterMeta?.amenities?.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity.slug);
                  return (
                    <button
                      key={amenity.id}
                      onClick={() => handleToggleAmenity(amenity.slug)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition ${
                        isSelected
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : <Zap className="w-3 h-3 text-slate-400" />}
                      <span>{amenity.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Active Filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
              <span>Keyword: "{searchTerm}"</span>
              <button onClick={() => setSearchTerm('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCity && selectedCity !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
              <span>City: {selectedCity}</span>
              <button onClick={() => setSelectedCity('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedType && selectedType !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200 uppercase">
              <span>Type: {selectedType}</span>
              <button onClick={() => setSelectedType('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedGender && selectedGender !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200 capitalize">
              <span>{selectedGender} Only</span>
              <button onClick={() => setSelectedGender('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {maxRent && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
              <span>Under ₹{Number(maxRent).toLocaleString('en-IN')}</span>
              <button onClick={() => setMaxRent('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedRoomType && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200 capitalize">
              <span>Room: {selectedRoomType}</span>
              <button onClick={() => setSelectedRoomType('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {isAc && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
              <span>AC Rooms</span>
              <button onClick={() => setIsAc(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {foodAvailable && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
              <span>Food Included</span>
              <button onClick={() => setFoodAvailable(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {availableOnly && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              <span>Vacancies Only</span>
              <button onClick={() => setAvailableOnly(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedAmenities.map((slug) => (
            <span key={slug} className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              <span>{slug}</span>
              <button onClick={() => handleToggleAmenity(slug)}><X className="w-3 h-3" /></button>
            </span>
          ))}

          <button
            onClick={handleResetFilters}
            className="text-brand-600 hover:text-brand-800 font-bold ml-2 underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <strong className="text-slate-900">{paginationMeta?.total ?? properties.length}</strong>{' '}
          {properties.length === 1 ? 'accommodation' : 'accommodations'}
          {paginationMeta?.totalPages > 1 && ` (Page ${paginationMeta.page} of ${paginationMeta.totalPages})`}
        </span>
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
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-16 rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
          <Building2 className="w-14 h-14 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">No matching accommodations found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any properties matching all your selected search and filter criteria. Try broadening your location or resetting filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl text-xs font-bold transition"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {paginationMeta && paginationMeta.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            disabled={!paginationMeta.hasPrevPage}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: paginationMeta.totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                page === num
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={!paginationMeta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}