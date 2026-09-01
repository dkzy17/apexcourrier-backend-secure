"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBox,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShippingFast,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaTimes,
  FaHistory,
  FaFileInvoice,
} from "react-icons/fa";
import AddPackageModal from "./components/AddPackageModal";
import PackageDetailsModal from "./components/PackageDetailsModal";
import EditPackageModal from "./components/EditPackageModal";
import PackageTrackingCard from "./components/PackageTrackingCard";
import InvoiceModal from "./components/InvoiceModal";
import ErrorBoundary from "./components/ErrorBoundary";
import PasswordProtection from "./components/PasswordProtection";
import ApiService from "./utils/api";
import { toDateInputValue, formatDeliveryDate } from "./utils/date";

export default function AdminDashboard() {
  const [packages, setPackages] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("packages");
  const [showInvoice, setShowInvoice] = useState(null);
  const [deletingPackageId, setDeletingPackageId] = useState(null);

  // Load packages only after an authenticated admin session exists.
  useEffect(() => {
    const SESSION_KEY = "admin_auth_token";

    const loadPackages = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(SESSION_KEY)
          : null;

      // Do not call protected endpoints before authentication.
      if (!token) {
        console.log(
          "Skipping package load until admin authentication is complete."
        );
        return;
      }

      try {
        console.log("Loading packages from API...");
        const data = await ApiService.getPackages();
        console.log("Packages loaded successfully:", data.length, "packages");

        // Transform API data to match component expectations
        const transformedPackages = data.map((pkg) => ({
          id: pkg._id,
          trackingNumber: pkg.trackingNumber,
          sender: pkg.sender,
          receiver: pkg.receiver,
          origin: pkg.sender.address,
          destination: pkg.receiver.address,
          status: pkg.status,
          transportMode: pkg.transportMode,
          content: pkg.content || "",
          quantity: pkg.quantity || 1,
          description: pkg.description || "",
          packageImage: pkg.packageImageUrl || "",
          expectedDelivery: toDateInputValue(pkg.expectedDelivery),
          dateTime: new Date(pkg.createdAt).toLocaleDateString(),
          events: pkg.events.map((event, index) => ({
            id: index + 1,
            location: event.location,
            date: new Date(event.timestamp).toLocaleDateString(),
            time: new Date(event.timestamp).toLocaleTimeString(),
            status: event.status,
            current: index === pkg.events.length - 1,
            completed: index < pkg.events.length - 1,
          })),
        }));
        setPackages(transformedPackages);
      } catch (error) {
        console.error("Failed to load packages:", {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });
        alert(
          "Failed to load packages. Please check your internet connection and try refreshing the page."
        );
        // Fallback to empty array if API fails
        setPackages([]);
      }
    };

    const handleAuthenticated = () => {
      console.log(
        "Admin authentication completed. Loading packages..."
      );
      loadPackages();
    };

    window.addEventListener(
      "admin-authenticated",
      handleAuthenticated
    );

    // Load immediately when a valid session already exists.
    loadPackages();

    return () => {
      window.removeEventListener(
        "admin-authenticated",
        handleAuthenticated
      );
    };
  }, []);

  const [newPackage, setNewPackage] = useState({
    trackingNumber: "",
    sender: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    receiver: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    origin: "",
    destination: "",
    weight: 1,
    dimensions: {
      length: 10,
      width: 10,
      height: 10,
    },
    transportMode: "By Road",
    expectedDelivery: "",
    status: "PACKAGE RECEIVED",
    content: "",
    quantity: 1,
    description: "",
    packageImageFile: null,
  });

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.receiver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPackage = async (packageToAdd = newPackage) => {
    try {
      console.log("Creating package with data:", packageToAdd);
      // Transform package data to match API expectations
      const pkgData = {
        trackingNumber: packageToAdd.trackingNumber,
        sender: packageToAdd.sender,
        receiver: packageToAdd.receiver,
        weight: packageToAdd.weight || 1,
        dimensions: packageToAdd.dimensions || {
          length: 10,
          width: 10,
          height: 10,
        },
        serviceType: "Standard", // Default service type
        transportMode:
          packageToAdd.transportMode === "By Road"
            ? "Ground"
            : packageToAdd.transportMode === "By Air"
              ? "Air"
              : packageToAdd.transportMode === "By Sea"
                ? "Sea"
                : packageToAdd.transportMode === "By Rail"
                  ? "Rail"
                  : "Ground",
        status: packageToAdd.status,
        content: packageToAdd.content || "",
        quantity: packageToAdd.quantity || 1,
        description: packageToAdd.description || "",
        expectedDelivery: packageToAdd.expectedDelivery || "",
      };

      const createdPackage = await ApiService.createPackage(
        pkgData,
        packageToAdd.packageImageFile
      );

      // Transform created package to match component expectations
      const packageWithId = {
        id: createdPackage._id,
        trackingNumber: createdPackage.trackingNumber,
        sender: createdPackage.sender,
        receiver: createdPackage.receiver,
        origin: createdPackage.sender.address,
        destination: createdPackage.receiver.address,
        status: createdPackage.status,
        transportMode: createdPackage.transportMode,
        content: createdPackage.content || "",
        quantity: createdPackage.quantity || 1,
        description: createdPackage.description || "",
        packageImage: createdPackage.packageImageUrl || "",
        expectedDelivery: toDateInputValue(createdPackage.expectedDelivery),
        dateTime: new Date(createdPackage.createdAt).toLocaleDateString(),
        events: createdPackage.events.map((event, index) => ({
          id: index + 1,
          location: event.location,
          date: new Date(event.timestamp).toLocaleDateString(),
          time: new Date(event.timestamp).toLocaleTimeString(),
          status: event.status,
          current: index === createdPackage.events.length - 1,
          completed: index < createdPackage.events.length - 1,
        })),
      };

      setPackages([...packages, packageWithId]);
      setNewPackage({
        trackingNumber: "",
        sender: { name: "", email: "", phone: "", address: "" },
        receiver: { name: "", email: "", phone: "", address: "" },
        origin: "",
        destination: "",
        transportMode: "By Road",
        expectedDelivery: "",
        status: "PACKAGE RECEIVED",
        content: "",
        quantity: 1,
        description: "",
        packageImageFile: null,
      });
      setShowAddForm(false);
      // Show invoice after package creation
      setShowInvoice(packageWithId);
    } catch (error) {
      console.error("Failed to create package:", error);
      alert(`Failed to create package:\n\n${error.message}`);
    }
  };

  const handleDeletePackage = async (id) => {
    setDeletingPackageId(id);
    try {
      await ApiService.deletePackage(id);
      setPackages(packages.filter((pkg) => pkg.id !== id));
    } catch (error) {
      console.error("Failed to delete package:", error);
      alert("Failed to delete pkg. Please try again.");
    } finally {
      setDeletingPackageId(null);
    }
  };

  const handleAddEvent = async (packageId, newEvent) => {
    try {
      const eventData = {
        location: newEvent.location,
        status: newEvent.status,
        timestamp: newEvent.timestamp || new Date().toISOString(),
      };

      const updatedPackage = await ApiService.addTrackingEvent(
        packageId,
        eventData
      );

      // Transform updated package to match component expectations
      const transformedPackage = {
        id: updatedPackage._id,
        trackingNumber: updatedPackage.trackingNumber,
        sender: updatedPackage.sender,
        receiver: updatedPackage.receiver,
        origin: updatedPackage.sender.address,
        destination: updatedPackage.receiver.address,
        status: updatedPackage.status,
        transportMode: updatedPackage.transportMode,
        content: updatedPackage.content || "",
        quantity: updatedPackage.quantity || 1,
        description: updatedPackage.description || "",
        packageImage: updatedPackage.packageImageUrl || "",
        expectedDelivery: toDateInputValue(updatedPackage.expectedDelivery),
        dateTime: new Date(updatedPackage.createdAt).toLocaleDateString(),
        events: updatedPackage.events.map((event, index) => ({
          id: index + 1,
          location: event.location,
          date: new Date(event.timestamp).toLocaleDateString(),
          time: new Date(event.timestamp).toLocaleTimeString(),
          status: event.status,
          current: index === updatedPackage.events.length - 1,
          completed: index < updatedPackage.events.length - 1,
        })),
      };

      setPackages(
        packages.map((pkg) => (pkg.id === packageId ? transformedPackage : pkg))
      );
    } catch (error) {
      console.error("Failed to add tracking event:", error);
      alert("Failed to add tracking event. Please try again.");
    }
  };

  const handleMarkEventComplete = (packageId, eventId) => {
    setPackages(
      packages.map((pkg) => {
        if (pkg.id === packageId) {
          return {
            ...pkg,
            events: pkg.events.map((event) =>
              event.id === eventId
                ? { ...event, completed: true, current: false }
                : event
            ),
          };
        }
        return pkg;
      })
    );
  };

  return (
    <PasswordProtection>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <FaBox className="text-secondary text-2xl mr-3" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    ApexCourrier Admin
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search packages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("packages")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "packages"
                      ? "border-secondary text-secondary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <FaBox className="inline mr-2" />
                  Package Management
                </button>
                <button
                  onClick={() => setActiveTab("tracking")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "tracking"
                      ? "border-secondary text-secondary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <FaTruck className="inline mr-2" />
                  Tracking & Events
                </button>
                <Link
                  href="/email"
                  className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-secondary hover:border-secondary flex items-center"
                >
                  <FaEnvelope className="inline mr-2" />
                  Send Email
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "packages" && (
              <div>
                {/* Add Package Button */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Add New Package
                  </button>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-lg shadow-sm border p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {pkg.trackingNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {pkg.origin} → {pkg.destination}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${pkg.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : pkg.status === "SHIPMENT ON HOLD"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {pkg.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUser className="mr-2" />
                          <span>{pkg.sender.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{pkg.receiver.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaClock className="mr-2" />
                          <span>
                            Expected: {formatDeliveryDate(pkg.expectedDelivery)}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mb-2">
                        <button
                          onClick={() => setSelectedPackage(pkg)}
                          className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center"
                        >
                          <FaEye className="mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => setEditingPackage(pkg)}
                          className="flex-1 bg-yellow-50 text-yellow-600 px-3 py-2 rounded text-sm hover:bg-yellow-100 transition-colors flex items-center justify-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          disabled={deletingPackageId === pkg.id}
                          className={`flex-1 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center ${deletingPackageId === pkg.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                        >
                          {deletingPackageId === pkg.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-400 border-t-transparent mr-1"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FaTrash className="mr-1" />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowInvoice(pkg)}
                          className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded text-sm hover:bg-green-100 transition-colors flex items-center justify-center"
                        >
                          <FaFileInvoice className="mr-1" />
                          View Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "tracking" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Package Tracking & Events
                </h2>
                <div className="space-y-6">
                  {filteredPackages.map((pkg) => (
                    <PackageTrackingCard
                      key={pkg.id}
                      package={pkg}
                      onAddEvent={handleAddEvent}
                      onMarkComplete={handleMarkEventComplete}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Add Package Modal */}
          {showAddForm && (
            <AddPackageModal
              newPackage={newPackage}
              setNewPackage={setNewPackage}
              onSave={handleAddPackage}
              onClose={() => setShowAddForm(false)}
            />
          )}

          {/* Package Details Modal */}
          {selectedPackage && (
            <PackageDetailsModal
              package={selectedPackage}
              onClose={() => setSelectedPackage(null)}
            />
          )}

          {/* Edit Package Modal */}
          {editingPackage && (
            <EditPackageModal
              package={editingPackage}
              onSave={async (updatedPackage) => {
                try {
                  // Transform updated package data to match API expectations
                  const pkgData = {
                    sender: updatedPackage.sender,
                    receiver: updatedPackage.receiver,
                    weight: 1, // Default weight
                    dimensions: { length: 10, width: 10, height: 10 }, // Default dimensions
                    serviceType: "Standard", // Default service type
                    transportMode:
                      updatedPackage.transportMode === "By Road"
                        ? "Ground"
                        : updatedPackage.transportMode === "By Air"
                          ? "Air"
                          : updatedPackage.transportMode === "By Sea"
                            ? "Sea"
                            : updatedPackage.transportMode === "By Rail"
                              ? "Rail"
                              : "Ground",
                    status: updatedPackage.status,
                    content: updatedPackage.content || "",
                    quantity: updatedPackage.quantity || 1,
                    description: updatedPackage.description || "",
                    expectedDelivery: updatedPackage.expectedDelivery || "",
                  };

                  const updated = await ApiService.updatePackage(
                    updatedPackage.id,
                    pkgData,
                    updatedPackage.packageImageFile
                  );

                  // Transform updated package to match component expectations
                  const transformedPackage = {
                    id: updated._id,
                    trackingNumber: updated.trackingNumber,
                    sender: updated.sender,
                    receiver: updated.receiver,
                    origin: updated.sender.address,
                    destination: updated.receiver.address,
                    status: updated.status,
                    transportMode: updated.transportMode,
                    content: updated.content || "",
                    quantity: updated.quantity || 1,
                    description: updated.description || "",
                    packageImage: updated.packageImageUrl || "",
                    expectedDelivery: toDateInputValue(updated.expectedDelivery),
                    dateTime: new Date(updated.createdAt).toLocaleDateString(),
                    events: updated.events.map((event, index) => ({
                      id: index + 1,
                      location: event.location,
                      date: new Date(event.timestamp).toLocaleDateString(),
                      time: new Date(event.timestamp).toLocaleTimeString(),
                      status: event.status,
                      current: index === updated.events.length - 1,
                      completed: index < updated.events.length - 1,
                    })),
                  };

                  setPackages(
                    packages.map((pkg) =>
                      pkg.id === updatedPackage.id ? transformedPackage : pkg
                    )
                  );
                  setEditingPackage(null);
                } catch (error) {
                  console.error("Failed to update package:", error);
                  alert(`Failed to update package:\n\n${error.message}`);
                }
              }}
              onClose={() => setEditingPackage(null)}
            />
          )}

          {/* Invoice Modal */}
          {showInvoice && (
            <InvoiceModal
              package={showInvoice}
              onClose={() => setShowInvoice(null)}
            />
          )}
        </div>
      </ErrorBoundary>
    </PasswordProtection>
  );
}