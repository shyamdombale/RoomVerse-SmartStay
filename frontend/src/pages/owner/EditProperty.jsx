import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import propertyService from '../../services/propertyService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  ArrowLeft, Building2, Bed, CheckSquare, Image as ImageIcon,
  Plus, Trash2, Save, AlertCircle, CheckCircle2
} from 'lucide-react';

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('details'); // details, amenities, rooms, images
  const [property, setProperty] = useState(null);
  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Forms
  const [propertyForm, setPropertyForm] = useState({});
  const [newRoom, setNewRoom] = useState({
    roomNumberName: '',
    roomType: 'single',
    isAc: false,
    isFurnished: true,
    monthlyRent: '',
    totalCapacity: '1',
    availableCapacity: '1',
    status: 'available',
  });
  const [newImage, setNewImage] = useState({
    imageUrl: '',
    isPrimary: false,
    caption: '',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [propData, amenitiesCatalog] = await Promise.all([
        propertyService.getPropertyById(id),
        propertyService.getAmenities(),
      ]);

      setProperty(propData);
      setPropertyForm({
        title: propData.title || '',
        propertyType: propData.property_type || 'pg',
        genderPreference: propData.gender_preference || 'any',
        city: propData.city || '',
        locality: propData.locality || '',
        address: propData.address || '',
        pincode: propData.pincode || '',
        minRent: propData.min_rent || '',
        maxRent: propData.max_rent || '',
        securityDeposit: propData.security_deposit || '',
        estimatedMaintenance: propData.estimated_maintenance || '',
        estimatedFoodCharge: propData.estimated_food_charge || '',
        estimatedElectricityCharge: propData.estimated_electricity_charge || '',
        foodAvailable: Boolean(propData.food_available),
        rules: propData.rules || '',
        description: propData.description || '',
      });

      setAllAmenities(amenitiesCatalog);
      setSelectedAmenityIds((propData.amenities || []).map((a) => a.id));
    } catch (err) {
      setMessage({ text: err.message || 'Failed to load property details', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Tab 1: Update Property Details
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      await propertyService.updateProperty(id, propertyForm);
      setMessage({ text: 'Property details updated successfully!', type: 'success' });
      loadData();
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update property details', type: 'error' });
    }
  };

  // Tab 2: Save Amenities
  const handleToggleAmenity = (amenityId) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(amenityId) ? prev.filter((i) => i !== amenityId) : [...prev, amenityId]
    );
  };

  const handleSaveAmenities = async () => {
    setMessage({ text: '', type: '' });
    try {
      await propertyService.updatePropertyAmenities(id, selectedAmenityIds);
      setMessage({ text: 'Amenities updated successfully!', type: 'success' });
      loadData();
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update amenities', type: 'error' });
    }
  };

  // Tab 3: Rooms Management
  const handleAddRoom = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      await propertyService.createRoom(id, {
        ...newRoom,
        monthlyRent: Number(newRoom.monthlyRent),
        totalCapacity: Number(newRoom.totalCapacity),
        availableCapacity: Number(newRoom.availableCapacity),
      });
      setMessage({ text: 'Room created successfully!', type: 'success' });
      setNewRoom({
        roomNumberName: '',
        roomType: 'single',
        isAc: false,
        isFurnished: true,
        monthlyRent: '',
        totalCapacity: '1',
        availableCapacity: '1',
        status: 'available',
      });
      loadData();
    } catch (err) {
      setMessage({ text: err.message || 'Failed to add room', type: 'error' });
    }
  };

  const handleUpdateRoomStatus = async (roomId, newStatus) => {
    try {
      await propertyService.updateRoom(roomId, { status: newStatus });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update room status');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Delete this room from inventory?')) return;
    try {
      await propertyService.deleteRoom(roomId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete room');
    }
  };

  // Tab 4: Image Metadata
  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImage.imageUrl) return;
    setMessage({ text: '', type: '' });
    try {
      await propertyService.addImage(id, newImage);
      setMessage({ text: 'Image metadata added successfully!', type: 'success' });
      setNewImage({ imageUrl: '', isPrimary: false, caption: '' });
      loadData();
    } catch (err) {
      setMessage({ text: err.message || 'Failed to add image metadata', type: 'error' });
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await propertyService.deleteImage(id, imageId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete image');
    }
  };

  if (isLoading) {
    return <Loader message="Loading property management workbench..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/owner/properties" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-600 transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to My Properties
      </Link>

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Badge variant={property.verification_status === 'verified' ? 'success' : 'default'}>
              {property.verification_status === 'verified' ? 'Verified' : 'Pending Verification'}
            </Badge>
            <span className="text-xs text-slate-400">ID: {property.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{property.title}</h1>
          <p className="text-xs text-slate-500">{property.address}, {property.locality}, {property.city}</p>
        </div>

        <Link to={`/properties/${property.id}`} className="text-xs font-semibold text-brand-600 hover:underline">
          View Public Page →
        </Link>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
          message.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Management Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-1 sm:space-x-4 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-3 border-b-2 flex items-center space-x-1.5 transition ${
            activeTab === 'details' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Property Details</span>
        </button>

        <button
          onClick={() => setActiveTab('amenities')}
          className={`pb-3 px-3 border-b-2 flex items-center space-x-1.5 transition ${
            activeTab === 'amenities' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Amenities ({selectedAmenityIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`pb-3 px-3 border-b-2 flex items-center space-x-1.5 transition ${
            activeTab === 'rooms' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Rooms Inventory ({property.rooms?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`pb-3 px-3 border-b-2 flex items-center space-x-1.5 transition ${
            activeTab === 'images' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Images ({property.images?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: DETAILS */}
      {activeTab === 'details' && (
        <form onSubmit={handleUpdateDetails} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={propertyForm.title}
              onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
              <select
                value={propertyForm.propertyType}
                onChange={(e) => setPropertyForm({ ...propertyForm, propertyType: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="pg">Paying Guest (PG)</option>
                <option value="hostel">Student Hostel</option>
                <option value="coliving">Coliving Residence</option>
                <option value="flat">Shared Flat</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender Preference</label>
              <select
                value={propertyForm.genderPreference}
                onChange={(e) => setPropertyForm({ ...propertyForm, genderPreference: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="any">Unisex / Any</option>
                <option value="male">Boys / Male Only</option>
                <option value="female">Girls / Female Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Min Rent (₹)</label>
              <input
                type="number"
                value={propertyForm.minRent}
                onChange={(e) => setPropertyForm({ ...propertyForm, minRent: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Rent (₹)</label>
              <input
                type="number"
                value={propertyForm.maxRent}
                onChange={(e) => setPropertyForm({ ...propertyForm, maxRent: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                value={propertyForm.securityDeposit}
                onChange={(e) => setPropertyForm({ ...propertyForm, securityDeposit: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
            <textarea
              rows={2}
              value={propertyForm.address}
              onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={propertyForm.description}
              onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <Button type="submit" variant="primary" className="flex items-center space-x-1.5">
            <Save className="w-4 h-4" />
            <span>Save Property Changes</span>
          </Button>
        </form>
      )}

      {/* TAB 2: AMENITIES */}
      {activeTab === 'amenities' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assign Platform Amenities</h3>
            <p className="text-xs text-slate-500 mt-1">Select the amenities that are provided at this property.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allAmenities.map((a) => {
              const isChecked = selectedAmenityIds.includes(a.id);
              return (
                <label
                  key={a.id}
                  onClick={() => handleToggleAmenity(a.id)}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs cursor-pointer select-none transition ${
                    isChecked ? 'border-brand-600 bg-brand-50/60 text-brand-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand-600 rounded pointer-events-none"
                  />
                  <span className="font-semibold">{a.name}</span>
                </label>
              );
            })}
          </div>

          <Button type="button" onClick={handleSaveAmenities} variant="primary">
            Save Amenities
          </Button>
        </div>
      )}

      {/* TAB 3: ROOMS INVENTORY */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          {/* Add Room Form */}
          <form onSubmit={handleAddRoom} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-brand-600" />
              <span>Add New Room Type</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room Name / No *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deluxe Single AC"
                  value={newRoom.roomNumberName}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumberName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room Type</label>
                <select
                  value={newRoom.roomType}
                  onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="single">Single Occupancy</option>
                  <option value="double">Double Sharing</option>
                  <option value="triple">Triple Sharing</option>
                  <option value="four_plus">Four+ Sharing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="12000"
                  value={newRoom.monthlyRent}
                  onChange={(e) => setNewRoom({ ...newRoom, monthlyRent: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Capacity (Beds)</label>
                <input
                  type="number"
                  value={newRoom.totalCapacity}
                  onChange={(e) => setNewRoom({ ...newRoom, totalCapacity: e.target.value, availableCapacity: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newRoom.isAc}
                  onChange={(e) => setNewRoom({ ...newRoom, isAc: e.target.checked })}
                  className="rounded text-brand-600"
                />
                <span>Air Conditioned (AC)</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newRoom.isFurnished}
                  onChange={(e) => setNewRoom({ ...newRoom, isFurnished: e.target.checked })}
                  className="rounded text-brand-600"
                />
                <span>Furnished</span>
              </label>

              <Button type="submit" variant="primary" size="sm" className="ml-auto">
                Add Room to Inventory
              </Button>
            </div>
          </form>

          {/* Rooms Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-3.5">Room</th>
                  <th className="p-3.5">Type & Features</th>
                  <th className="p-3.5">Rent</th>
                  <th className="p-3.5">Capacity</th>
                  <th className="p-3.5">Availability Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(property.rooms || []).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{r.room_number_name}</td>
                    <td className="p-3.5 text-slate-600">
                      {r.room_type.toUpperCase()} • {r.is_ac ? 'AC' : 'Non-AC'}
                    </td>
                    <td className="p-3.5 font-extrabold text-brand-600">
                      ₹{Number(r.monthly_rent).toLocaleString('en-IN')}/mo
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {r.available_capacity}/{r.total_capacity} beds
                    </td>
                    <td className="p-3.5">
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateRoomStatus(r.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-slate-200 bg-white font-medium"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteRoom(r.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: IMAGES */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <form onSubmit={handleAddImage} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-brand-600" />
              <span>Add Image URL Metadata</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL (HTTPS) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newImage.imageUrl}
                  onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Master Bedroom View"
                  value={newImage.caption}
                  onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newImage.isPrimary}
                  onChange={(e) => setNewImage({ ...newImage, isPrimary: e.target.checked })}
                  className="rounded text-brand-600"
                />
                <span>Set as Primary Thumbnail Image</span>
              </label>

              <Button type="submit" variant="primary" size="sm">
                Add Image
              </Button>
            </div>
          </form>

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(property.images || []).map((img) => (
              <div key={img.id} className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                <div className="h-44 bg-slate-100 overflow-hidden">
                  <img src={img.image_url} alt={img.caption || 'Property'} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block truncate max-w-[160px]">{img.caption || 'No caption'}</span>
                    {img.is_primary && <Badge variant="brand" size="sm">Primary</Badge>}
                  </div>
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}