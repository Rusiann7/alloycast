"use client";
import React from "react";

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    { id: 1, text: "Choose the product you want to buy." },
    { id: 2, text: "Click the 'ORDER PRODUCT' button." },
    {
      id: 3,
      text: "The System verifies first if you are logged in or not.",
    },
    {
      id: 4,
      text: "If you're not logged in. The system will automatically redirect you to login page",
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
      text: "Click again the 'ORDER PRODUCT' button to order reservation.",
    },
    {
      id: 8,
      text: "Click again the 'ORDER PRODUCT' button to order reservation.",
    },
    {
      id: 9,
      text: "Choose Order Type and Mode of Payment",
    },
    {
      id: 10,
      text: "The system will guide you regarding the type of order and payment that you chosen",
    },
    {
      id: 11,
      text: "The system will send an email both to you and Admin about the order you've made",
    },
    {
      id: 12,
      text: "Once an order has been made. You only have 48hrs to pickup or pay your order",
    },
    {
      id: 13,
      text: "Failure to pickup or pay your order within the time frame will lead to cancellation of your reservation ",
    },
    { id: 14, text: "Direct communication with the system admin via email." },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center mt-16 p-4 sm:p-4  bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-modal-background border border-white/10 rounded-2xl shadow-2xl overflow-hidden reveal-up">
        {/* Checkered Racing Header */}
        <div className="h-4 checkered-pattern w-full"></div>

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-headline font-black uppercase  leading-none text-secondary-container dark:text-primary-container drop-shadow-md/50">
                HOW IT WORKS
              </h2>
              <p className="text-[12px] uppercase tracking-[0.4em] text-font-color font-bold mt-2">
                -Steps to Order Product Reservation
              </p>
            </div>
            <button
              onClick={onClose}
              className="size-10 p-5 flex items-center justify-center bg-on-primary text-white transition-all rounded-full"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Steps List */}
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-6 group">
                {/* Step Number Badge */}
                <div className="flex-shrink-0 size-8 bg-primary-container rounded-lg flex items-center justify-center font-headline font-black  text-font-color dark:text-black/90 group-hover:bg-secondary-container  transition-colors">
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
