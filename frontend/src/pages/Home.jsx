import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Building2, ShieldCheck, Calculator, ArrowRight,
  Sparkles, CheckCircle2, MapPin, Bed, Star, ChevronRight,
  TrendingUp, Users, Heart, Zap, Coffee, PhoneCall
} from 'lucide-react';
import propertyService from '../services/propertyService';
import PropertyCard from '../components/common/PropertyCard';
import SkeletonCard from '../components/common/SkeletonCard';
import Badge from '../components/common/Badge';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search Bar State
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    async function loadFeatured() {
      try {
        setIsLoading(true);
        const data = await propertyService.getProperties();
        // Take up to 6 properties for featured section
        setFeaturedProperties(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (selectedBudget) params.set('budget', selectedBudget);
    if (selectedType) params.set('type', selectedType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-brand-50/70 via-white to-slate-50">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl" />
          <div className="absolute top-48 -right-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, Value Proposition & Search Controls */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/90 border border-brand-200/80 text-brand-700 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-ping" />
                <span>Next-Gen Accommodation Platform</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-medium">100% Verified Hosts</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Find Your Next Room With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
                  Total Cost
                </span>{' '}
                Transparency
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                No hidden electricity bills, no surprise maintenance, and zero middleman brokerage fees.
                RoomVerse combines real-time bed inventory with explainable monthly living cost calculators for students and professionals.
              </p>

              {/* Interactive Quick Finder Search Bar */}
              <div className="bg-white p-3.5 sm:p-4 rounded-3xl shadow-xl shadow-brand-500/5 border border-slate-200/90 space-y-3">
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* City Selector */}
                  <div className="relative bg-slate-50 hover:bg-slate-100/80 rounded-2xl px-3.5 py-2.5 border border-slate-200/60 transition text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Location
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer mt-0.5"
                    >
                      <option value="">All Cities</option>
                      <option value="Pune">Pune, Maharashtra</option>
                      <option value="Bengaluru">Bengaluru, Karnataka</option>
                      <option value="Mumbai">Mumbai, Maharashtra</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                    </select>
                  </div>

                  {/* Budget Selector */}
                  <div className="relative bg-slate-50 hover:bg-slate-100/80 rounded-2xl px-3.5 py-2.5 border border-slate-200/60 transition text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Max Budget
                    </label>
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer mt-0.5"
                    >
                      <option value="">Any Budget</option>
                      <option value="8000">Under ₹8,000</option>
                      <option value="12000">Under ₹12,000</option>
                      <option value="18000">Under ₹18,000</option>
                      <option value="25000">Under ₹25,000</option>
                    </select>
                  </div>

                  {/* Accommodation Type */}
                  <div className="relative bg-slate-50 hover:bg-slate-100/80 rounded-2xl px-3.5 py-2.5 border border-slate-200/60 transition text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Property Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer mt-0.5"
                    >
                      <option value="">All Types</option>
                      <option value="pg">Student PG</option>
                      <option value="hostel">Hostel</option>
                      <option value="apartment">Apartment / Flat</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="sm:col-span-3 flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                    <button
                      type="submit"
                      className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Explore Accommodations</span>
                    </button>

                    <Link
                      to="/register?role=owner"
                      className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 whitespace-nowrap"
                    >
                      <span>List Your Property</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  </div>
                </form>
              </div>

              {/* Quick Tags */}
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-400">Popular Searches:</span>
                <Link to="/properties?city=Pune" className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-600 font-medium transition shadow-2xs">
                  Hinjewadi, Pune
                </Link>
                <Link to="/properties?city=Bengaluru" className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-600 font-medium transition shadow-2xs">
                  Koramangala, Bengaluru
                </Link>
                <Link to="/properties" className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-600 font-medium transition shadow-2xs">
                  Zero Deposit PGs
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Accommodation Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Background glow behind card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 rounded-3xl blur-2xl transform rotate-3 scale-95" />

                {/* Showcase Preview Card */}
                <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-4 sm:p-5 space-y-4">
                  {/* Photo with Overlay Pills */}
                  <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
                      alt="RoomVerse Premium Accommodation"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Verified</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                        Single & Double Sharing
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white font-bold text-[11px]">
                        ● 2 Beds Available
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">Stanza Living Horizon</h4>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 text-brand-600" /> Hinjewadi Phase 1, Pune
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                      </div>
                    </div>

                    {/* Cost Calculator Snapshot Box */}
                    <div className="p-3 bg-gradient-to-r from-brand-50/60 to-indigo-50/60 rounded-xl border border-brand-100/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Base Room Rent</span>
                        <span className="font-bold text-slate-800">₹8,500/mo</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Food + WiFi + Maintenance</span>
                        <span className="font-bold text-slate-800">₹2,700/mo</span>
                      </div>
                      <div className="pt-1.5 border-t border-brand-200/50 flex items-center justify-between text-xs font-bold">
                        <span className="text-brand-800">Total True Monthly Outflow</span>
                        <span className="text-brand-700 text-sm font-black">₹11,200/mo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Reassurance Badge 1 */}
                <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xl flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="font-bold text-slate-900 block">Zero Brokerage</span>
                    <span className="text-[11px] text-slate-400">Direct host contact</span>
                  </div>
                </div>

                {/* Floating Reassurance Badge 2 */}
                <div className="absolute -top-5 -right-5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xl hidden sm:flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="font-bold text-slate-900 block">Verified Listings</span>
                    <span className="text-[11px] text-slate-400">Real room photos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & SOCIAL PROOF BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="pt-2 lg:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-brand-600 tracking-tight block">100%</span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block">Physical Audits</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Every accommodation verified</span>
          </div>

          <div className="pt-4 sm:pt-2 lg:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">₹0</span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block">Brokerage Fee</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Transparent direct connect</span>
          </div>

          <div className="pt-4 lg:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">Real-Time</span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block">Bed Inventory</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Instant room availability</span>
          </div>

          <div className="pt-4 lg:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight block">4.9 / 5</span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block">Student Trust</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Rated by verified tenants</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ACCOMMODATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Stays</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Verified Accommodations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              High-rated PGs, student residences, and flats ready for immediate move-in
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition group self-start sm:self-auto"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Property Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No properties available yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Be the first to list an accommodation in your locality and reach verified tenants.
            </p>
            <Link
              to="/owner/properties/new"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl transition"
            >
              List Your Property
            </Link>
          </div>
        )}
      </section>

      {/* 4. WHY ROOMVERSE? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Why Choose RoomVerse</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Built for Smart, Stress-Free Renting
          </h2>
          <p className="text-sm text-slate-500">
            Say goodbye to fake photos, unresponsive brokers, and unexpected electricity charges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">100% Verified Listings</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Every property undergoes administrative audit, address confirmation, and safety checks before going live.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
              <Calculator className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Transparent Living Cost</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Calculate total monthly outflow: Base Rent + Meal Charges + Maintenance + Utility Bills with zero hidden costs.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Bed className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Bed Availability</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Atomic room and bed-level inventory tracking means you never enquire for an already occupied accommodation.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Zap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Zero Brokerage Fee</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Direct interaction between students, working professionals, and property hosts with no commission middleman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple 4-Step Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How RoomVerse Works
          </h2>
          <p className="text-sm text-slate-500">
            From initial search to moving in with zero friction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-brand-500/30">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Search & Filter</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore by city, locality, budget range, gender preference, and room configurations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-indigo-500/30">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Compare Total Cost</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use our true cost calculator to see real living expenses before making any commitment.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-violet-500/30">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Inspect & Verify</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review admin verification badges, high-res photos, house rules, and bed availability.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-emerald-500/30">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">Move In Smoothly</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect directly with verified hosts, confirm booking terms, and enjoy your new home.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CONVERSION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-300 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Find a Place That Actually Fits Your Budget</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready to Upgrade Your Living Experience?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join thousands of students and young professionals discovering verified, high-quality PGs and accommodations across top tech hubs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/properties"
                className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Browse All Accommodations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/register?role=owner"
                className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all flex items-center justify-center space-x-1.5"
              >
                <span>List Property (Free)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
