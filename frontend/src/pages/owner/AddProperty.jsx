import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import propertyService from '../../services/propertyService';
import Button from '../../components/common/Button';
import { ArrowLeft, Building2, AlertCircle } from 'lucide-react';

export default function AddProperty() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'pg',
    genderPreference: 'any',
    city: '',
    locality: '',
    address: '',
    pincode: '',
    description: '',
    minRent: '',
    maxRent: '',
    securityDeposit: '0',
    estimatedMaintenance: '0',
    estimatedFoodCharge: '0',
    estimatedElectricityCharge: '0',
    foodAvailable: false,
    noticePeriodDays: '30',
    rules: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.city || !formData.locality || !formData.address) {
      setError('Please provide title, city, locality, and full address.');
      return;
    }

    if (Number(formData.minRent) < 0 || Number(formData.maxRent) < Number(formData.minRent)) {
      setError('Maximum rent must be greater than or equal to minimum rent.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await propertyService.createProperty(formData);
      navigate(`/owner/properties/${created.id}/edit`, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create property listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/owner/properties" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-600 transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to My Properties
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Property Listing</h1>
          <p className="text-xs text-slate-500 mt-1">
            Provide the physical address, baseline rental structure, and living cost details. You can configure rooms and amenities right after.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Basic Property Details</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Property Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Verse Neo Luxe Living"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="pg">Paying Guest (PG)</option>
                  <option value="hostel">Student Hostel</option>
                  <option value="coliving">Coliving Residence</option>
                  <option value="flat">Shared Flat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender Preference</label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="any">Unisex / Any</option>
                  <option value="male">Boys / Male Only</option>
                  <option value="female">Girls / Female Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Location & Address</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Pune"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Locality / Area *</label>
                <input
                  type="text"
                  name="locality"
                  required
                  value={formData.locality}
                  onChange={handleChange}
                  placeholder="e.g. Hinjewadi Phase 1"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="411057"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Physical Address *</label>
              <textarea
                name="address"
                required
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, building name, landmark..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Pricing & Living Costs */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Pricing & Living Cost Estimates</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Minimum Monthly Rent (₹) *</label>
                <input
                  type="number"
                  name="minRent"
                  required
                  value={formData.minRent}
                  onChange={handleChange}
                  placeholder="8500"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Maximum Monthly Rent (₹) *</label>
                <input
                  type="number"
                  name="maxRent"
                  required
                  value={formData.maxRent}
                  onChange={handleChange}
                  placeholder="15000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Security Deposit (₹)</label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="15000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Est. Monthly Maintenance (₹)</label>
                <input
                  type="number"
                  name="estimatedMaintenance"
                  value={formData.estimatedMaintenance}
                  onChange={handleChange}
                  placeholder="800"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Est. Monthly Food Charge (₹)</label>
                <input
                  type="number"
                  name="estimatedFoodCharge"
                  value={formData.estimatedFoodCharge}
                  onChange={handleChange}
                  placeholder="2500"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Est. Electricity (₹)</label>
                <input
                  type="number"
                  name="estimatedElectricityCharge"
                  value={formData.estimatedElectricityCharge}
                  onChange={handleChange}
                  placeholder="600"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="foodAvailable"
                name="foodAvailable"
                checked={formData.foodAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <label htmlFor="foodAvailable" className="text-xs font-medium text-slate-700">
                Food / Mess facility is available at this property
              </label>
            </div>
          </div>

          {/* Description & Rules */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. Description & Rules</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Overview & Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property, proximity to colleges/tech hubs, ambience..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">House Rules</label>
              <input
                type="text"
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                placeholder="e.g. Visitors allowed till 9:30 PM, no smoking inside rooms..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <Link to="/owner/properties">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={isSubmitting} className="shadow-md shadow-brand-500/20">
              Create & Proceed to Rooms/Amenities
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}