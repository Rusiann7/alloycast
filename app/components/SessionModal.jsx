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

      <div className="bg-[#131313] border border-white/10 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl animate-reveal-up relative z-10">
        <div className="pt-10 pb-6 flex justify-center">
          <div className="w-20 h-20 bg-[#C8102E]/10 rounded-full flex items-center justify-center border border-[#C8102E]/20">
            <span className="material-symbols-outlined text-[#C8102E] text-4xl">
              logout
            </span>
          </div>
        </div>

        <div className="px-8 text-center space-y-2">
          <h3 className="font-headline font-black uppercase italic tracking-[0.2em] text-white text-xl">
            Confirm Logout
          </h3>
          <p className="font-body text-[#A8A8A0] text-sm leading-relaxed">
            Are you sure you want to logout?
          </p>
        </div>

        <div className="p-8 flex gap-3">
          <button
            onClick={onClose}
            className="w-full py-4 border border-white/10 rounded-xl text-[#A8A8A0] font-headline font-black uppercase text-[11px] tracking-[0.2em] hover:text-white transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-[#C8102E] text-white font-headline font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white hover:text-[#C8102E] transition-all duration-300 rounded-[4px]"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
