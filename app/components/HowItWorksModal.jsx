"use client";
import React from "react";

/* 
   HowItWorksModal Component
   A responsive modal that explains the 7-step reservation process 
   using the Ethan & Marcus Diecast design system.
*/
export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    { id: 1, text: "Select the product you want." },
    { id: 2, text: "Click the 'RESERVE PRODUCT' button." },
    {
      id: 3,
      text: "The System verifies if you are logged in or not.",
    },
    {
      id: 4,
      text: "If not logged in. The system will redirects you to login page",
    },
    {
      id: 5,
      text: "If no account. Click the 'SIGN UP' link to register an account",
    },
    {
      id: 6,
      text: "Once logged in. The system will  auto-redirect you back to your selected product.",
    },
    {
      id: 7,
      text: "Click again the 'RESERVE PRODUCT' button to order reservation.",
    },

    {
      id: 8,
      text: "The system will send you an email about the confirmation status of your reservation",
    },
    { id: 9, text: "Direct communication with the system admin via email." },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden reveal-up">
        {/* Checkered Racing Header */}
        <div className="h-4 checkered-pattern w-full"></div>

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-headline font-black uppercase  leading-none text-primary-container">
                HOW IT WORKS
              </h2>
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/90 font-bold mt-2">
                7-Steps to Order Product Reservation
              </p>
            </div>
            <button
              onClick={onClose}
              className="size-10 p-5 flex items-center justify-center bg-white/5 hover:bg-on-primary text-white transition-all rounded-full"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Steps List */}
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-6 group">
                {/* Step Number Badge */}
                <div className="flex-shrink-0 size-8 bg-surface-container-highest border border-white/10 flex items-center justify-center font-headline font-black  text-primary-container group-hover:bg-primary-container group-hover:text-black transition-colors">
                  0{step.id}
                </div>
                {/* Step Description */}
                <p className="text-sm sm:text-base  leading-relaxed py-1">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Checkered Racing Footer */}
        <div className="h-2 checkered-pattern w-full opacity-50"></div>
      </div>
    </div>
  );
}
