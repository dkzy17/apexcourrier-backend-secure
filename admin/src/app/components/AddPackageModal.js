"use client";
import { useState } from "react";
import { FaTimes, FaSave, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBox, FaImage } from "react-icons/fa";

export default function AddPackageModal({ newPackage, setNewPackage, onSave, onClose }) {
  const newpkg = newPackage;
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

  const handleImageChange = (file) => {
    setImageError("");
    if (!file) {
      setImagePreview("");
      setNewPackage({ ...newPackage, packageImageFile: null });
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be 5 MB or smaller.");
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setNewPackage({ ...newPackage, packageImageFile: file });
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setNewPackage({
        ...newPackage,
        [section]: {
          ...newPackage[section],
          [field]: value
        }
      });
    } else {
      setNewPackage({
        ...newPackage,
        [field]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newpkg.trackingNumber || !newpkg.origin || !newpkg.destination) {
      alert("Please fill in all required fields");
      return;
    }
    setIsLoading(true);
    try {
      await onSave(newPackage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Package</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Package Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Package Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number *
                </label>
                <input
                  type="text"
                  value={newpkg.trackingNumber}
                  onChange={(e) => handleInputChange(null, 'trackingNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="APX001"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin *
                  </label>
                  <input
                    type="text"
                    value={newpkg.origin}
                    onChange={(e) => handleInputChange(null, 'origin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="India"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={newpkg.destination}
                    onChange={(e) => handleInputChange(null, 'destination', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Spain"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={newpkg.weight || ''}
                  onChange={(e) => handleInputChange(null, 'weight', parseFloat(e.target.value) || 0.1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="1.0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions (cm) *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newpkg.dimensions?.length || ''}
                    onChange={(e) => handleInputChange('dimensions', 'length', parseFloat(e.target.value) || 0.1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Length"
                    required
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newpkg.dimensions?.width || ''}
                    onChange={(e) => handleInputChange('dimensions', 'width', parseFloat(e.target.value) || 0.1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Width"
                    required
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newpkg.dimensions?.height || ''}
                    onChange={(e) => handleInputChange('dimensions', 'height', parseFloat(e.target.value) || 0.1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Height"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transport Mode
                  </label>
                  <select
                    value={newpkg.transportMode}
                    onChange={(e) => handleInputChange(null, 'transportMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="By Road">By Road</option>
                    <option value="By Air">By Air</option>
                    <option value="By Sea">By Sea</option>
                    <option value="By Rail">By Rail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Delivery
                  </label>
                  <input
                    type="date"
                    value={newpkg.expectedDelivery}
                    onChange={(e) => handleInputChange(null, 'expectedDelivery', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Sender Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2 text-secondary" />
                Sender Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newpkg.sender.name}
                  onChange={(e) => handleInputChange('sender', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newpkg.sender.email}
                  onChange={(e) => handleInputChange('sender', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={newpkg.sender.phone}
                  onChange={(e) => handleInputChange('sender', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="+447414686208"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  value={newpkg.sender.address}
                  onChange={(e) => handleInputChange('sender', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  rows="3"
                  placeholder="5 Montague Close, London SE1 9BB"
                  required
                />
              </div>
            </div>

            {/* Receiver Details */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-secondary" />
                Receiver Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newpkg.receiver.name}
                    onChange={(e) => handleInputChange('receiver', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Jane Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newpkg.receiver.email}
                    onChange={(e) => handleInputChange('receiver', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="jane@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newpkg.receiver.phone}
                    onChange={(e) => handleInputChange('receiver', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="+447414686208"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    value={newpkg.receiver.address}
                    onChange={(e) => handleInputChange('receiver', 'address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    rows="3"
                    placeholder="5 Montague Close, London SE1 9BB"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaBox className="mr-2 text-secondary" />
                Product Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newpkg.content || ''}
                    onChange={(e) => handleInputChange(null, 'content', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="MacBook Pro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newpkg.quantity || 1}
                    onChange={(e) => handleInputChange(null, 'quantity', parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newpkg.description || ''}
                    onChange={(e) => handleInputChange(null, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    rows="3"
                    placeholder="Apple MacBook Pro 14-inch, M3 Pro chip, 18GB RAM, 512GB SSD, Space Black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleImageChange(e.target.files?.[0])}
                        className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-white hover:file:bg-orange-600 file:cursor-pointer"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or WebP. Max 5 MB.
                      </p>
                      {imageError && (
                        <p className="mt-1 text-xs text-red-600">{imageError}</p>
                      )}
                    </div>
                    <div className="w-24 h-24 shrink-0 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaImage className="text-gray-300 text-2xl" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center min-w-[140px] justify-center ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-secondary text-white hover:bg-orange-600'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Add Package
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}