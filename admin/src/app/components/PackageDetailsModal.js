"use client";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTruck, FaClock, FaCheckCircle, FaExclamationTriangle, FaBox } from "react-icons/fa";
import { formatDeliveryDate } from "../utils/date";

export default function PackageDetailsModal({ package: pkg, onClose }) {
  const getStatusIcon = (status) => {
    if (status === "DELIVERED") return <FaCheckCircle className="text-green-500" />;
    if (status === "SHIPMENT ON HOLD") return <FaExclamationTriangle className="text-yellow-500" />;
    return <FaTruck className="text-blue-500" />;
  };

  const getStatusColor = (status) => {
    if (status === "DELIVERED") return "bg-green-100 text-green-800";
    if (status === "SHIPMENT ON HOLD") return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900 mr-4">Package Details</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)}`}>
              {pkg.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          {/* Package Overview */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">{pkg.trackingNumber}</div>
                <div className="text-sm text-gray-600">Tracking Number</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-1">{pkg.origin} → {pkg.destination}</div>
                <div className="text-sm text-gray-600">Route</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-1">{formatDeliveryDate(pkg.expectedDelivery)}</div>
                <div className="text-sm text-gray-600">Expected Delivery</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sender Information */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2 text-secondary" />
                Sender Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-3 w-4" />
                  <div>
                    <div className="font-medium text-gray-900">{pkg.sender.name}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3 w-4" />
                  <div>
                    <div className="text-gray-700">{pkg.sender.email}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-gray-400 mr-3 w-4" />
                  <div>
                    <a 
                      href={`https://wa.me/${pkg.sender.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer font-medium"
                    >
                      {pkg.sender.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-400 mr-3 w-4 mt-1" />
                  <div>
                    <div className="text-gray-700">{pkg.sender.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Receiver Information */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-secondary" />
                Receiver Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-3 w-4" />
                  <div>
                    <div className="font-medium text-gray-900">{pkg.receiver.name}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3 w-4" />
                  <div>
                    <div className="text-gray-700">{pkg.receiver.email}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-gray-400 mr-3 w-4" />
                  <div>
                    <a 
                      href={`https://wa.me/${pkg.receiver.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer font-medium"
                    >
                      {pkg.receiver.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-400 mr-3 w-4 mt-1" />
                  <div>
                    <div className="text-gray-700">{pkg.receiver.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaTruck className="mr-2 text-secondary" />
              Shipping Details
            </h3>
            <div className="bg-white border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Transport Mode</div>
                  <div className="font-medium text-gray-900">{pkg.transportMode}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Date Created</div>
                  <div className="font-medium text-gray-900">{pkg.dateTime}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Current Status</div>
                  <div className="flex items-center">
                    {getStatusIcon(pkg.status)}
                    <span className="ml-2 font-medium text-gray-900">{pkg.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          {(pkg.content || pkg.description || pkg.packageImage) && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaBox className="mr-2 text-secondary" />
                Product Details
              </h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {(pkg.packageImageUrl || pkg.packageImage) && (
                    <img
                      src={pkg.packageImageUrl || pkg.packageImage}
                      alt={pkg.content || "Product"}
                      className="w-32 h-32 shrink-0 rounded-lg border object-cover"
                    />
                  )}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Product Name</div>
                        <div className="font-medium text-gray-900">
                          {pkg.content || "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Quantity</div>
                        <div className="font-medium text-gray-900">
                          {pkg.quantity || 1}
                        </div>
                      </div>
                    </div>
                    {pkg.description && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Description</div>
                        <div className="text-gray-900">{pkg.description}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Events */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaClock className="mr-2 text-secondary" />
              Tracking Events
            </h3>
            <div className="bg-white border rounded-lg p-6">
              <div className="space-y-4">
                {pkg.events.map((event, index) => (
                  <div key={event.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        event.completed ? 'bg-green-500 border-green-500' :
                        event.current ? 'bg-yellow-500 border-yellow-500' :
                        'bg-gray-300 border-gray-300'
                      }`}></div>
                      {index < pkg.events.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 ml-1.5 mt-2"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{event.status}</div>
                          <div className="text-sm text-gray-600">{event.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{event.date}</div>
                          <div className="text-sm text-gray-600">{event.time}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}