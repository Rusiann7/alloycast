"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import of Leaflet map component to prevent SSR errors in Next.js
const DynamicDeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 sm:h-72 rounded-xl bg-input-field/50 border border-white/10 animate-pulse flex flex-col items-center justify-center text-white/60">
      <span className="material-symbols-outlined text-4xl mb-2 animate-bounce">location_on</span>
      <p className="text-sm font-headline tracking-wider uppercase">Loading Interactive Map...</p>
    </div>
  ),
});

export default function DeliveryAddressMapModal({
  isOpen,
  onClose,
  onConfirmAddress,
  defaultCustomerName = "",
  isSubmitting = false,
}) {
  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [contactNumber, setContactNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [location, setLocation] = useState({ lat: 14.8386, lng: 120.2842 }); // Default: Olongapo City
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // Handle location update from map click or drag
  const handleLocationSelect = async (newPos) => {
    setLocation(newPos);
    
    // Optional reverse geocoding via OpenStreetMap Nominatim
    try {
      setIsGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.suburb || addr.neighbourhood || "";
          const cityDist = addr.city_district || addr.suburb || addr.city || addr.town || "";
          const postcode = addr.postcode || "";

          if (road && !streetAddress) setStreetAddress(road);
          if (cityDist && !district) setDistrict(cityDist);
          if (postcode && !zipCode) setZipCode(postcode);
        }
      }
    } catch (err) {
      console.log("Geocoding notice:", err);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("Please enter your full customer name.");
      return;
    }
    if (!contactNumber.trim()) {
      setErrorMessage("Please enter your contact number for delivery updates.");
      return;
    }
    if (!streetAddress.trim()) {
      setErrorMessage("Please enter your street address.");
      return;
    }
    if (!district.trim()) {
      setErrorMessage("Please enter your district or barangay.");
      return;
    }
    if (!zipCode.trim()) {
      setErrorMessage("Please enter your postal/zip code.");
      return;
    }

    onConfirmAddress({
      customerName,
      contactNumber,
      streetAddress,
      district,
      zipCode,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-modal-background rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-primary-container/20 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-container/20">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-3xl">
              local_shipping
            </span>
            <div>
              <h3 className="font-headline font-black text-xl sm:text-2xl text-font-color uppercase tracking-tight italic">
                Delivery Location & Address
              </h3>
              <p className="text-xs text-font-color/70 uppercase tracking-widest font-bold">
                Drop a pin on the map for precise LBC shipping
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-10 h-10 rounded-full bg-input-field text-white hover:bg-error-container transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-headline font-bold uppercase text-font-color tracking-wider mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-input-field border border-white/10 rounded-lg p-3 text-white text-sm focus:border-primary-container outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-headline font-bold uppercase text-font-color tracking-wider mb-1">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="09123456789"
                className="w-full bg-input-field border border-white/10 rounded-lg p-3 text-white text-sm focus:border-primary-container outline-none transition-all"
              />
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-headline font-bold uppercase text-font-color tracking-wider mb-1">
              House / Building / Street Address *
            </label>
            <input
              type="text"
              required
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="e.g. #12 Rizal Avenue, West Bajac-Bajac"
              className="w-full bg-input-field border border-white/10 rounded-lg p-3 text-white text-sm focus:border-primary-container outline-none transition-all"
            />
          </div>

          {/* District & Zip Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-headline font-bold uppercase text-font-color tracking-wider mb-1">
                District / Barangay / City *
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Olongapo City"
                className="w-full bg-input-field border border-white/10 rounded-lg p-3 text-white text-sm focus:border-primary-container outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-headline font-bold uppercase text-font-color tracking-wider mb-1">
                Zip / Postal Code *
              </label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="2200"
                className="w-full bg-input-field border border-white/10 rounded-lg p-3 text-white text-sm focus:border-primary-container outline-none transition-all"
              />
            </div>
          </div>

          {/* Leaflet Interactive Map Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-headline font-bold uppercase text-font-color tracking-wider">
                Pin Location on Map
              </label>
              <span className="text-[11px] text-font-color/70 font-mono">
                Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}
                {isGeocoding && " (Updating address...)"}
              </span>
            </div>

            <DynamicDeliveryMap
              initialLat={location.lat}
              initialLng={location.lng}
              onLocationSelect={handleLocationSelect}
            />
            <p className="text-[11px] text-font-color/70 mt-1 italic">
              💡 Tip: Click or drag the marker to your exact building or landmark location.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-primary-container/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 bg-secondary-container text-white/90 text-xs font-headline font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 bg-primary-container text-black font-headline font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Confirm Address & Pay</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
