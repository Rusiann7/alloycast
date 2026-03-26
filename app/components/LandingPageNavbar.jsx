"use client";
import { useState } from "react";
import Link from "next/link";

export default function LandingPageNavbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const navLinks = [
    {
      id: 0,
      label: "Browse",
      href: "/customer/product",
    },
    { id: 1, label: "New Arrivals", href: "/customer/new-arrivals" },
    { id: 2, label: "Pre-Orders", href: "/customer/pre-orders" },
  ];
  return (
    <>
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto flex items-center justify-between px-6 lg:px-12 py-4">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 text-white">
              <div className="size-6 text-primary-container">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="font-headline text-lg font-bold uppercase tracking-tight hover:cursor-pointer">
                <Link href="/">Ethan Marcus Diecast</Link>
              </h2>
            </div>
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((navLink) => (
                <Link
                  key={navLink.id}
                  className="text-xs uppercase tracking-widest font-bold hover:text-primary-container transition-colors"
                  href={navLink.href}
                >
                  {navLink.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex lg:hidden items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors"
              onClick={() => setNavbarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <button className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="hidden lg:block bg-primary-container text-white text-xs font-black uppercase tracking-widest px-6 h-10 rounded btn-premium">
              <Link href="/customer/auth/login">Log In</Link>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-[110] transition-opacity duration-300 ${navbarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setNavbarOpen(false)}
        ></div>
        <div
          className={`absolute top-0 right-0 h-full w-[300px] bg-surface-container-low border-l border-white/5 p-8 transition-transform duration-500 transform ${navbarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-container">
              Vault Access
            </span>
            <button
              onClick={() => setNavbarOpen(false)}
              className="material-symbols-outlined text-white hover:rotate-90 transition-transform"
            >
              close
            </button>
          </div>
          <nav className="flex flex-col gap-8">
            {navLinks.map((navLink) => (
              <Link
                key={navLink.id}
                href={navLink.href}
                className="text-2xl font-headline font-black uppercase italic hover:text-primary-container transition-colors tracking-tighter"
                onClick={() => setNavbarOpen(false)}
              >
                {navLink.label}
              </Link>
            ))}
            <button className="bg-primary-container text-white text-xs font-black uppercase tracking-widest px-6 h-10 rounded btn-premium">
              <Link href="/customer/auth/login">Log In</Link>
            </button>
            <div className="h-px w-full bg-white/10 my-4"></div>
            <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">search</span>{" "}
              Search The Vault
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
