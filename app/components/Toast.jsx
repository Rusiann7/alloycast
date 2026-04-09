"use client";

/**
 * Reusable Toast Notification Component
 *
 * Props:
 * - message (string): The text to display inside the toast.
 * - type (string): "success" | "error" — controls the color and icon.
 * - visible (boolean): Controls whether the toast is shown or hidden.
 */
export default function Toast({ message, type = "error", visible }) {
  if (!visible) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-[100] animate-reveal-up max-w-[90vw] sm:max-w-sm">
      <div
        className={`${
          isSuccess
            ? "bg-secondary-container text-black"
            : "bg-primary-container text-white"
        } px-5 py-4 rounded-lg shadow-2xl flex items-center gap-3 border border-white/10`}
      >
        {/* Icon */}
        <span className="material-symbols-outlined text-xl shrink-0">
          {isSuccess ? "check_circle" : "error"}
        </span>

        {/* Message */}
        <span className="font-headline font-bold uppercase tracking-wider text-xs leading-snug">
          {message}
        </span>
      </div>
    </div>
  );
}
