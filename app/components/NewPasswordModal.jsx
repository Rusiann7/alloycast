"use client";
import React from "react";
import { useState } from "react";

const NewPasswordModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isSame = () => {
    if (password === confirmPassword) {
      onSubmit(password);
    } else {
      console.log("Password did not match");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-background rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-reveal-up">
        <header className="p-6 border-b border-white/[0.03] flex items-start justify-between">
          <div>
            <h4 className="text-2xl text-font-color font-headline font-black uppercase tracking-tighter">
              Reset Password
            </h4>
            <p className="text-xs text-font-color/80 mt-1">
              Create a new secure password
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

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-font-color font-headline font-bold uppercase tracking-[0.3em] border-l-2 border-secondary-container pl-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input-field border border-white/[0.03] rounded-lg h-12 px-4 text-md font-headline font-bold  tracking-widest outline-none focus:border-primary-container transition-all text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-font-color font-headline font-bold uppercase tracking-[0.3em] border-l-2 border-secondary-container pl-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-input-field border border-white/[0.03] rounded-lg h-12 px-4 text-md font-headline font-bold  tracking-widest outline-none focus:border-primary-container transition-all text-white placeholder:text-white/50"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={isSame}
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

export default NewPasswordModal;
