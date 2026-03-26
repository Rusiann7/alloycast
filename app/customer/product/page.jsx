"use client";

import React, { useState } from "react";

export default function Product() {
  const [inStockOnly, setInStockOnly] = useState(false);

  // High-fidelity sample data
  const products = [
    {
      id: 1,
      brand: "HW",
      series: "Car Culture",
      name: "Porsche 911 GT3 RS",
      price: "₱1,950",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAai2EZmMLbYdoF3a6owAECBUYPcnFtHpYEv0jyohLw7OblEM0_xrLicRcv76-yOGzMbR49FoX1YxExdquQuCITzT8B8ZYYjgcyGmcVpIh-GTEM0-8jdTz-jpP1R5edJ_t4KaqmUKY1IDf7MqW23XnAj3Z6piw2jxvbJr6YDMKvjYDPc_XapL7_E88c5C3c2Ki64kzm87RFAnCMX_BhT4C9122HEVKYO9-lTyGQHeTzvEjyDsZ2Nk9AMdwh6JQzJyTHeFLmEUFRLJ0",
      badge: "STH",
    },
    {
      id: 2,
      brand: "HW",
      series: "Boulevard",
      name: "Nissan Skyline GT-R (R34)",
      price: "₱1,650",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFHvsertEwhWXSs7NqI3_gKCusGxTQwMFNLnlSxnzra-26hZpxnroHO05xiab5kVNkVuIxmOuR3hIfEs_9IuiwIqn72bAYHdiqXVAWRUPs0klM3O5uqTwtknDmY9D6eO0Zh5_WDOlCuRFpxJ2FjxHkX-hfmfqejRsQjrfiMBhPebsDCpQhGKNmE2Iqvos3n-2_k4NmofrcWg1-Ank6t85Hv3q0CjtauKoLYGKGYvUIf0vWFaU1G86xEiXJFLMVmwszt5jkctcT6Bo",
    },
    {
      id: 3,
      brand: "MB",
      series: "Mainline",
      name: "'67 Camaro",
      price: "₱450",
      status: "Low Stock",
      statusColor: "bg-orange-400",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCT-8Z44xfm3VfO6F7fz4yoWRJlJLPGUn3D8ZX8YGCJZVExnAFCGrqSgrs8R2R7WEP3wMzwsXT2wUJ8dR_u6rpdfLm3B-IkdiJjS5kiF8jcu0V7s2qMGzjwVXLkkIdxp6y3KNaFVoohuWsY2_Wq_WgahHDpANWWKdnzkI0OI6W6iQgvl9bBLsXN_LzA87T0koKZLplL70TlCmnd0aKXwSeC2kiWwKKBsmNh9prEgsOdxQwBwiB6t1i7EMZd9Z9aPQIDJmFwCLeIxp0",
    },
    {
      id: 4,
      brand: "HW",
      series: "Car Culture",
      name: "'69 Dodge Charger R/T",
      price: "₱850",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
    },
    {
      id: 5,
      brand: "GL",
      series: "Boulevard",
      name: "Ferrari F40",
      price: "₱2,450",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
      badge: "TH",
    },
    {
      id: 6,
      brand: "MB",
      series: "Mainline",
      name: "Toyota Land Cruiser FJ60",
      price: "₱450",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
    },
    {
      id: 7,
      brand: "HW",
      series: "Car Culture",
      name: "Lamborghini Countach LP5000",
      price: "₱1,250",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
      badge: "STH",
    },
    {
      id: 8,
      brand: "GL",
      series: "Boulevard",
      name: "Shelby Cobra 427 S/C",
      price: "₱1,100",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
    },
    {
      id: 9,
      brand: "HW",
      series: "Mainline",
      name: "Porsche 911 Turbo",
      price: "₱350",
      status: "Sold Out",
      statusColor: "bg-error",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAai2EZmMLbYdoF3a6owAECBUYPcnFtHpYEv0jyohLw7OblEM0_xrLicRcv76-yOGzMbR49FoX1YxExdquQuCITzT8B8ZYYjgcyGmcVpIh-GTEM0-8jdTz-jpP1R5edJ_t4KaqmUKY1IDf7MqW23XnAj3Z6piw2jxvbJr6YDMKvjYDPc_XapL7_E88c5C3c2Ki64kzm87RFAnCMX_BhT4C9122HEVKYO9-lTyGQHeTzvEjyDsZ2Nk9AMdwh6JQzJyTHeFLmEUFRLJ0",
    },
    {
      id: 10,
      brand: "MB",
      series: "Car Culture",
      name: "Nissan Skyline 2000GT-R",
      price: "₱950",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFHvsertEwhWXSs7NqI3_gKCusGxTQwMFNLnlSxnzra-26hZpxnroHO05xiab5kVNkVuIxmOuR3hIfEs_9IuiwIqn72bAYHdiqXVAWRUPs0klM3O5uqTwtknDmY9D6eO0Zh5_WDOlCuRFpxJ2FjxHkX-hfmfqejRsQjrfiMBhPebsDCpQhGKNmE2Iqvos3n-2_k4NmofrcWg1-Ank6t85Hv3q0CjtauKoLYGKGYvUIf0vWFaU1G86xEiXJFLMVmwszt5jkctcT6Bo",
    },
    {
      id: 11,
      brand: "HW",
      series: "Boulevard",
      name: "'70 Dodge Charger",
      price: "₱750",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
    },
    {
      id: 12,
      brand: "GL",
      series: "Car Culture",
      name: "Toyota Land Cruiser 70 Series",
      price: "₱1,850",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
      badge: "TH",
    },
    {
      id: 13,
      brand: "MB",
      series: "Mainline",
      name: "Lamborghini Countach 25th Anniv",
      price: "₱350",
      status: "Low Stock",
      statusColor: "bg-orange-400",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
    },
    {
      id: 14,
      brand: "HW",
      series: "Boulevard",
      name: "Shelby GT500KR",
      price: "₱1,250",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
    },
    {
      id: 15,
      brand: "HW",
      series: "Car Culture",
      name: "Ferrari 512 M",
      price: "₱1,150",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-R7a_77t4jB3G_V3fW0Z1L_z9H2vI_M6Wv3vX9YJ3pS2T1A6n8O7R9e4m1a5s8d7f",
    },
    {
      id: 16,
      brand: "MB",
      series: "Mainline",
      name: "1965 Ford Mustang Fastback",
      price: "₱450",
      status: "In Stock",
      statusColor: "bg-emerald-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCT-8Z44xfm3VfO6F7fz4yoWRJlJLPGUn3D8ZX8YGCJZVExnAFCGrqSgrs8R2R7WEP3wMzwsXT2wUJ8dR_u6rpdfLm3B-IkdiJjS5kiF8jcu0V7s2qMGzjwVXLkkIdxp6y3KNaFVoohuWsY2_Wq_WgahHDpANWWKdnzkI0OI6W6iQgvl9bBLsXN_LzA87T0koKZLplL70TlCmnd0aKXwSeC2kiWwKKBsmNh9prEgsOdxQwBwiB6t1i7EMZd9Z9aPQIDJmFwCLeIxp0",
    },
  ];

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      <header className="relative py-28 px-12 lg:px-20 border-b border-white/5 overflow-hidden reveal-up">
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full pointer-events-none opacity-20 lg:opacity-40 grayscale animate-drive-in">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-iBE2bThpejE-k0yVjvD9_9bvpDi5E3-AIaZyaBgX3WPkoe0yeJqYYJiLR6JCLDq3vnmf9gRVTcYGP6rugVRMCVEGdqa5PtYQMotdtaVumU-aptncRp3o4KMv80mCpzkhu6pRz2Y7EXRwz2tb_tzNhTP79N5vKOqra706nIC6yxKh4_9faXMzKGTW5bC44JQUOglYXXBYJrh1xRWnR3ic2a5ACn4QsnLJi5euAjQ63XxuarlEUO048Nv5uAMWPT1YxMjhUDQEtJM"
            alt="Hero BG"
          />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto">
          <h1 className="font-headline font-black text-6xl lg:text-[140px] tracking-tighter uppercase leading-[0.8] mb-8 italic">
            <span className="text-primary-container">PRODUCTS</span>
          </h1>
          <p className="max-w-xl text-lg text-on-surface-variant font-medium leading-relaxed mb-12 italic opacity-60">
            SECURE ACCESS: The next generation of diecast engineering. Lock in
            your allocation for limited-run specimens before they enter the
            permanent archive.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="bg-secondary-container text-on-secondary-container px-6 py-2 font-headline font-black text-sm tracking-widest uppercase italic shadow-2xl">
              Q3-Q4 2024 DROP SCHEDULE
            </span>
            <span className="text-primary-container text-[10px] font-black tracking-[0.4em] uppercase">
              Limited Slot Allocations Remaining
            </span>
          </div>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto p-6 lg:p-12 gap-10 pt-28 lg:pt-32">
        {/* Sidebar Filters */}
        <aside className="hidden md:flex flex-col w-[280px] shrink-0 bg-[#1A1A1A] p-8 rounded border border-white/5 carbon-noise h-fit sticky top-[100px] reveal-up">
          <h2 className="font-headline text-2xl font-black uppercase mb-8 border-b border-white/5 pb-4 tracking-tighter italic">
            Filters
          </h2>

          <div className="space-y-12">
            <FilterSection title="Manufacturer">
              <FilterCheckbox label="Hot Wheels (HW)" defaultChecked />
              <FilterCheckbox label="Matchbox (MB)" />
              <FilterCheckbox label="GreenLight (GL)" />
              <FilterCheckbox label="Auto World (AW)" />
            </FilterSection>

            <FilterSection title="Collection Series">
              <FilterCheckbox label="Car Culture" defaultChecked />
              <FilterCheckbox label="Boulevard" />
              <FilterCheckbox label="Mainline" />
            </FilterSection>

            <div className="pt-8 border-t border-white/5">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="font-headline text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">
                  In Stock Only
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                  <div className="w-11 h-6 bg-[#252525] rounded-full peer peer-checked:bg-primary-container transition-all after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-white border border-white/5"></div>
                </div>
              </label>
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Dashboard Toolbar */}
          <div
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 bg-[#1A1A1A]/40 backdrop-blur-xl p-8 rounded border border-white/5 reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex-1 w-full max-w-xl relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary-container transition-colors">
                search
              </span>
              <input
                className="w-full bg-[#242424] border-b-2 border-transparent focus:border-primary-container focus:outline-none py-4 pl-14 pr-6 rounded-t text-sm font-headline tracking-widest placeholder:text-white/10 transition-all font-bold uppercase"
                placeholder="SEARCH SYSTEM ARCHIVE..."
              />
            </div>
            <div className="w-full lg:w-64">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-3 ml-1">
                Sort Velocity
              </p>
              <div className="relative">
                <select className="w-full bg-[#242424] border-b-2 border-transparent focus:border-primary-container focus:outline-none py-4 px-5 rounded-t text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer appearance-none transition-all text-white/60 focus:text-white">
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rarity: Chase First</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Product Grid - Staggered Reveal */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 reveal-up"
            style={{ animationDelay: "0.4s" }}
          >
            {products.map((product, i) => (
              <ProductCard key={product.id} {...product} index={i} />
            ))}
          </div>

          {/* Pagination/Load More */}
          <div
            className="mt-20 flex justify-center reveal-up"
            style={{ animationDelay: "0.6s" }}
          >
            <button className="bg-primary-container hover:bg-[#242424] hover:text-primary-container text-white px-12 py-5 border-2 border-white/5 hover:border-primary-container text-[10px] font-black uppercase tracking-[0.4em] transition-all group italic shadow-2xl">
              Show More
            </button>
          </div>
        </div>
      </main>

      {/* Industrial Footer */}
      <footer className="mt-32 border-t border-white/5 bg-[#0A0A0A] p-12 lg:p-20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-1 space-y-8">
            <div className="flex items-center gap-4 text-white">
              <div className="size-8 text-primary-container">
                <svg fill="currentColor" viewBox="0 0 48 48">
                  <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" />
                </svg>
              </div>
              <span className="font-headline font-black text-xl uppercase tracking-tighter italic">
                Ethan Marcus
              </span>
            </div>
            <p className="text-xs font-light text-white/20 leading-relaxed uppercase tracking-widest italic">
              Authorized Partner of Premium Brands. <br />
              Industrial Precision. Diecast Curation.
            </p>
          </div>
          <FooterColumn
            title="Access"
            links={["Catalog", "Vault Items", "Pre-orders", "Member Login"]}
          />
          <FooterColumn
            title="Protocol"
            links={["About Us", "Shipping", "Security", "Terms"]}
          />
          <FooterColumn
            title="Connect"
            links={["Instagram", "Facebook", "Contact Support"]}
          />
        </div>
        <div className="max-w-[1600px] mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-white/10 gap-6 text-center">
          <p>© 2026 ETHAN MARCUS DIECAST. ALL SYSTEM RIGHTS RESERVED.</p>
          <p className="text-primary-container">SYS_VER: 2.4.9-STABLE</p>
        </div>
      </footer>

      <style jsx global>{`
        .reveal-up {
          animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes reveal-up {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .carbon-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}

const NavLink = ({ label, active }) => (
  <a
    className={`text-[10px] uppercase tracking-[0.3em] font-black transition-all ${active ? "text-primary-container" : "text-white/40 hover:text-white"}`}
    href="#"
  >
    {label}
  </a>
);

const HeaderAction = ({ icon }) => (
  <button className="size-11 flex items-center justify-center bg-[#1A1A1A] rounded border border-white/5 hover:bg-[#252525] hover:border-primary-container/30 text-white transition-all group shadow-2xl active:scale-90">
    <span className="material-symbols-outlined text-[22px] group-hover:text-primary-container group-hover:scale-110 transition-all font-light">
      {icon}
    </span>
  </button>
);

const FilterSection = ({ title, children }) => (
  <div className="space-y-6">
    <h3 className="font-headline text-[10px] font-black uppercase tracking-[0.4em] text-primary-container">
      {title}
    </h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const FilterCheckbox = ({ label, defaultChecked }) => (
  <label className="flex items-center gap-4 cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="appearance-none size-5 border-2 border-white/10 rounded-[1px] checked:bg-primary-container checked:border-primary-container transition-all"
      />
      <span className="material-symbols-outlined absolute inset-0 text-[14px] text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
        check
      </span>
    </div>
    <span className="font-headline text-[11px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
      {label}
    </span>
  </label>
);

const ProductCard = ({
  brand,
  series,
  name,
  price,
  status,
  statusColor,
  img,
  badge,
  index,
}) => (
  <article
    className="group relative flex flex-col bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:border-primary-container/40 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <div className="relative aspect-square bg-[#0D0D0D] flex items-center justify-center p-10 overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 transition-opacity opacity-40 group-hover:opacity-10"></div>
      <img
        alt={name}
        className="w-full h-full object-contain relative z-0 mix-blend-lighten transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-6"
        src={img}
      />
      {/* Dynamic Badges */}
      <div className="absolute top-5 left-5 z-20">
        <span className="bg-[#E8112D] text-white font-headline text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-[1px] shadow-2xl italic">
          {brand}
        </span>
      </div>
      {badge && (
        <div className="absolute top-5 right-5 z-20">
          <span className="bg-secondary-container text-black font-headline text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-[1px] shadow-[0_0_20px_rgba(255,219,60,0.4)]">
            {badge}
          </span>
        </div>
      )}
    </div>

    <div className="p-8 flex flex-col flex-1 relative z-20 bg-gradient-to-b from-transparent to-black/20">
      <span className="font-headline text-[9px] font-black text-primary-container uppercase tracking-[0.4em] mb-3">
        {series}
      </span>
      <h3 className="font-headline text-xl font-black text-[#e5e2e1] mb-8 uppercase italic leading-[0.9] tracking-tighter group-hover:text-white transition-colors">
        {name}
      </h3>

      <div className="mt-auto flex items-end justify-between">
        <div className="flex flex-col">
          <span className="font-headline text-3xl font-black text-secondary-container tracking-tighter italic tabular-nums">
            {price}
          </span>
          <div className="flex items-center gap-2 mt-3">
            <span
              className={`size-2 rounded-full ${statusColor} ${status !== "Sold Out" ? "animate-pulse shadow-[0_0_10px_currentColor]" : "opacity-40"}`}
            ></span>
            <span className="font-headline text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">
              {status}
            </span>
          </div>
        </div>
        <button className="size-14 flex items-center justify-center bg-[#242424] border border-white/5 hover:bg-primary-container hover:text-white transition-all rounded-[1px] shadow-2xl group/btn active:scale-90">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform font-light">
            shopping_cart_checkout
          </span>
        </button>
      </div>
    </div>
  </article>
);

const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-8 italic">
      {title}
    </h4>
    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link}>
          <a
            className="text-xs font-light text-white/20 hover:text-primary-container transition-colors uppercase tracking-[0.2em]"
            href="#"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
