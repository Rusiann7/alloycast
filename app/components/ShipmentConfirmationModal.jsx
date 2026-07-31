"use client";

export default function ShipmentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  customerName = "",
  orderType = "",
  customerAddress = "",
  paymentStatus = "",
}) {
  if (!isOpen) return null;

  const isPaid = paymentStatus === "Paid";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="bg-modal-background rounded-lg p-6 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-lg text-font-color uppercase tracking-tighter italic">
            Item Tracking Details
          </h3>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Customer Name + Order Type row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-secondary-container border border-white/5 rounded-lg p-3">
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
              Customer Name
            </p>
            <p className="text-white/90 text-sm font-bold">
              {customerName || "—"}
            </p>
          </div>
          <div className="bg-secondary-container border border-white/5 rounded-lg p-3">
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
              Order Type
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block shrink-0" />
              <p className="text-white/90 text-sm font-bold">
                {orderType || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Address */}
        <div className="bg-secondary-container border border-white/5 rounded-lg p-3 mb-3">
          <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
            Customer Address
          </p>
          <p className="text-white/90 text-sm font-bold">
            {customerAddress || "—"}
          </p>
        </div>

        {/* Payment Status */}
        <div className="bg-secondary-container border border-white/5 rounded-lg p-3 mb-5 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1.5">
              Payment Status
            </p>
            <span
              className={`inline-block text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isPaid
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {paymentStatus || "Pending"}
            </span>
          </div>
          {isPaid && (
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-400 text-base">
                check_circle
              </span>
            </div>
          )}
        </div>

        {/* Shipping Fee */}
        <div className="mb-3">
          <label className="block text-font-color text-[10px] font-black uppercase tracking-widest mb-1.5">
            Shipping Fee
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/90 text-sm font-bold">
              ₱
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-secondary-container border border-white/10 rounded-lg pl-7 pr-10 py-3 text-white/90 text-sm placeholder:text-white/30 outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30 text-base">
              payments
            </span>
          </div>
        </div>

        {/* Tracking Number */}
        <div className="mb-6">
          <label className="block text-font-color text-[10px] font-black uppercase tracking-widest mb-1.5">
            Tracking Number
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter"
              className="w-full bg-secondary-container border border-white/10 rounded-lg px-3 pr-10 py-3 text-white/90 text-sm placeholder:text-white/30 outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30 text-base">
              barcode_scanner
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-[0.15em] transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-lg bg-secondary-container border border-white/10 hover:border-white/30 text-white/80 text-xs font-black uppercase tracking-[0.15em] transition-all cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
