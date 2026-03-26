"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ProductDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReservation = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-white min-h-screen">
      <main className="pt-24 lg:pt-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 px-6 lg:px-12 pb-24">
          {/* Left Column: Sticky Display Case */}
          <div className="md:sticky md:top-32 h-fit space-y-8 reveal-up">
            <div className="relative aspect-square bg-surface-container-lowest border border-white/5 overflow-hidden display-case-lighting group shadow-2xl">
              <div className="absolute inset-0 carbon-noise opacity-30 pointer-events-none"></div>
              <img
                alt="Premium Diecast Model"
                className="w-full h-full object-contain p-12 transition-transform duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO4bcRpC7Vv_wtoQqNMui3IuYb_CfeVOb8OMtEWHn8C0mmxXx7PNNvtc0AN7sR3yJ1i431rXWq0x0SUjD3Q8kUCu_f_bd9eYWSY5a3P2o3vhmT44AAgfpXDIyPITAU5I3HnaeacXSg1ZJ2i4ANuWMUjm8T3_41OEdSqd2GUEsw1swWunnMsY1yu_OVrMuEt0Ro_WSKtYhpYKjdaIpfS4z-6wKaup2BiePpjBEPkdKjq4ghoZrr9uKsQ_5i9KIFlab1wLTMN1hbK4A"
              />

              {/* Telemetry Tags */}
              <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
                <span className="bg-[#FFDB3C] text-black font-headline font-black text-[10px] px-4 py-2 uppercase tracking-tighter shadow-2xl skew-x-[-12deg]">
                  SUPER TREASURE HUNT
                </span>
                <span className="bg-[#E8112D] text-white font-headline font-black text-[10px] px-4 py-2 uppercase tracking-tighter shadow-2xl skew-x-[-12deg]">
                  LIMITED SPEC
                </span>
              </div>

              {/* Plate Reference */}
              <div className="absolute bottom-8 left-8 z-20">
                <div className="bg-surface/90 backdrop-blur-md px-6 py-4 border-l-4 border-[#E8112D] border border-white/5 shadow-2x">
                  <p className="font-headline text-[9px] uppercase tracking-[0.4em] text-on-surface/40 mb-1 font-bold">
                    BATCH REFERENCE
                  </p>
                  <p className="font-headline font-black text-lg tracking-tight italic">
                    EMD-2024-XP01
                  </p>
                </div>
              </div>
            </div>

            {/* View Multi-Angle Strip */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square bg-surface-container-high p-4 border transition-all cursor-pointer hover:border-primary-container ${i === 1 ? "border-primary-container" : "border-white/5 grayscale opacity-50"}`}
                >
                  <img
                    src={`https://lh3.googleusercontent.com/aida-public/AB6AXuAyRYrLuFfkwt9OJjEiSeKdG4VzYqLrRp7re1hXqaDThZY13Os83MjsG4wkZdWl4UACE0lGgDjrKs6ZF-odfhFSKbhCVVi4ytRYwdVPImeaJw7q2mcZPUWPpPriEVLDdkP-H998n7J7whL62R3naaZpOQVYEyn9KMeDC0FdU0E6Y531g4GLv_m360lkolxCeBas4Pn-klrqtnsp5O7ha2cpCuNfUhKeVW6ienX1HKmh7wSxYdGcqjfEzdT6cDVpUvila8bH-UrcBSA`}
                    className="w-full h-full object-contain"
                    alt="Angle"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Spec Sheet & Control */}
          <div className="py-0 reveal-up" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-12">
              {/* Identification Block */}
              <div>
                <span className="inline-block bg-[#E8112D]/10 text-[#E8112D] font-headline font-black text-[10px] tracking-[0.4em] px-4 py-2 border border-[#E8112D]/20 mb-8 uppercase italic">
                  MERCEDES-BENZ PERFORMANCE
                </span>
                <h1 className="text-[60px] lg:text-[100px] font-headline font-black uppercase leading-[0.8] tracking-tighter mb-6 italic">
                  190E 2.5-16{" "}
                  <span className="text-[#E8112D] block">EVO II</span>
                </h1>
                <div className="flex items-center gap-6">
                  <p className="text-on-surface-variant font-headline font-black tracking-[0.2em] text-lg uppercase flex items-center gap-4 italic">
                    HWA LEGACY SERIES
                  </p>
                  <span className="w-16 h-px bg-white/10"></span>
                  <span className="text-[#FFDB3C] font-black italic tracking-widest text-sm uppercase">
                    NO. 042 OF 500
                  </span>
                </div>
              </div>

              {/* Allocation Telemetry */}
              <div className="bg-surface-container-low p-12 border border-white/5 carbon-noise relative group">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <p className="font-headline text-[10px] uppercase tracking-[0.5em] text-on-surface/30 mb-3 font-bold">
                      RESERVE PRICE
                    </p>
                    <p className="text-5xl lg:text-7xl font-headline font-black text-[#FFDB3C] tracking-tighter italic tabular-nums">
                      ₱14,450.00
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline text-[10px] uppercase tracking-[0.5em] text-on-surface/30 mb-3 font-bold">
                      INVENTORY
                    </p>
                    <p className="text-xl font-headline font-black text-[#E8112D] uppercase tracking-tight animate-pulse">
                      12 UNITS LEFT
                    </p>
                  </div>
                </div>

                <div className="h-3 w-full bg-surface-container-highest overflow-hidden relative">
                  <div className="h-full bg-[#E8112D] w-[15%] relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/20 italic">
                    SYSTEM EXHAUSTION
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E8112D] italic">
                    85% ALLOCATED
                  </span>
                </div>
              </div>

              {/* Action Drivers */}
              <div className="space-y-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-8 bg-[#E8112D] hover:bg-white hover:text-black text-white font-headline font-black text-2xl uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl italic sharp-edge"
                >
                  Reserve This Car
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-4 py-6 border border-white/10 hover:bg-surface-container-high transition-all font-headline font-black text-[11px] uppercase tracking-[0.3em] italic">
                    <span className="material-symbols-outlined text-base">
                      bookmark
                    </span>{" "}
                    Watchlist
                  </button>
                  <button className="flex items-center justify-center gap-4 py-6 border border-white/10 hover:bg-surface-container-high transition-all font-headline font-black text-[11px] uppercase tracking-[0.3em] italic">
                    <span className="material-symbols-outlined text-base">
                      share
                    </span>{" "}
                    Share Asset
                  </button>
                </div>
              </div>

              {/* Detailed Specs Grids */}
              <div className="grid grid-cols-1 gap-16 pt-12 border-t border-white/5">
                <div className="space-y-6">
                  <h3 className="font-headline font-black uppercase tracking-[0.4em] text-[10px] text-primary-container flex items-center gap-4 italic">
                    01 THE STORY & DETAILS
                  </h3>
                  <div className="text-on-surface/60 text-lg leading-relaxed space-y-8 font-medium italic">
                    <p>
                      A precision-engineered 1:18 scale replica of the legendary
                      homologation special. This model features a high-density
                      zinc-alloy cast body with 142 individual components. The
                      "Black Pearl" metallic finish is applied using a 4-stage
                      automotive painting process.
                    </p>
                    <p>
                      Includes working steering, independent suspension blocks,
                      and a fully realized M102 engine bay with braided wire
                      detailing.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="font-headline font-black uppercase tracking-[0.4em] text-[10px] text-primary-container flex items-center gap-4 italic">
                    02 TECHNICAL SPECIFICATIONS
                  </h3>
                  <div className="grid grid-cols-1 border-t border-white/5">
                    {[
                      { l: "Scale", v: "1:18 Precision" },
                      { l: "Material", v: "Die-Cast Zinc / ABS" },
                      { l: "Series", v: "HWA Legacy Edition" },
                      { l: "Release", v: "2024 Protocol" },
                      { l: "Color", v: "Obsidian Black" },
                    ].map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between py-5 border-b border-white/5 group hover:bg-white/5 px-4 transition-all"
                      >
                        <span className="text-[10px] uppercase tracking-[0.5em] text-on-surface/30 font-black italic">
                          {spec.l}
                        </span>
                        <span className="text-[11px] font-black uppercase tracking-widest italic">
                          {spec.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Specimens Section */}
        <section className="bg-surface-container-lowest py-24 border-t border-white/5">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-end mb-16">
              <div>
                <p className="font-headline text-[10px] font-black uppercase tracking-[0.6em] text-primary-container mb-4 italic">
                  CURATED SELECTION
                </p>
                <h2 className="text-4xl lg:text-6xl font-headline font-black uppercase tracking-tighter italic">
                  SIMILAR SPECIMENS
                </h2>
              </div>
              <Link
                href="/customer/product"
                className="font-headline font-black text-xs uppercase tracking-widest border-b-2 border-primary-container pb-2 hover:text-primary-container transition-all italic"
              >
                VIEW_ALL_CATALOG
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Simplified recommendation cards */}
              {[
                {
                  name: "Porsche 911 GT3 RS",
                  price: "₱2,050",
                  brand: "Car Culture",
                },
                {
                  name: "Nissan Skyline GT-R",
                  price: "₱1,650",
                  brand: "Boulevard",
                },
                {
                  name: "Lancia Delta Integrale",
                  price: "₱1,850",
                  brand: "Modern Classics",
                },
                { name: "Ferrari F40", price: "₱2,650", brand: "Elite Series" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-high border border-white/5 p-8 transition-all hover:-translate-y-2 hover:border-primary-container shadow-2xl"
                >
                  <div className="aspect-square bg-black mb-8 p-6">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAai2EZmMLbYdoF3a6owAECBUYPcnFtHpYEv0jyohLw7OblEM0_xrLicRcv76-yOGzMbR49FoX1YxExdquQuCITzT8B8ZYYjgcyGmcVpIh-GTEM0-8jdTz-jpP1R5edJ_t4KaqmUKY1IDf7MqW23XnAj3Z6piw2jxvbJr6YDMKvjYDPc_XapL7_E88c5C3c2Ki64kzm87RFAnCMX_BhT4C9122HEVKYO9-lTyGQHeTzvEjyDsZ2Nk9AMdwh6JQzJyTHeFLmEUFRLJ0"
                      className="w-full h-full object-contain mix-blend-lighten"
                      alt="Rec"
                    />
                  </div>
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-2 italic">
                    {item.brand}
                  </p>
                  <h4 className="text-xl font-headline font-black uppercase italic tracking-tighter mb-4">
                    {item.name}
                  </h4>
                  <p className="text-2xl font-headline font-black italic tabular-nums text-[#FFDB3C]">
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Reservation Terminal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-2xl bg-surface-container border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,1)] p-12 lg:p-16 overflow-hidden carbon-noise reveal-up">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/5 -mr-24 -mt-24 rotate-45 pointer-events-none"></div>

            {!isSubmitted ? (
              <div>
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <p className="font-headline text-[10px] uppercase tracking-[0.6em] text-[#E8112D] mb-4 font-black italic">
                      INTERNAL REQUISITION
                    </p>
                    <h2 className="text-5xl lg:text-6xl font-headline font-black uppercase tracking-tighter italic">
                      SECURE RESERVATION
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="material-symbols-outlined hover:text-[#E8112D] transition-colors text-3xl"
                  >
                    close
                  </button>
                </div>

                <form className="space-y-10" onSubmit={handleReservation}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="block font-headline text-[10px] uppercase tracking-[0.3em] text-white/30 font-black italic">
                        Full Name
                      </label>
                      <input
                        className="w-full bg-[#1A1A1A] border-b-2 border-white/5 focus:border-[#E8112D] text-sm py-4 px-4 transition-all outline-none italic uppercase font-black"
                        placeholder="MANUAL_ENTRY_REQUIRED"
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block font-headline text-[10px] uppercase tracking-[0.3em] text-white/30 font-black italic">
                        Collector ID/Email
                      </label>
                      <input
                        type="email"
                        className="w-full bg-[#1A1A1A] border-b-2 border-white/5 focus:border-[#E8112D] text-sm py-4 px-4 transition-all outline-none italic uppercase font-black"
                        placeholder="SECURE_CHANNEL_ONLY"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-8 bg-[#E8112D] hover:bg-white hover:text-black text-white font-headline font-black text-2xl uppercase tracking-[0.4em] transition-all italic sharp-edge shadow-2xl"
                  >
                    Confirm Reservation
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-20 text-center animate-fade-in">
                <div className="size-24 bg-[#FFDB3C] rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(255,219,60,0.3)]">
                  <span className="material-symbols-outlined text-5xl text-black font-black">
                    check
                  </span>
                </div>
                <h3 className="text-5xl font-headline font-black uppercase tracking-tighter italic mb-6">
                  RESERVATION LOGGED
                </h3>
                <p className="text-on-surface/40 max-w-sm mx-auto mb-16 text-sm leading-relaxed font-black uppercase tracking-widest italic">
                  TRANSACTION_ID:{" "}
                  <span className="text-[#FFDB3C]">EMD-RES-88219</span>. <br />{" "}
                  AN ENVOY WILL CONTACT YOU SHORTLY TO FINALIZE.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-16 py-5 border-2 border-white/10 hover:border-[#FFDB3C] hover:text-[#FFDB3C] font-headline font-black text-[11px] uppercase tracking-[0.4em] transition-all italic"
                >
                  Close Terminal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .display-case-lighting {
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 70%
            ),
            linear-gradient(to top, rgba(19, 19, 19, 0.9) 0%, transparent 40%);
        }
        .reveal-up {
          animation: reveal-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes reveal-up {
          0% {
            transform: translateY(60px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .sharp-edge {
          clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
        }
      `}</style>
    </div>
  );
}
