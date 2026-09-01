"use client";
import { useState } from "react";
import { 
  FaBox, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTruck, 
  FaPlus, 
  FaSave, 
  FaTimes,
  FaCheck
} from "react-icons/fa";
import { formatDeliveryDate } from "../utils/date";

// "2026-08-15" + "14:30" -> ISO instant. Falls back to now if either input
// is empty/unparseable, so a malformed date never silently drops the event.
const toTimestamp = (date, time) => {
  if (!date) return new Date().toISOString();
  const parsed = new Date(`${date}T${time || "00:00"}`);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
};

// Local wall-clock date/time, in the format <input type="date"/"time"> need.
const nowLocalParts = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};

export default function PackageTrackingCard({ package: pkg, onAddEvent, onMarkComplete }) {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    location: "",
    ...nowLocalParts(),
    status: ""
  });

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

  const handleAddEvent = async () => {
    if (!newEvent.location || !newEvent.status) {
      alert("Please fill in location and status");
      return;
    }
    
    setIsLoading(true);
    try {
      await onAddEvent(pkg.id, {
        ...newEvent,
        timestamp: toTimestamp(newEvent.date, newEvent.time),
        completed: false,
        current: true
      });

      setNewEvent({
        location: "",
        ...nowLocalParts(),
        status: ""
      });
      setShowAddEvent(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Package Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <FaBox className="text-secondary text-xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{pkg.trackingNumber}</h3>
              <p className="text-sm text-gray-600">{pkg.origin} → {pkg.destination}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)}`}>
              {pkg.status}
            </span>
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="bg-secondary text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition-colors flex items-center text-sm"
            >
              <FaPlus className="mr-1" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Add Event Form */}
      {showAddEvent && (
        <div className="p-6 bg-gray-50 border-b">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Tracking Event</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                placeholder="Germany"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <input
                type="text"
                value={newEvent.status}
                onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                placeholder="Enter package status"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowAddEvent(false)}
              className="px-3 py-1 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center"
            >
              <FaTimes className="mr-1" />
              Cancel
            </button>
            <button
              onClick={handleAddEvent}
              disabled={isLoading}
              className={`px-3 py-1 rounded-lg transition-colors text-sm flex items-center min-w-[100px] justify-center ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-secondary text-white hover:bg-orange-600'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FaSave className="mr-1" />
                  Add Event
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tracking Timeline */}
      <div className="p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <FaClock className="mr-2 text-secondary" />
          Tracking Timeline
        </h4>
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
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="font-medium text-gray-900">{event.status}</div>
                      {event.current && !event.completed && (
                        <button
                          onClick={() => onMarkComplete(pkg.id, event.id)}
                          className="ml-3 bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 transition-colors flex items-center"
                        >
                          <FaCheck className="mr-1" />
                          Mark Complete
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-1" />
                      {event.location}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium text-gray-900">{event.date}</div>
                    <div className="text-sm text-gray-600">{event.time}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <FaTruck className="text-gray-400 mr-2" />
            <span className="text-gray-600">Transport:</span>
            <span className="ml-1 font-medium text-gray-900">{pkg.transportMode}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="text-gray-400 mr-2" />
            <span className="text-gray-600">Expected:</span>
            <span className="ml-1 font-medium text-gray-900">{formatDeliveryDate(pkg.expectedDelivery)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600">Events:</span>
            <span className="ml-1 font-medium text-gray-900">{pkg.events.length} total</span>
          </div>
        </div>
      </div>
    </div>
  );
}