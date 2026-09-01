"use client";

import { useEffect, useState } from "react";
import { Globe, X, ChevronUp } from "lucide-react";
import Script from "next/script";

const FloatingTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Define the initialization function
    const initializeGoogleTranslate = () => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        // Check if element exists and is empty
        const element = document.getElementById("google_translate_element");
        if (element && !element.hasChildNodes()) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "ar,zh-CN,fr,de,hi,id,it,ja,ko,pt,ru,es,th,tr,vi",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      }
    };

    // Assign to window for the callback
    window.googleTranslateElementInit = initializeGoogleTranslate;

    // Try to initialize if script is already loaded
    if (window.google && window.google.translate) {
      initializeGoogleTranslate();
    }
  }, [isOpen]); // Re-check when opening just in case

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start font-sans">
      {/* Custom Styles for the Google Widget */}
      <style>{`
        .goog-te-banner-frame { display: none !important; }
        .goog-te-gadget-icon { display: none !important; }
        body { top: 0px !important; }
        .goog-te-gadget-simple {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
            font-family: inherit !important;
            font-size: 14px !important;
            width: 100% !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value {
            color: #374151 !important;
            margin-right: 0 !important;
            width: 100% !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span {
             border-left: none !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span:first-child {
             font-weight: 500 !important;
        }
        /* Hide google specific artifacts */
        .goog-logo-link { display: none !important; }
        .goog-te-gadget { color: transparent !important; margin-bottom: 0 !important; }
        #google_translate_element select {
            color: black;
        }
      `}</style>

      {/* Popup Container */}
      <div 
        className={`
            mb-3 transition-all duration-300 origin-bottom-left
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
        `}
      >
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 min-w-[200px] max-w-[280px]">
             <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Language</span>
                <Globe size={14} className="text-secondary opacity-50" />
             </div>
             <div id="google_translate_element" className="min-h-[40px] flex items-center"></div>
        </div>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
            group flex items-center gap-2 px-5 py-3 rounded-full shadow-xl
            transition-all duration-300 transform hover:-translate-y-1 active:scale-95
            ${isOpen ? 'bg-ink text-white' : 'bg-brand text-white hover:bg-brand-dark'}
        `}
      >
        {isOpen ? <X size={20} /> : <Globe size={20} />}
        <span className="font-bold text-sm">Translate</span>
        <ChevronUp 
            size={16} 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
};

export default FloatingTranslate;
