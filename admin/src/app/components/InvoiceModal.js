"use client";
import { useState } from "react";
import {
  FaTimes,
  FaDownload,
  FaPrint,
  FaFileInvoice,
  FaBox,
  FaUser,
  FaMapMarkerAlt,
  FaCalendar,
  FaTruck,
  FaStamp,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { formatDeliveryDate } from "../utils/date";

export default function InvoiceModal({ package: pkg, onClose }) {
  const [receiptData] = useState({
    receiptNumber: `RCP-${pkg.trackingNumber}-${Date.now()
      .toString()
      .slice(-6)}`,
    issueDate: new Date().toLocaleDateString(),
    serviceDate: pkg.dateTime || new Date().toLocaleDateString(),
  });

  const [shippingPrice, setShippingPrice] = useState({
    basePrice: 25.0,
    insurance: 5.0,
    handling: 3.5,
    tax: 2.85,
  });

  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const totalPrice =
    shippingPrice.basePrice +
    shippingPrice.insurance +
    shippingPrice.handling +
    shippingPrice.tax;

  const formatPrice = (price) => {
    const formatted = price.toFixed(2);
    const [whole, decimal] = formatted.split(".");
    if (whole.length >= 4) {
      return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimal;
    }
    return formatted;
  };

  const handlePriceChange = (field, value) => {
    setShippingPrice((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Store package data in localStorage as backup
    const pkgData = {
      receiptNumber: `RCP-${pkg.trackingNumber}-${Date.now()
        .toString()
        .slice(-6)}`,
      trackingNumber: pkg.trackingNumber,
      sender: {
        name: pkg.sender?.name || "N/A",
        email: pkg.sender?.email || "N/A",
        phone: pkg.sender?.phone || "N/A",
        address: pkg.sender?.address || "N/A",
      },
      receiver: {
        name: pkg.receiver?.name || "N/A",
        email: pkg.receiver?.email || "N/A",
        phone: pkg.receiver?.phone || "N/A",
        address: pkg.receiver?.address || "N/A",
      },
      weight: pkg.weight || "N/A",
      serviceType: pkg.serviceType || "N/A",
      description: pkg.description || "Package delivery",
      dateTime: pkg.dateTime || new Date().toLocaleString(),
    };

    localStorage.setItem("receiptPackage", JSON.stringify(packageData));

    // Open receipt page in new tab with pricing parameters
    const priceParams = new URLSearchParams({
      basePrice: shippingPrice.basePrice.toString(),
      insurance: shippingPrice.insurance.toString(),
      handling: shippingPrice.handling.toString(),
      tax: shippingPrice.tax.toString(),
    });
    const receiptUrl = `/receipt/${pkg.trackingNumber
      }?${priceParams.toString()}`;
    window.open(receiptUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:static print:inset-auto print:bg-white print:bg-opacity-100">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none print:max-w-none print:mx-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 print:bg-white print:text-gray-800 print:border-b-2 print:border-blue-600">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm print:bg-blue-100 print:bg-opacity-100">
                <FaTruck className="text-white text-2xl print:text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white print:text-gray-800">
                  Receipt Generated
                </h2>
                <p className="text-blue-100 print:text-gray-600">
                  Professional Shipping Services
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center text-sm font-medium shadow-lg"
              >
                <FaPrint className="mr-2" />
                Print Receipt
              </button>
              <button
                onClick={handleDownload}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center text-sm font-medium shadow-lg"
              >
                <FaDownload className="mr-2" />
                Download Receipt
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Receipt Content */}
        <div
          id="receipt-content"
          className="p-8 bg-gray-50 print:p-6 print:bg-white"
        >
          {/* Company Header */}
          <div className="text-center mb-10 bg-white rounded-xl p-6 shadow-sm border border-gray-100 print:shadow-none print:border-gray-300 print:mb-6 print:p-4">
            <div className="flex justify-center items-center mb-4 print:mb-3">
              <img
                src="/logo.png"
                alt="ApexCourrier Logo"
                className="w-24 h-24 object-contain mr-6 print:w-16 print:h-16 print:mr-4"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl items-center justify-center mr-6 shadow-lg print:w-16 print:h-16 print:mr-4 print:shadow-none"
                style={{ display: "none" }}
              >
                <FaTruck className="text-white text-4xl print:text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent print:text-2xl print:text-gray-800">
                  ApexCourrier
                </h1>
                <p className="text-gray-600 text-lg font-medium print:text-base">
                  Professional Shipping Services
                </p>
                <p className="text-gray-500 text-sm mt-1 print:text-xs">
                  5 Montague Close, London SE1 9BB
                </p>
              </div>
            </div>
          </div>

          {/* Receipt Header */}
          <div className="flex justify-between items-start mb-10 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                RECEIPT
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-28">
                    Receipt #:
                  </span>
                  <span className="text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded-lg">
                    {receiptData.receiptNumber}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-28">
                    Issue Date:
                  </span>
                  <span className="text-gray-900">{receiptData.issueDate}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-28">
                    Service Date:
                  </span>
                  <span className="text-gray-900">
                    {receiptData.serviceDate}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-28">
                    Tracking #:
                  </span>
                  <span className="text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded-lg">
                    {pkg.trackingNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Stamp */}
            <div className="relative">
              <div className="w-36 h-36 border-4 border-red-500 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 transform rotate-12 shadow-lg">
                <FaStamp className="text-red-500 text-3xl mb-2" />
                <div className="text-center">
                  <p className="text-red-500 font-bold text-sm">OFFICIAL</p>
                  <p className="text-red-500 font-semibold text-xs">
                    ApexCourrier
                  </p>
                  <p className="text-red-500 text-xs font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* From (Sender) & To (Receiver) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FaUser className="text-blue-600 text-sm" />
                </div>
                From (Sender)
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {pkg.sender.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <span className="w-20 text-sm font-medium">Phone:</span>
                    <span>{pkg.sender.phone}</span>
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <span className="w-20 text-sm font-medium">Email:</span>
                    <span>{pkg.sender.email}</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Address:
                  </p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {pkg.sender.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FaMapMarkerAlt className="text-green-600 text-sm" />
                </div>
                Ship To (Receiver)
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {pkg.receiver.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <span className="w-20 text-sm font-medium">Phone:</span>
                    <span>{pkg.receiver.phone}</span>
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <span className="w-20 text-sm font-medium">Email:</span>
                    <span>{pkg.receiver.email}</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Address:
                  </p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {pkg.receiver.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FaBox className="mr-2 text-secondary" />
              Package Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Route</p>
                <p className="font-medium text-gray-900">
                  {pkg.origin} → {pkg.destination}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transport Mode</p>
                <p className="font-medium text-gray-900">{pkg.transportMode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expected Delivery</p>
                <p className="font-medium text-gray-900">
                  {formatDeliveryDate(pkg.expectedDelivery)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Cost Breakdown */}
          <div className="mb-10 print:mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 print:shadow-none print:border-gray-300 print:p-4">
              <div className="flex justify-between items-center mb-6 print:mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center print:text-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 print:w-6 print:h-6 print:mr-2">
                    <FaBox className="text-green-600 text-sm print:text-xs" />
                  </div>
                  Shipping Cost Breakdown
                </h3>
                <button
                  onClick={() => setIsEditingPrice(!isEditingPrice)}
                  className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium print:hidden"
                >
                  {isEditingPrice ? (
                    <FaSave className="mr-2" />
                  ) : (
                    <FaEdit className="mr-2" />
                  )}
                  {isEditingPrice ? "Save" : "Edit Prices"}
                </button>
              </div>

              <div className="space-y-4 print:space-y-2">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 print:p-3 print:bg-blue-50 print:border-blue-300">
                  <span className="font-semibold text-blue-800 print:text-sm">
                    Base Shipping Fee
                  </span>
                  {isEditingPrice ? (
                    <input
                      type="number"
                      step="0.01"
                      value={shippingPrice.basePrice}
                      onChange={(e) =>
                        handlePriceChange("basePrice", e.target.value)
                      }
                      className="w-24 px-2 py-1 border border-blue-300 rounded text-right font-medium print:hidden"
                    />
                  ) : (
                    <span className="text-blue-900 font-medium bg-white px-3 py-1 rounded-lg shadow-sm print:shadow-none print:px-2 print:text-sm">
                      £{formatPrice(shippingPrice.basePrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 print:p-3 print:bg-purple-50 print:border-purple-300">
                  <span className="font-semibold text-purple-800 print:text-sm">
                    Insurance Coverage
                  </span>
                  {isEditingPrice ? (
                    <input
                      type="number"
                      step="0.01"
                      value={shippingPrice.insurance}
                      onChange={(e) =>
                        handlePriceChange("insurance", e.target.value)
                      }
                      className="w-24 px-2 py-1 border border-purple-300 rounded text-right font-medium print:hidden"
                    />
                  ) : (
                    <span className="text-purple-900 font-medium bg-white px-3 py-1 rounded-lg shadow-sm print:shadow-none print:px-2 print:text-sm">
                      £{formatPrice(shippingPrice.insurance)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 print:p-3 print:bg-orange-50 print:border-orange-300">
                  <span className="font-semibold text-orange-800 print:text-sm">
                    Handling Fee
                  </span>
                  {isEditingPrice ? (
                    <input
                      type="number"
                      step="0.01"
                      value={shippingPrice.handling}
                      onChange={(e) =>
                        handlePriceChange("handling", e.target.value)
                      }
                      className="w-24 px-2 py-1 border border-orange-300 rounded text-right font-medium print:hidden"
                    />
                  ) : (
                    <span className="text-orange-900 font-medium bg-white px-3 py-1 rounded-lg shadow-sm print:shadow-none print:px-2 print:text-sm">
                      £{formatPrice(shippingPrice.handling)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 print:p-3 print:bg-gray-50 print:border-gray-300">
                  <span className="font-semibold text-gray-800 print:text-sm">
                    VAT (20%)
                  </span>
                  {isEditingPrice ? (
                    <input
                      type="number"
                      step="0.01"
                      value={shippingPrice.tax}
                      onChange={(e) => handlePriceChange("tax", e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-right font-medium print:hidden"
                    />
                  ) : (
                    <span className="text-gray-900 font-medium bg-white px-3 py-1 rounded-lg shadow-sm print:shadow-none print:px-2 print:text-sm">
                      £{formatPrice(shippingPrice.tax)}
                    </span>
                  )}
                </div>

                <div className="border-t-2 border-gray-300 pt-4 print:pt-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border-2 border-green-300 print:p-3 print:bg-green-100 print:border-green-400">
                    <span className="font-bold text-green-800 text-lg print:text-base">
                      Total Amount
                    </span>
                    <span className="text-green-900 font-bold text-xl bg-white px-4 py-2 rounded-lg shadow-md print:text-lg print:px-3 print:py-1 print:shadow-none">
                      £{formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Stamp */}
          <div className="flex justify-end mb-6">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-red-600 rounded-full flex items-center justify-center bg-red-50 transform rotate-12">
                <div className="text-center">
                  <div className="text-red-600 font-bold text-xs mb-1">
                    OFFICIAL
                  </div>
                  <FaStamp className="text-red-600 text-2xl mx-auto mb-1" />
                  <div className="text-red-600 font-bold text-xs">
                    ApexCourrier
                  </div>
                  <div className="text-red-600 text-xs">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information & Notes */}
          <div className="mb-10">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <FaStamp className="text-indigo-600 text-sm" />
                </div>
                Service Information & Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-green-800 text-sm font-medium">
                      Package handled with professional care and attention
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-800 text-sm font-medium">
                      Real-time tracking available throughout delivery process
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-purple-800 text-sm font-medium">
                      Insurance coverage included for package protection
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-orange-800 text-sm font-medium">
                      Customer support available 24/7 for any inquiries
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-teal-800 text-sm font-medium">
                      Delivery confirmation provided upon completion
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-pink-800 text-sm font-medium">
                      Eco-friendly packaging and carbon-neutral delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-center text-white">
            <div className="mb-4">
              <h4 className="text-lg font-bold mb-2">
                Thank you for choosing ApexCourrier!
              </h4>
              <p className="text-blue-100 text-sm">
                Your trusted partner for professional shipping and logistics
                services
              </p>
            </div>
            <div className="border-t border-white border-opacity-20 pt-4 space-y-2">
              <p className="text-blue-100 text-xs">
                This receipt was generated electronically and is valid without
                signature.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-1 md:space-y-0 md:space-x-6 text-xs text-blue-100">
                <span>📧 support@apexcourrier.com</span>
                {/* <span>📞 +91 98765 43210</span> */}
                <span>🌐 www.apexcourrier.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
