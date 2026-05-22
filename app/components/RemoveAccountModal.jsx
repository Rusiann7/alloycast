"use client";

import React from "react";

export default function RemoveAccountModal({
  open,
  onClose,
  onConfirm,
  customerName,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md mx-4 bg-secondary-container rounded-lg shadow-xl border border-white/5 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-headline font-black uppercase tracking-[0.15em] text-primary-container mb-2">
            Remove Customer
          </h3>
          <p className="text-sm text-white/80 mb-6">
            Are you sure you want to remove this customer?
          </p>

          {customerName && (
            <div className="mb-4 p-3 bg-input-field rounded-md text-sm text-white/90">
              <strong className="uppercase font-bold">Selected:</strong>
              <div className="mt-1">{customerName}</div>
            </div>
          )}

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-4 bg-input-field text-white/90 text-sm font-headline font-black uppercase italic tracking-[0.05em]  rounded-lg hover:brightness-110 transition"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-4 bg-primary-container text-black/90 font-headline font-black uppercase italic tracking-[0.05em] text-sm rounded-lg hover:brightness-110 transition"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
