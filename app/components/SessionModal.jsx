"use client";
import React from "react";
export default function SessionModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="bg-background  w-full max-w-sm rounded-xl overflow-hidden shadow-2xl animate-reveal-up relative z-10">
        <div className="pt-10 pb-6 flex justify-center"></div>

        <div className="px-8 text-center space-y-2">
          <h3 className="font-headline font-black uppercase italic tracking-[0.2em] text-font-color text-2xl">
            Confirm Logout
          </h3>
          <p className="font-body text-white/90 text-md leading-relaxed">
            Are you sure you want to logout?
          </p>
        </div>

        <div className="p-8 flex gap-3">
          <button
            onClick={onClose}
            className="w-full py-4 bg-secondary-container text-white/90 rounded-lg font-headline font-black uppercase text-sm tracking-[0.2em] hover:bg-primary-container hover:text-black/90 hover:scale-105 transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-primary-container text-black/90 font-headline font-black uppercase text-sm tracking-[0.2em]  hover:scale-105 transition-all duration-300 rounded-lg"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
