"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  FaBox,
  FaUser,
  FaMapMarkerAlt,
  FaCalendar,
  FaTruck,
  FaStamp,
  FaQrcode,
  FaBarcode,
  FaCreditCard,
  FaShieldAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";
import ApiService from "../../utils/api";

export default function ReceiptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [packageData, setPackageData] = useState(null);
  const [shippingPrice, setShippingPrice] = useState({
    basePrice: parseFloat(searchParams.get("basePrice")) || 25.0,
    insurance: parseFloat(searchParams.get("insurance")) || 5.0,
    handling: parseFloat(searchParams.get("handling")) || 3.5,
    tax: parseFloat(searchParams.get("tax")) || 6.7,
  });

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

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const trackingNumber = params.id;
        console.log(
          "Fetching package data for tracking number:",
          trackingNumber
        );

        const pkgData = await ApiService.getPackageByTracking(
          trackingNumber
        );

        if (packageData) {
          setPackageData(packageData);
          console.log("Package data fetched successfully:", packageData);
        } else {
          console.error(
            "Package not found for tracking number:",
            trackingNumber
          );
          // Fallback to localStorage if API fails
          const storedPackage = localStorage.getItem("receiptPackage");
          if (storedPackage) {
            setPackageData(JSON.parse(storedPackage));
            console.log("Using fallback data from localStorage");
          }
        }
      } catch (error) {
        console.error("Error fetching package data:", error);
        // Fallback to localStorage if API fails
        const storedPackage = localStorage.getItem("receiptPackage");
        if (storedPackage) {
          setPackageData(JSON.parse(storedPackage));
          console.log("Using fallback data from localStorage due to API error");
        }
      }
    };

    fetchPackageData();

    // Auto-trigger PDF download after component mounts
    const timer = setTimeout(() => {
      window.print();
    }, 2000); // Increased delay to allow data fetching

    return () => clearTimeout(timer);
  }, [params.id]);

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 print:p-0 print:bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .receipt-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
          }
          @page {
            margin: 0.5in;
            size: A4;
          }
          .no-print {
            display: none !important;
          }
        }
        
        .receipt-paper {
          background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Receipt Content */}
      <div className="max-w-4xl mx-auto bg-white receipt-paper border border-gray-200 print:border-none print:shadow-none">
        {/* Company Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 print:bg-blue-600 print:p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="ApexCourrier Logo"
                className="w-20 h-20 object-contain mr-6 bg-white rounded-lg p-2 print:w-16 print:h-16 print:mr-4"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="w-20 h-20 bg-white rounded-lg items-center justify-center mr-6 print:w-16 print:h-16 print:mr-4"
                style={{ display: "none" }}
              >
                <FaTruck className="text-blue-600 text-3xl print:text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold print:text-2xl">
                  ApexCourrier
                </h1>
                <p className="text-blue-100 text-lg font-medium print:text-base">
                  International Shipping & Logistics Solutions
                </p>
                <div className="flex items-center mt-2 text-blue-200 text-sm print:text-xs">
                  <FaShieldAlt className="mr-2" />
                  <span>Licensed & Insured • Est. 2018</span>
                </div>
              </div>
            </div>
            <div className="text-right text-blue-100">
              <div className="space-y-1 text-sm print:text-xs">
                {/* <div className="flex items-center justify-end"> */}
                {/* <FaPhone className="mr-2" />
                  <span>+44 20 7946 0958</span>
                </div> */}
                <div className="flex items-center justify-end">
                  <FaEnvelope className="mr-2" />
                  <span>support@apexcourrier.com</span>
                </div>
                <div className="flex items-center justify-end">
                  <FaGlobe className="mr-2" />
                  <span>www.apexcourrier.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-blue-500 text-center">
            <p className="text-blue-100 text-sm print:text-xs">
              <strong>Registered Office:</strong> 5 Montague Close, London SE1 9BB, United Kingdom
            </p>
            <p className="text-blue-200 text-xs mt-1">
              Company Registration: 11234567 • VAT Number: GB123456789
            </p>
          </div>
        </div>

        {/* Receipt Header */}
        <div className="bg-white border-b-2 border-gray-200 p-8 print:p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg mr-4">
                  <span className="font-bold text-lg print:text-base">RECEIPT</span>
                </div>
                <div className="text-gray-600">
                  <div className="text-sm print:text-xs">Document Type: Shipping Receipt</div>
                  <div className="text-sm print:text-xs">Status: PAID</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 print:gap-4">
                <div className="space-y-3 print:space-y-2">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-32 print:text-sm print:w-28">
                      Receipt No:
                    </span>
                    <span className="receipt-mono text-gray-900 bg-gray-100 px-3 py-1 rounded print:bg-gray-50 print:px-2 print:text-sm">
                      RCP-{packageData.trackingNumber}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-32 print:text-sm print:w-28">
                      Issue Date:
                    </span>
                    <span className="text-gray-900 print:text-sm">
                      {new Date().toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {/* <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-32 print:text-sm print:w-28">
                      Issue Time:
                    </span>
                    <span className="text-gray-900 print:text-sm">
                      {new Date().toLocaleTimeString("en-GB", { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                      })}
                    </span>
                  </div> */}
                </div>

                <div className="space-y-3 print:space-y-2">
                  {/* <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-32 print:text-sm print:w-28">
                      Payment Method:
                    </span>
                    <div className="flex items-center">
                      <FaCreditCard className="text-green-600 mr-2" />
                      <span className="text-gray-900 print:text-sm">Card Payment</span>
                    </div>
                  </div> */}
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-32 print:text-sm print:w-28">
                      Transaction ID:
                    </span>
                    <span className="receipt-mono text-gray-900 bg-gray-100 px-3 py-1 rounded print:bg-gray-50 print:px-2 print:text-sm">
                      TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-32 print:text-sm print:w-28">
                      Cashier:
                    </span>
                    <span className="text-gray-900 print:text-sm">System Auto</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg mb-4 print:bg-blue-50 print:border-blue-300 print:p-3">
                <p className="text-sm text-blue-700 font-medium print:text-xs mb-2">
                  Tracking Number
                </p>
                <p className="text-2xl font-bold text-blue-900 receipt-mono print:text-lg mb-2">
                  {packageData.trackingNumber}
                </p>
                <div className="flex justify-center">
                  <FaBarcode className="text-4xl text-gray-700 print:text-2xl" />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg print:p-2">
                <div className="flex justify-center mb-2">
                  <FaQrcode className="text-3xl text-gray-600 print:text-2xl" />
                </div>
                <p className="text-xs text-gray-600 text-center print:text-[10px]">
                  Scan for tracking
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="mb-10 print:mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 print:shadow-none print:border-gray-300 print:p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center print:text-lg print:mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 print:w-6 print:h-6 print:mr-2">
                <FaBox className="text-blue-600 text-sm print:text-xs" />
              </div>
              Package Details
            </h3>

            <div className="grid md:grid-cols-2 gap-8 print:gap-4">
              {/* Sender Information */}
              <div className="space-y-4 print:space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center print:text-sm">
                  <FaUser className="mr-2 text-blue-600 print:text-xs" />
                  Sender Information
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 print:bg-blue-50 print:border-blue-300 print:p-3">
                  <div className="space-y-2 print:space-y-1">
                    <div>
                      <span className="font-medium text-blue-800 print:text-sm">
                        Name:
                      </span>
                      <span className="ml-2 text-blue-900 print:text-sm">
                        {packageData.sender?.name ||
                          packageData.senderName ||
                          "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800 print:text-sm">
                        Phone:
                      </span>
                      {(packageData.sender?.phone || packageData.senderPhone) &&
                        (packageData.sender?.phone || packageData.senderPhone) !==
                        "N/A" ? (
                        <a
                          href={`https://wa.me/${(
                            packageData.sender?.phone || packageData.senderPhone
                          ).replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer font-medium print:text-blue-900"
                        >
                          {packageData.sender?.phone || packageData.senderPhone}
                        </a>
                      ) : (
                        <span className="ml-2 text-blue-900 print:text-sm">
                          N/A
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-blue-800 print:text-sm">
                        Address:
                      </span>
                      <span className="ml-2 text-blue-900 print:text-sm">
                        {packageData.sender?.address ||
                          packageData.senderAddress ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receiver Information */}
              <div className="space-y-4 print:space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center print:text-sm">
                  <FaUser className="mr-2 text-purple-600 print:text-xs" />
                  Receiver Information
                </h4>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 print:bg-purple-50 print:border-purple-300 print:p-3">
                  <div className="space-y-2 print:space-y-1">
                    <div>
                      <span className="font-medium text-purple-800 print:text-sm">
                        Name:
                      </span>
                      <span className="ml-2 text-purple-900 print:text-sm">
                        {packageData.receiver?.name ||
                          packageData.receiverName ||
                          "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-purple-800 print:text-sm">
                        Phone:
                      </span>
                      {(packageData.receiver?.phone ||
                        packageData.receiverPhone) &&
                        (packageData.receiver?.phone ||
                          packageData.receiverPhone) !== "N/A" ? (
                        <a
                          href={`https://wa.me/${(
                            packageData.receiver?.phone ||
                            packageData.receiverPhone
                          ).replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-purple-600 hover:text-purple-800 transition-colors cursor-pointer font-medium print:text-purple-900"
                        >
                          {packageData.receiver?.phone ||
                            packageData.receiverPhone}
                        </a>
                      ) : (
                        <span className="ml-2 text-purple-900 print:text-sm">
                          N/A
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-purple-800 print:text-sm">
                        Address:
                      </span>
                      <span className="ml-2 text-purple-900 print:text-sm">
                        {packageData.receiver?.address ||
                          packageData.receiverAddress ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="mt-8 print:mt-4">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center print:text-sm print:mb-2">
                <FaBox className="mr-2 text-green-600 print:text-xs" />
                Package Information
              </h4>
              <div className="grid md:grid-cols-3 gap-4 print:gap-2">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200 print:bg-green-50 print:border-green-300 print:p-3">
                  <span className="font-medium text-green-800 block print:text-sm">
                    Weight:
                  </span>
                  <span className="text-green-900 font-semibold print:text-sm">
                    {packageData.weight} kg
                  </span>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 print:bg-orange-50 print:border-orange-300 print:p-3">
                  <span className="font-medium text-orange-800 block print:text-sm">
                    Service Type:
                  </span>
                  <span className="text-orange-900 font-semibold print:text-sm">
                    {packageData.serviceType}
                  </span>
                </div>
                {/* <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 print:bg-gray-50 print:border-gray-300 print:p-3">
                  <span className="font-medium text-gray-800 block print:text-sm">
                    Description:
                  </span>
                  <span className="text-gray-900 font-semibold print:text-sm">
                    {packageData.description}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Cost Breakdown */}
        <div className="mb-10 print:mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 print:shadow-none print:border-gray-300 print:p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center print:text-lg print:mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 print:w-6 print:h-6 print:mr-2">
                <FaBox className="text-green-600 text-sm print:text-xs" />
              </div>
              Shipping Cost Breakdown
            </h3>

            <div className="space-y-4 print:space-y-2">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 print:p-3 print:bg-blue-50 print:border-blue-300">
                <span className="font-semibold text-blue-800 print:text-sm">
                  Base Shipping Fee
                </span>
                <span className="text-blue-900 font-medium bg-white px-3 py-1 rounded-lg shadow-sm print:shadow-none print:px-2 print:text-sm">
                  £{formatPrice(shippingPrice.basePrice)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 print:p-3 print:bg-purple-50 print:border-purple-300">
                <span className="font-semibold text-purple-800 print:text-sm">
                  Insurance Coverage
                </span>
                <span className="text-purple-900 font-medium bg-white px-3 py-1 rounded-lg shadow-sm print:shadow-none print:px-2 print:text-sm">
                  £{formatPrice(shippingPrice.insurance)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 print:p-3 print:bg-orange-50 print:border-orange-300">
                <span className="font-semibold text-orange-800 print:text-sm">
                  Handling Fee
                </span>
                <span className="text-orange-900 font-medium bg-white px-3 py-1 rounded-lg shadow-sm print:shadow-none print:px-2 print:text-sm">
                  £{formatPrice(shippingPrice.handling)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 print:p-3 print:bg-gray-50 print:border-gray-300">
                <span className="font-semibold text-gray-800 print:text-sm">
                  VAT (20%)
                </span>
                <span className="text-gray-900 font-medium bg-white px-3 py-1 rounded-lg shadow-sm print:shadow-none print:px-2 print:text-sm">
                  £{formatPrice(shippingPrice.tax)}
                </span>
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

        {/* Payment Confirmation & Stamp */}
        <div className="bg-green-50 border-2 border-green-200 p-6 mb-8 print:mb-6 print:p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-800 font-bold text-lg print:text-base">PAYMENT CONFIRMED</span>
              </div>
              <p className="text-green-700 text-sm print:text-xs">
                This receipt serves as proof of payment for shipping services.
              </p>
              <p className="text-green-600 text-xs mt-1 print:text-[10px]">
                Transaction processed securely via encrypted payment gateway.
              </p>
            </div>

            <div className="flex space-x-4">
              <div className="relative">
                <div className="w-24 h-24 border-3 border-red-600 rounded-full flex flex-col items-center justify-center bg-red-50 print:w-20 print:h-20 print:border-2 transform rotate-12">
                  <FaStamp className="text-red-600 text-lg mb-1 print:text-sm" />
                  <div className="text-red-600 font-bold text-[10px] text-center print:text-[8px]">
                    <div>ATLAS ORION</div>
                    <div>LOGISTICS</div>
                    <div className="text-[8px] print:text-[6px]">OFFICIAL</div>
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-red-600 font-semibold text-[10px] print:text-[8px]">
                  {new Date().toLocaleDateString("en-GB")}
                </div>
              </div>

              <div className="relative">
                <div className="w-24 h-24 border-3 border-blue-600 rounded-full flex flex-col items-center justify-center bg-blue-50 print:w-20 print:h-20 print:border-2 transform -rotate-6">
                  <FaShieldAlt className="text-blue-600 text-lg mb-1 print:text-sm" />
                  <div className="text-blue-600 font-bold text-[10px] text-center print:text-[8px]">
                    <div>PAID</div>
                    <div className="text-[8px] print:text-[6px]">VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gray-50 border border-gray-200 p-6 mb-6 print:p-4 print:mb-4">
          <h4 className="font-bold text-gray-800 mb-3 print:text-sm print:mb-2">Terms & Conditions</h4>
          <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-600 print:text-[10px] print:gap-2">
            <div>
              <p className="mb-2">• All shipments are subject to our standard terms and conditions.</p>
              <p className="mb-2">• Insurance coverage applies as per policy terms.</p>
              <p className="mb-2">• Delivery times are estimates and may vary due to circumstances beyond our control.</p>
            </div>
            <div>
              <p className="mb-2">• Claims must be reported within 7 days of delivery.</p>
              <p className="mb-2">• This receipt is valid for 12 months from issue date.</p>
              <p className="mb-2">• For full terms, visit www.apexcourrier.com/terms</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white p-6 print:bg-gray-700 print:p-4">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4 print:mb-3">
              <FaTruck className="text-2xl mr-3 print:text-lg print:mr-2" />
              <span className="text-xl font-bold print:text-lg">Thank you for choosing ApexCourrier!</span>
            </div>

            {/* <div className="grid md:grid-cols-3 gap-4 text-sm print:text-xs print:gap-2">
              <div>
                <h5 className="font-semibold mb-2 print:mb-1">Customer Service</h5>
                <p>24/7 Support Available</p>
                {/* <p>+44 20 7946 0958</p> */}
            {/* </div>
              <div>
                <h5 className="font-semibold mb-2 print:mb-1">Online Services</h5>
                <p>Track your shipment online</p>
                <p>www.apexcourrier.com</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2 print:mb-1">Contact</h5>
                <p>support@apexcourrier.com</p>
                <p>support@apexcourrier.com</p>
              </div> */}
            {/* </div>  */}

            {/* <div className="mt-6 pt-4 border-t border-gray-600 text-xs text-gray-300 print:mt-4 print:pt-3 print:text-[10px]">
              <p>Receipt generated on {new Date().toLocaleString("en-GB")} • Document ID: DOC-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
              <p className="mt-1">This is a computer-generated receipt and does not require a signature.</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
