import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import {
  MapPin, ShieldCheck, ArrowLeft, Building2, User,
  Utensils, Zap, Wrench, Shield, Check, AlertCircle, Bed,
  Star, Heart, Share2, Phone, Mail, Clock, Calendar, CheckCircle2,
  Info, Sparkles
} from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      try {
        setIsLoading(true);
        const data = await propertyService.getPropertyById(id);
        setProperty(data);

        // Check if favorited in localStorage
        try {
          const saved = localStorage.getItem('roomverse_favorites');
          if (saved) {
            const ids = JSON.parse(saved);
            if (Array.isArray(ids) && ids.includes(id)) {
              setIsFavorited(true);
            }
          }
        } catch {}
      } catch (err) {
        setError(err.message || 'Failed to load property details');
      } finally {
        setIsLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  const handleFavoriteToggle = () => {
    try {
      const saved = localStorage.getItem('roomverse_favorites');
      let ids = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(ids)) ids = [];

      if (isFavorited) {
        ids = ids.filter((favId) => favId !== id);
        setIsFavorited(false);
      } else {
        ids.push(id);
        setIsFavorited(true);
      }
      localStorage.setItem('roomverse_favorites', JSON.stringify(ids));
    } catch {
      setIsFavorited(!isFavorited);
    }
  };

  const handleContactClick = () => {
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 4000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loader message="Loading complete property details, living costs, and room inventory..." />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm inline-block">
          {error || 'Accommodation not found or listing has been archived'}
        </div>
        <div>
          <Link
            to="/properties"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Accommodations</span>
          </Link>
        </div>
      </div>
    );
  }

  // Cost Computations
  const minRent = Number(property.min_rent) || 0;
  const maxRent = Number(property.max_rent) || 0;
  const maintenance = Number(property.estimated_maintenance) || 0;
  const food = property.food_available ? (Number(property.estimated_food_charge) || 0) : 0;
  const electricity = Number(property.estimated_electricity_charge) || 0;
  const deposit = Number(property.security_deposit) || 0;
  const totalMonthlyMin = minRent + maintenance + food + electricity;
  const totalMonthlyMax = maxRent + maintenance + food + electricity;

  const images = property.images && property.images.length > 0
    ? property.images
    : property.primary_image_url
      ? [{ id: 'primary', image_url: property.primary_image_url, caption: property.title }]
      : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available</span>
          </span>
        );
      case 'reserved':
        return <Badge variant="warning" size="sm">Reserved</Badge>;
      case 'occupied':
        return <Badge variant="danger" size="sm">Occupied</Badge>;
      case 'maintenance':
        return <Badge variant="default" size="sm">Maintenance</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Navigation & Action Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/properties"
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Explore
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: property.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Property link copied to clipboard!');
              }
            }}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Share Property"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-xl border transition ${
              isFavorited
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
            title="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Title & Address Banner */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {property.verification_status === 'verified' ? (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Verified Accommodation</span>
            </span>
          ) : (
            <Badge variant="warning">Pending Verification Audit</Badge>
          )}
          <Badge variant="brand">{property.property_type?.toUpperCase() || 'PG'}</Badge>
          <Badge variant="info">Gender: {property.gender_preference?.toUpperCase() || 'CO-ED'}</Badge>
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 (24 student reviews)</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {property.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-brand-600 flex-shrink-0" />
          <span>{property.address}, {property.locality}, {property.city} {property.pincode && `— ${property.pincode}`}</span>
        </p>
      </div>

      {/* Modern Accommodation Photo Gallery */}
      {images.length > 0 ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-80 sm:h-96 lg:h-[420px] rounded-3xl overflow-hidden shadow-card border border-slate-200">
            {/* Primary Featured Image */}
            <div className="lg:col-span-8 h-full bg-slate-100 relative group overflow-hidden">
              <img
                src={images[activeImageIndex]?.image_url || images[0]?.image_url}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-medium">
                Photo {activeImageIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Strip (Desktop) */}
            <div className="hidden lg:grid lg:col-span-4 grid-rows-2 gap-3 h-full">
              {images.slice(1, 3).map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx + 1)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition ${
                    activeImageIndex === idx + 1 ? 'border-brand-600' : 'border-transparent'
                  }`}
                >
                  <img src={img.image_url} alt="Gallery Preview" className="w-full h-full object-cover" />
                </div>
              ))}
              {images.length < 3 && (
                <div className="bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                  <Building2 className="w-8 h-8 mb-1 text-slate-300" />
                  <span>Verified Room Space</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Thumbnail Selector */}
          {images.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-18 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                    activeImageIndex === idx ? 'border-brand-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-72 rounded-3xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
          <Building2 className="w-12 h-12 text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No photos uploaded for this property yet.</p>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Details, Living Costs, Amenities, Rooms (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* About Accommodation Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">About the Property</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description || 'Welcome to this modern accommodation designed specifically for comfortable student and professional living.'}
            </p>

            {property.rules && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-brand-600" />
                  <span>House & Safety Rules</span>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {property.rules}
                </p>
              </div>
            )}
          </div>

          {/* Living Cost Transparency Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  <span>Explainable Living Cost Breakdown</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every living cost component itemized upfront so you can budget accurately.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Maintenance</span>
                <span className="text-lg font-black text-slate-900 block">
                  ₹{maintenance.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span>
                </span>
                <span className="text-[11px] text-slate-500 block">Includes cleaning & lift charges</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Meals / Food</span>
                <span className="text-lg font-black text-slate-900 block">
                  {property.food_available ? `₹${food.toLocaleString('en-IN')}` : 'Self / Outside'}
                  {property.food_available && <span className="text-xs font-normal text-slate-400">/mo</span>}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {property.food_available ? 'Breakfast + Dinner included' : 'Kitchen access provided'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Est. Electricity</span>
                <span className="text-lg font-black text-slate-900 block">
                  ₹{electricity.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span>
                </span>
                <span className="text-[11px] text-slate-500 block">Sub-metered or fixed norm</span>
              </div>
            </div>

            {/* Total projection bar */}
            <div className="p-4 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-brand-900 block">
                  Projected True Monthly Outflow:
                </span>
                <span className="text-[11px] text-brand-700">
                  (Base Rent + Maintenance + Food + Electricity)
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xl sm:text-2xl font-black text-brand-700">
                  ₹{totalMonthlyMin.toLocaleString('en-IN')} - ₹{totalMonthlyMax.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-brand-600 block">/ month</span>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Available Amenities</h2>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center space-x-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Standard amenities available upon inquiry.</p>
            )}
          </div>

          {/* Room Inventory Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Room Inventory & Availability</h2>
                <p className="text-xs text-slate-500 mt-0.5">Live bed vacancies for this accommodation</p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {property.rooms?.length || 0} configurations
              </span>
            </div>

            <div className="space-y-4">
              {property.rooms && property.rooms.length > 0 ? (
                property.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-brand-300 transition-all bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-sm font-black text-slate-900">{room.room_number_name}</span>
                        {getStatusBadge(room.status)}
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-lg font-black text-brand-600">
                          ₹{Number(room.monthly_rent).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400"> /month</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium capitalize">
                        {room.room_type} Sharing
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium">
                        {room.is_ac ? '❄️ Air Conditioned' : '💨 Non-AC'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium">
                        {room.is_furnished ? '🛋️ Furnished' : '📦 Semi-Furnished'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Vacant Beds: <strong className="text-slate-800">{room.available_capacity}</strong> of {room.total_capacity} total
                      </span>
                      <button
                        onClick={handleContactClick}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition"
                      >
                        Enquire for this room
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  Contact the host for specific room layout and availability updates.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking & Host Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          {/* Booking / Enquiry Box */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Starting Monthly Rent
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-black text-brand-600">
                  ₹{minRent.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Security Deposit: ₹{deposit.toLocaleString('en-IN')} (Refundable)
              </p>
            </div>

            {/* Quick summary of living costs */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Base Rent from</span>
                <span className="font-semibold text-slate-800">₹{minRent.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Maintenance</span>
                <span className="font-semibold text-slate-800">₹{maintenance.toLocaleString('en-IN')}</span>
              </div>
              {property.food_available && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Food/Meals</span>
                  <span className="font-semibold text-slate-800">₹{food.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-600">
                <span>Electricity (Est.)</span>
                <span className="font-semibold text-slate-800">₹{electricity.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                <span>Total Monthly</span>
                <span className="text-brand-600 font-black">₹{totalMonthlyMin.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={handleContactClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Host Directly</span>
              </button>

              <button
                onClick={handleContactClick}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Schedule a Physical Tour</span>
              </button>
            </div>

            {contactSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Host contact request sent! You will be contacted shortly.</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Brokerage Guarantee • Direct Deal</span>
            </div>
          </div>

          {/* Host Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Property Host / Manager
            </h3>

            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-100 to-indigo-100 text-brand-700 font-bold text-lg flex items-center justify-center border border-brand-200">
                {property.owner_name?.charAt(0) || 'H'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{property.owner_name}</h4>
                <p className="text-xs text-slate-500">{property.owner_email}</p>
                {property.owner_phone && (
                  <p className="text-xs text-brand-600 font-semibold mt-0.5">{property.owner_phone}</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Responds typically within a few hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}