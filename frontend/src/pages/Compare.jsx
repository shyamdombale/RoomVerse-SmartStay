import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import {
  SlidersHorizontal, Check, X, Building2, MapPin,
  ArrowRight, ShieldCheck, Calculator, Star
} from 'lucide-react';

export default function Compare() {
  const [properties, setProperties] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoading(true);
        const data = await propertyService.getProperties();
        setProperties(data);
        if (data.length >= 2) {
          setSelectedIds([data[0].id, data[1].id]);
        } else if (data.length === 1) {
          setSelectedIds([data[0].id]);
        }
      } catch (err) {
        console.error('Failed to load properties for comparison:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, []);

  const handleSelect = (index, id) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  };

  const selectedProperties = selectedIds
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loader message="Loading comparison matrix and living cost metrics..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Side-by-Side Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Compare True Living Costs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate base rent, food, maintenance, and electricity across verified properties.
          </p>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2.5 rounded-xl transition self-start sm:self-auto"
        >
          <span>Explore All Properties</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {properties.length < 2 ? (
        <div className="bg-white p-16 rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Need at least 2 properties to compare</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once more verified accommodations are added to the platform, you will be able to compare them here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Property Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].slice(0, Math.min(3, properties.length)).map((slotIndex) => (
              <div key={slotIndex} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Accommodation {slotIndex + 1}
                </label>
                <select
                  value={selectedIds[slotIndex] || ''}
                  onChange={(e) => handleSelect(slotIndex, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">-- Choose Accommodation --</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.locality}, {p.city})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Comparison Matrix Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100">
                  <tr>
                    <th className="p-5 text-slate-400 font-bold uppercase text-[10px] tracking-wider w-1/4">
                      Feature / Metric
                    </th>
                    {selectedProperties.map((p) => (
                      <th key={p.id} className="p-5 font-bold text-slate-900 w-1/3">
                        <div className="text-sm font-black line-clamp-1">{p.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{p.locality}, {p.city}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Photo Preview */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Photo Preview</td>
                    {selectedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <div className="h-32 rounded-xl overflow-hidden bg-slate-100 max-w-xs">
                          {p.primary_image_url ? (
                            <img src={p.primary_image_url} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Building2 className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Verification Status */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Verification</td>
                    {selectedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <Badge variant={p.verification_status === 'verified' ? 'success' : 'default'} size="sm">
                          {p.verification_status === 'verified' ? 'Verified Listing' : 'Pending Audit'}
                        </Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Monthly Base Rent */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Starting Rent</td>
                    {selectedProperties.map((p) => (
                      <td key={p.id} className="p-4 font-black text-brand-600 text-sm">
                        ₹{Number(p.min_rent).toLocaleString('en-IN')}/mo
                      </td>
                    ))}
                  </tr>

                  {/* Security Deposit */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Security Deposit</td>
                    {selectedProperties.map((p) => (
                      <td key={p.id} className="p-4 font-semibold text-slate-700">
                        ₹{Number(p.security_deposit).toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>

                  {/* Estimated Maintenance */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Maintenance</td>
                    {selectedProperties.map((p) => (
                      <td key={p.id} className="p-4 text-slate-600">
                        ₹{Number(p.estimated_maintenance).toLocaleString('en-IN')}/mo
                      </td>
                    ))}
                  </tr>

                  {/* Food / Meals */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Food / Meals</td>
                    {selectedProperties.map((p) => (
                      <td key={p.id} className="p-4 text-slate-600">
                        {p.food_available ? `₹${Number(p.estimated_food_charge).toLocaleString('en-IN')}/mo` : 'Self / Not Included'}
                      </td>
                    ))}
                  </tr>

                  {/* Electricity Charges */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Est. Electricity</td>
                    {selectedProperties.map((p) => (
                      <td key={p.id} className="p-4 text-slate-600">
                        ₹{Number(p.estimated_electricity_charge).toLocaleString('en-IN')}/mo
                      </td>
                    ))}
                  </tr>

                  {/* Total Estimated Monthly Outflow */}
                  <tr className="bg-brand-50/40">
                    <td className="p-4 font-black text-brand-900">Total True Monthly Outflow</td>
                    {selectedProperties.map((p) => {
                      const total =
                        Number(p.min_rent) +
                        Number(p.estimated_maintenance) +
                        (p.food_available ? Number(p.estimated_food_charge) : 0) +
                        Number(p.estimated_electricity_charge);
                      return (
                        <td key={p.id} className="p-4">
                          <span className="text-base font-black text-brand-700">
                            ₹{total.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-brand-600 block">/month (all included)</span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Action Link */}
                  <tr>
                    <td className="p-4 bg-slate-50/40"></td>
                    {selectedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <Link
                          to={`/properties/${p.id}`}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700 transition"
                        >
                          <span>View Full Listing</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
