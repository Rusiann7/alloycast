"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect ensures the component only renders on the client
  // to prevent hydration mismatch errors
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary-container text-black shadow-lg/30 transition-transform active:scale-95 z-50 font-black italic uppercase tracking-widest text-[10px] flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      <span className="material-symbols-outlined text-[20px] transition-transform duration-500 group-hover:rotate-12 leading-none">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
