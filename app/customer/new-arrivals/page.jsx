"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function NewArrivals() {
  const [inStockOnly, setInStockOnly] = useState(true);

  // High-fidelity Product Data for New Arrivals
  const arrivals = [
    {
      id: 1,
      brand: "HW Premium",
      series: "Car Culture: Ronin Run",
      name: "Ferrari 250 GTO",
      price: "₱1,450",
      status: "IN STOCK",
      statusColor: "text-secondary-fixed",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCewXvOnGwgTJxdyqT5GW7uPHnUH3_GcXGzvVI1ZRmpjnoBQmwT9ExUzWjfLIw8bgcg2LbiGM8TYA2EHcC9L2rp8lHtPSeMVNowp6XcmNFbVMwnDZGgBET7J-6UG3p0jf_Yrpa336yO3u_e67mcM63D6ZIOGUpqUl778r43d_-PpByPRw-0sXLzQZwTj0cvAhnPckAEhdO0wivF6iIAJfc8CjptlHZYKz2wxFIEMDqzhw6nEQ3c1p55bTYrrTGlE3YEonHG9nOILOk",
      badge: "JUST DROPPED",
      badgeColor: "bg-secondary-container text-on-secondary-container",
    },
    {
      id: 2,
      brand: "HOT WHEELS",
      series: "Super Treasure Hunt 2024",
      name: "Nissan Skyline GT-R",
      price: "₱4,950",
      status: "LIMITED RELEASE",
      statusColor: "text-primary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4t8dkjEBLFqPXppkMjoWLEkt1DntsjHF1l8q5OtBLY_UhIKeT239SZXwdwGkNVZaB0M2dMWH2eE3qdTTcdRiuuS-i46sK-tuVwbbACFjvqCcsw4nlrD47V-CmMf6umCCk7SYJAKr8FaSbdB4WDZpdpTRVPAfMZufYGlHvZSOlUfP5xLn_zlumbXaYDC88q99vkrm5vDIMi3Bos8J-eddOsk8zyF-fhwJLiHij86I9XpYSOEC89wPmpHrbJkZIVQ__iAZt0Cu7lOs",
      badge: "STH",
      badgeColor: "bg-primary-container text-white",
    },
    {
      id: 3,
      brand: "MATCHBOX",
      series: "Collectors Series 2024",
      name: "Porsche 911 GT3",
      price: "₱850",
      status: "IN STOCK",
      statusColor: "text-secondary-fixed",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBO6vdv_2v3-0-mHBqD4uU78NyC1K0zi6399opb850fShJ_TCvnExyU_i6mDQYUIJ5-Iy56zmgCA59OYJEjnX0MTAywI05zDbZtugiSc4tYdQkf9eAhbFI8HuVcFBGoyAbow7jVV6XN57W_1Cs5Ucf7rO9suxWyU5D9XSH02xFZXYMjxU85hkqMc35n0f2IWFTJKk5Y3zrmOJ_CSs7SVJCHonyPcp-zLkULJvNCFUyTPO7Pihi9bjogMfz7DNai1rhrIl5L1YIz_V4",
    },
    {
      id: 4,
      brand: "MINI GT",
      series: "Modern Classics",
      name: "Audi RS6 Avant",
      price: "₱1,200",
      status: "IN STOCK",
      statusColor: "text-secondary-fixed",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJD1IAYxyZA5W_eP0iitWKJ4KiFF7IgcXjF1ho2HFneo6Z6XElggFEB1prHody-1dHXnYLhr9e84F2iGjzqjLdpuawT8gEK9_-o99sEDPqgTEmUTMSspVSjbodBM7zQuOYRMYROiWcXroGLRRxFC3j-pJm_RjSLtdPIgfVUe1YjR-fgl_JuedCCAvdvv4VE2Ifu14RcMp2LZ5B_9I6ngrSZvmDNlDKlPunLxQviNK1EEFpmodJAJXeb1isY-IPRHeWQT0XyUGNKYA",
    },
    {
      id: 5,
      brand: "INNO64",
      series: "Historical Series",
      name: "Lamborghini Miura",
      price: "₱1,850",
      status: "IN STOCK",
      statusColor: "text-secondary-fixed",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtnJZ9XkVvABzUP6fP34MJjt2H6CJkQLJTXLPbhYCDmheOu66OB6Jc3Lmrj6MeYkqyoMMrjKRFdiW4rY2XGAhsRrOn-ImTaQWgY03C_yzZZXDLa0nhsARlmliV85bud2m3UYk0ywcYfoZWevKZiMkD-HXVK29Sybn4PRBXwC_4tX8wENj7e8_h_bLG01QltWkCexqPT2DwF3osoFmpelAC0iWHB6YskvHefL4JVuL_uHZ0tk1vffbys2Cbc4TkxfVcb7H1-Iab5iM",
    },
    {
      id: 6,
      brand: "HW Premium",
      series: "Boulevard Wave 2",
      name: "'69 Dodge Charger",
      price: "₱1,250",
      status: "IN STOCK",
      statusColor: "text-secondary-fixed",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBX4y474i7TjPvIetJqZpnQym7V5w1c20h1sWkp1oq0Ufh48oGLsIHelz7a8Xc7lkH_y5lXihr9uwzn0fmpUS0-RdOQZyVkBQ00YHily-v6s5QVeNZHrm-pZPcDUZMUeVHv5r2xbW4s_k395ZCGRc8BA4CMEOejj_o0QyzzYCQmZ1lFA4YwamzQ8Gn3uinDdI1EO-zw8e794oX5qs-t1eMcMOW8EZ4HrkSTzU9CJ0YYMFiFHV7du26Mg-Jjr_nNhM9IzkQrhTc6FTU",
    },
    {
      id: 7,
      brand: "MB Moving Parts",
      series: "Rally Icons",
      name: "Lancia Delta Integrale",
      price: "₱650",
      status: "JUST DROPPED",
      statusColor: "text-primary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKNUVYwT714zMhXS08OFj3yb-JV5D73A9WNe2YEu9Dl3zyFL9HlUMA7VeBINN2Yuj6pBZax2DAAzBRO7GFqsqQNEggg5lH3zHv2Xk490JDkxDajhCHb2eJnQ22nBWtjI3Z6qyNDnrLC8JvZ2Hf5-DXLIrQYUCTrqlw4--cfl6Qhy0XlJVBYKU5ovT_kWv5HWKiqM4wgLOA3GUvhHGroM_flIleaCvcN5wAz9p15LldsI0zsCRKJv1ulWVypTRkkh2Nm-FtgIwndeU",
      badge: "JUST DROPPED",
      badgeColor: "bg-secondary-container text-on-secondary-container",
    },
    {
      id: 8,
      brand: "HOT WHEELS",
      series: "Racing Legends",
      name: "Corvette C8.R",
      price: "₱350",
      status: "IN STOCK",
      statusColor: "text-secondary-fixed",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCikDB8WA4SPLJYlSRx7plrx0X5u4G6OFNSql8ah4n_ufQoieO9x0aHo8ohZAnrvGxz9SgcfxBtzzcOf_UghZn1WWDsyYHXe1nncePj9TlQZX1A-Rz66pKikeFDN7EmBTJJ17-PeM_hBADNhsM_eFejDasJx-bQ_rvNMo_xS1l3H5QxvjcuBHwus7bwFLknF3GwAVTMrDvizTYLea0zxD73PdN0Zn6EItfbJoALlLRcqutQgDw3JD0lmP_JdF147sj-kAVn9j4h4Ws",
    },
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-white min-h-screen">
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
            NEW<span className="text-primary-container"> ARRIVALS</span>
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

      <main className="pt-32 pb-20 industrial-grid">
        {/* Page Protocol Header */}

        <div className="flex flex-col lg:flex-row gap-12 px-6 lg:px-12">
          {/* Machine Control Filters */}
          <aside
            className="w-full lg:w-72 flex-shrink-0 space-y-10 reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-surface-container-high p-8 rounded-sm border-l-2 border-primary-container border-b border-white/5 carbon-noise">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h3 className="font-headline font-black uppercase tracking-[0.3em] text-[10px] text-primary">
                  System Filters
                </h3>
                <span className="material-symbols-outlined text-sm opacity-30">
                  tune
                </span>
              </div>

              {/* Filter Modules */}
              <div className="space-y-10">
                <FilterGroup title="MANUFACTURER">
                  <FilterCheck label="HOT WHEELS" count="24" checked />
                  <FilterCheck label="MATCHBOX" count="12" />
                  <FilterCheck label="MINI GT" count="8" />
                  <FilterCheck label="INNO64" count="5" />
                </FilterGroup>

                <FilterGroup title="SERIES PROTOCOL">
                  <FilterCheck label="CAR CULTURE" />
                  <FilterCheck label="BOULEVARD" checked />
                  <FilterCheck label="MAINLINE" />
                </FilterGroup>

                <div className="pt-8 border-t border-white/5">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-[10px] font-headline font-black tracking-[0.2em] uppercase text-on-surface/40 group-hover:text-white transition-colors italic">
                      In Stock Only
                    </span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={() => setInStockOnly(!inStockOnly)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#252525] rounded-full peer peer-checked:bg-primary-container after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-white border border-white/5 transition-colors"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Specimen Grid */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {arrivals.map((item, idx) => (
                <ArrivalCard key={item.id} {...item} index={idx} />
              ))}
            </div>

            {/* Pagination Protocol */}
            <div
              className="mt-20 flex justify-center reveal-up"
              style={{ animationDelay: "0.8s" }}
            >
              <button className="bg-primary-container hover:bg-surface-container-highest text-white px-16 py-5 border-2 border-white/5 hover:border-primary-container text-[10px] font-black uppercase tracking-[0.5em] transition-all group italic shadow-2xl active:scale-95">
                SHOW MORE
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Industrial Footer Credit */}
      <footer className="bg-surface-container-lowest py-16 px-12 border-t border-white/5 mt-20">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="font-headline font-black text-xl italic text-white/20 tracking-tighter">
            ETHAN MARCUS // NEW ARRIVALS
          </div>
          <div className="flex gap-12 text-[10px] font-black tracking-[0.3em] text-white/10 uppercase">
            {["Protocol", "Vault Terms", "Shipping Spec", "Archive"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ),
            )}
          </div>
          <p className="text-[10px] font-black text-white/5 tracking-[0.4em]">
            © 2026 MACHINA CONTROL INDUSTRIAL
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .industrial-grid {
          background-image: radial-gradient(
            circle at 2px 2px,
            rgba(200, 16, 46, 0.08) 1px,
            transparent 0
          );
          background-size: 48px 48px;
        }
        .carbon-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
        }
        .reveal-up {
          animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes reveal-up {
          0% {
            transform: translateY(40px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

const FilterGroup = ({ title, children }) => (
  <div className="space-y-5">
    <h4 className="font-headline font-black text-[9px] tracking-[0.4em] text-on-surface/30 uppercase italic">
      {title}
    </h4>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const FilterCheck = ({ label, count, checked }) => (
  <label className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="relative size-5 border-2 border-white/10 rounded-[1px] group-hover:border-primary/50 transition-all overflow-hidden flex items-center justify-center">
        <input
          type="checkbox"
          defaultChecked={checked}
          className="peer absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="size-full bg-primary-container scale-0 peer-checked:scale-100 transition-transform duration-300"></div>
        <span className="material-symbols-outlined absolute text-xs text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
          check
        </span>
      </div>
      <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface/40 group-hover:text-white transition-colors">
        {label}
      </span>
    </div>
    {count && (
      <span className="text-[10px] font-black text-white/10 group-hover:text-primary transition-colors italic">
        {count}
      </span>
    )}
  </label>
);

const ArrivalCard = ({
  brand,
  series,
  name,
  price,
  status,
  statusColor,
  img,
  badge,
  badgeColor,
  index,
}) => (
  <article
    className="bg-surface-container-low group flex flex-col border border-white/5 hover:border-primary-container/40 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.9)] reveal-up shadow-2xl"
    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-black p-4">
      <img
        className="w-full h-full object-contain mix-blend-lighten transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-3 opacity-80 group-hover:opacity-100"
        src={img}
        alt={name}
      />
      {badge && (
        <div
          className={`absolute top-0 right-0 ${badgeColor} px-3 py-1.5 font-headline font-black text-[9px] uppercase tracking-tighter italic shadow-2xl z-10`}
        >
          {badge}
        </div>
      )}
      <div className="absolute bottom-3 left-3 flex gap-1 z-10 opacity-30 group-hover:opacity-100 transition-opacity">
        <span className="bg-[#1A1A1A] text-white border border-white/10 px-2 py-0.5 text-[8px] font-black uppercase font-headline tracking-widest">
          1:64
        </span>
      </div>
    </div>

    <div className="p-8 flex-grow flex flex-col border-t border-white/5 relative z-20">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[9px] font-headline font-black text-primary tracking-[0.3em] uppercase italic">
          {brand}
        </span>
        <span
          className={`text-[9px] font-headline font-black ${statusColor} tracking-[0.3em] uppercase italic animate-pulse`}
        >
          {status}
        </span>
      </div>
      <h3 className="font-headline font-black text-xl leading-none uppercase tracking-tighter mb-2 group-hover:text-white transition-colors italic truncate">
        {name}
      </h3>
      <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-[0.2em] mb-8 italic opacity-40">
        {series}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className="font-headline font-black text-3xl text-on-surface tracking-tighter italic tabular-nums">
          {price}
        </span>
        <button className="size-14 bg-[#242424] hover:bg-primary-container text-white transition-all duration-300 rounded-[1px] flex items-center justify-center border border-white/5 shadow-2xl group/btn active:scale-90">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform font-light">
            shopping_cart_checkout
          </span>
        </button>
      </div>
    </div>
  </article>
);
