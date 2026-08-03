"use client";
import { useState } from "react";

export default function AddDiscountModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = "",
  itemId,
}) {
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(amount, startDate, endDate, itemId);
  };

  const handleClose = () => {
    setAmount("");
    setStartDate("");
    setEndDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-modal-background rounded-xl w-full max-w-md shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h3 className="text-xl font-black text-white tracking-tight">
            Discount
          </h3>
          <button
            onClick={handleClose}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6 border-b border-white/10">
          {/* Enter Amount */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">
              Enter Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="₱50.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-input-field border border-white/10 rounded-lg px-4 pr-10 py-3.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-primary-container/60 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-container font-black text-base"></span>
            </div>
          </div>

          {/* Date Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-input-field border border-white/10 rounded-lg px-4 pr-10 py-3.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-primary-container/60 transition-colors appearance-none [color-scheme:dark]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary-container text-lg pointer-events-none">
                  calendar_today
                </span>
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-input-field border border-white/10 rounded-lg px-4 pr-10 py-3.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-primary-container/60 transition-colors appearance-none [color-scheme:dark]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary-container text-lg pointer-events-none">
                  calendar_today
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="grid grid-cols-2">
          <button
            onClick={handleClose}
            className="py-4 text-xs font-black uppercase tracking-[0.2em] text-white/70 bg-secondary-container hover:bg-white/5 transition-colors border-r border-white/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="py-4 text-xs font-black uppercase tracking-[0.2em] text-black/90 bg-primary-container hover:brightness-110 transition-all cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
