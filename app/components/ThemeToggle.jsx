"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// isCollapsed / isMobileOpen are optional — used when placed inside AdminSidebar
export default function ThemeToggle({ isCollapsed, isMobileOpen }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";
  const showLabel = !isCollapsed || isMobileOpen;
  const label = isDark ? "Light Mode" : "Dark Mode";
  const icon = isDark ? "light_mode" : "dark_mode";

  // Sidebar-style button (when used inside AdminSidebar)
  if (isCollapsed !== undefined) {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={isCollapsed && !isMobileOpen ? label : undefined}
        className={`w-full flex items-center rounded-lg px-4 py-2 border border-secondary-container text-black/90 hover:bg-secondary-container hover:text-white/90 hover:scale-105 transition-all
          ${showLabel ? "space-x-3" : "justify-center"}`}
      >
        <span className="material-symbols-outlined">{icon}</span>
        {showLabel && (
          <span className="font-headline uppercase text-sm font-bold tracking-widest">
            {label}
          </span>
        )}
      </button>
    );
  }

  // Compact icon-only button (when used inside Navbar or anywhere else)
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-input-field border border-white/5 text-white/90 hover:scale-105 transition-all"
      title={label}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </button>
  );
}
