"use client";
import React from "react";
import { useState } from "react";

const ForgotPasswordModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
}) => {
  const [codeDB, setCodeDB] = useState(null);
  const [code, setCode] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-background rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-reveal-up">
        <header className="p-6 border-b border-white/[0.03] flex items-start justify-between">
          <div>
            <h4 className="text-2xl text-font-color font-headline font-black uppercase tracking-tighter">
              Enter Code
            </h4>
            <p className="text-xs text-font-color/80 mt-1">
              Check your email for the 5‑digit code
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center border border-white/5 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-font-color">
              close
            </span>
          </button>
        </header>

        <div className="p-6 space-y-6">
          <label className="block text-sm text-font-color font-headline font-bold uppercase tracking-[0.3em] border-l-2 border-secondary-container pl-2">
            Code
          </label>

          <div className="flex gap-3 justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-14 h-14 text-center text-xl bg-input-field border border-white/[0.03] rounded-lg font-headline font-bold text-white placeholder:text-white/30 outline-none focus:border-primary-container transition-all"
                aria-label={`code-${i + 1}`}
              />
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onSubmit}
              className="w-full h-12 bg-primary-container rounded-lg text-black font-headline font-bold uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-95 transition-all"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
