"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PreOrders() {
  const [inStockOnly, setInStockOnly] = useState(false);

  // High-fidelity Pre-Order Specimen Data
  const reservations = [
    {
      id: 1,
      brand: "Inno64",
      series: "Racing Heritage Series",
      name: "Porsche 911 GT3",
      price: "₱4,250.00",
      arrival: "Q3 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDesdAf9tOHNp6JUOjNgVjckEwgm977mQhm_iMpBWdG4ymR7leL4wY-OZHgxr9jM8E0Q5Jdicbd3UcM3gZbYSXtn8w4l8CTTna_qZ6A4vxw8oPvG5d3qBkuFWzkK8LCnLuEBuecCpIzUYfT7nA1NoVyqMlAMW_6RrQOfxrNKrt9QYsADpa4LffanvgYwVuVtE5rL7SOjjNO3SXv7J4aOeUmtRcpuRZto9_OoAAlABC-e6wRrtm50aAks2KfBe1f9CHPV3-4gQTb6gA",
      badge: "STH",
    },
    {
      id: 2,
      brand: "Nissan Official",
      series: "Midnight Club Collection",
      name: "Skyline R34 GT-R Z-Tune",
      price: "₱3,800.00",
      arrival: "Q4 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuY8rKf7e1GU0deZV6H2Mrs31Q9vDIfJSZGGyoO6VYTm_BrNyo0LtrpRQOI-bsfjRa5Lz1FY-1Cq1FR3imDm-Gy33avpZClgu6uzo50tiZltoZ_9qp4abfbnj3Bkc3RDziaPyzc3fbnLsSyxV1Yd3RICUp-SXB9rVGV36Go6JXphKAmT86AQP2znd6IWqJs7dJmDWvAoJhvxcsZfFk2zzjUfBBzP6TuTEmXZ-SoiKiAjM02Yrnd_eocyHfeeGTxc9P_dgpR540OV8",
    },
    {
      id: 3,
      brand: "Hot Wheels RLC",
      series: "80s Icons Premium",
      name: "Lamborghini Countach LP500S",
      price: "₱5,500.00",
      arrival: "OCT 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaPMwwoctFX7zuTTxiJ6kO4hAJPhD19rQ41yeJPTxWSepLVyIb5vSoWje3TNUlO6LPc3OgpBjWq7ZVC4qD3Edwli5jPt0jBGoFIDcqj9Xc1tFT_ZK0q1aLdQwbajRVXsioH3XenBghSr1hOgImbidGKI-xuMRozQdAOt2OPJeVUI-NNC0UQk_inq5PyAMaTVkiGeTU-BkMr9kR2cdCrWLnGpuBfKZAIwdkUIbxNrVXPO0OHmqqUQdowc-ZYgKD5jyMNo5zxBzg2Vo",
      badge: "CHASE",
    },
    {
      id: 4,
      brand: "Tarmac Works",
      series: "Global 64 Series",
      name: "Ferrari F40 Competizione",
      price: "₱2,900.00",
      arrival: "Q4 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOrJEVIeOEqBoScZEzVGOM4Aqjh7KVWN3L-h-3kCuEgAIdZl4167d2OJNsgt1mphXApWScdI1RkuUcmJ9PItuNdGSk8jRll64ZYlOn-6lWQU-2x-I2kkIzYVvkpWQK02As7NX0V9X1XapjpgERF01etPLf0QYfqzmVM17dW5pTSjtgrookN3VLOoJSXrl-R0mM88JmJPmFj0rRIZQVA445fNQBEhfdorcagd4-hrNGrrw8Za-tRXGM95yplKrIGxbRg2cZXpeN64I",
    },
    {
      id: 5,
      brand: "Subaru Performance",
      series: "Rally Legends Collection",
      name: "Subaru Impreza 22B STi",
      price: "₱3,200.00",
      arrival: "Q1 2025",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9ibE1tOWj5PD0677hKsnJ9OPnxExsYIzZT-YSfjU8SQQvgbD2yJXsc2zl_CP3aVW6ToV4ulIToKsXC-7ZuVjJHVecnTYYWKYLSkK6DH3XGC4-VVL0ZxCdZN7-JsNf10wCUI8JHbOssOqnmcA1olypSsG6erFp-Cw0PQmlHT2q74mOOsB3VDDuCroj4W2iaWNx4ACia69Mz6WT3CiRkXwAlQKKE8rEyHgDIRqRV29JPMC5y7Inv1cPPusBzgm9IOqZ3S5Jofa8ECc",
    },
    {
      id: 6,
      brand: "Mattel DC",
      series: "Screen Time Series",
      name: "The Batman Batmobile",
      price: "₱1,850.00",
      arrival: "AUG 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFIWvaREKLhGiYfW9MqC8rwMmZ3d9TSM35H8i16nMvjsSgrQqVDxLZzhXuPazq64CeBdaW5zjEtRpYdl6UrQr2W9xIZeBTr-ur75sFfanLk82Vkdi8RH8Yf5SBO5ELTPuopFCsAz36rZJ42vd_4jSsTodmAblxOtfchS55qnhyp4Yh0d5gfSjDq8W_tyy8fflBCfZ0IYM1EAEsb6LSILlTgGNFUSKVCgKVh1lyqxn3meSjnVBoRvYRYi8Yv4o5tAXnKvtYA9iL8cU",
      badge: "TH",
    },
    {
      id: 7,
      brand: "Schuco",
      series: "Silver Arrows Legacy",
      name: "Mercedes-Benz 300SL",
      price: "₱4,900.00",
      arrival: "SEP 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-p4moLRaSIZpgUvUtfSkekqYWZy6UBvEy_eUZTJr8uYj4rC0UyKFs_UEfRWTqu6q9hYmFeRcZQ6mot9FV5joelE5fGXZwg5UFHaQxG7Ri96SUl8FiBBhbX_vUnflQF4zXmlFyXes30JYXiKSRSUpmWxKg35zmjJ2zN4c9KDOL3eQbhU2MwnQIHCxCaVkA03rN-4P0IvwDp1CWR_byd2TTcN1rFfQzuL_Jpn6u49-CsZVFZJM720n945ls9jHkO1tmvs64TCL5abk",
    },
    {
      id: 8,
      brand: "BBR Models",
      series: "Elite Signature 1:18",
      name: "Ferrari SF90 Stradale",
      price: "₱12,500.00",
      arrival: "Q4 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXrGuiFhseV9ixLQuSCe0vUzJvIKPTwqQhQeYM0Ssjyt4pgFE-YB3h4GYsRs5iX7Arr-rQR9HtcHD3ZsyIkiTDkIf5NuE1EOOAzKpKLQYdH92-HwqpmWvfJngJfI4iZkWF1-uIgWAekJzBMqkNg56qSxqTu3NL8SwQnAz-LxICEGxmxO1v8mk1i25YpI1KBmMIB-0_dYxMm8aPH7hDaLHKMc0Irauteqa9qJqQqDMLWGfYe7ER7HIC475jsCmb6dkJlLmqKW8Gz_s",
    },
    {
      id: 9,
      brand: "Auto World",
      series: "Modern Muscle Series",
      name: "Dodge Viper GTS-R",
      price: "₱2,450.00",
      arrival: "NOV 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDorXlE55kB42x9hvTcslZkmkOjCdr79VSZ21lvJynaHxDQ1qise3yw-yKowHwKE2bym88IPqHH5miQ-8PkSD3zBmNkakjrFtC4ZJHsUtchrPWWgDcN3kSL1oOC4vg8j70rELYSQH5jJqco4sNR8s4usU43F4Sz7nwB4FP0b1wvhCHn4tP5O4GG71dEuyFmZCecJp2dB7nuRHUGdeyzQZBzK0hYYGSByuwtMEL7YPsS-deMknEAlSzVBARLHxOJFrJgvhpyfXv0PrA",
    },
    {
      id: 10,
      brand: "Spark Models",
      series: "Classic Formula Collection",
      name: "Lotus 72D JPS",
      price: "₱6,800.00",
      arrival: "Q4 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOQPLhIdEGc5zj6V3zP_2_K1L5UQhw5qp8USc58iS0zrSmM6XlP9dPUzxHWe4qo6GmQPp1DrahCvUfxEDTklemZcrWwLJE2Ls6OOUoDda9W-53XV2Rok_28XCMnn2YEfi2QgtrBB1JvGMnh_yu1cKyvWjh8GgxaOXrhGL6oBE53sgn06uAy9OYS11EBPcBXGZ0AmaAFpuTpiU5WYEmEIhDtXTyponUfHjAAcdU7FmeOadG9dxfWfvYn8J8OOjUBWvkdV5h-Z6A2KI",
    },
    {
      id: 11,
      brand: "AutoArt",
      series: "Track Only Edition",
      name: "McLaren P1 GTR",
      price: "₱15,200.00",
      arrival: "JAN 2025",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKQeGr2zslPHDmpNTJJwEX2qIkf42Y2ND-I5QFfKI_NLHvfrNb1KHx2PPKOI-cRk3ZB8B9UxHVc8_L8ypTu4804e68ef0NcwBAFiy5VVGE7ZEGDgb9BSvKhVP0Ktim6VJtUSqb27SapaDFQt62PyNEFTKcBCMpA778bO9VvSsXpgDwBl0QT7nW57lOypkXtUTNoe8u7-x5u-jzdk3CLcgEQJLyinszaS9ewQ--1nb_p-3uVNHnUoApzX7RclRZR4IznTK5MFl8Bug",
    },
    {
      id: 12,
      brand: "Kyosho",
      series: "Vintage Speed Series",
      name: "Aston Martin DB5",
      price: "₱7,300.00",
      arrival: "Q4 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmy_o2rrpphAv_oolmbF0wdGjOX5Yu5S23cVFibyNY8PBgEcFLAc7YU2Pq-pK6uzPv9k7Nh3mySkl6ybzv3LmtS6T-ogsivvRHrNoTyndVxq4vlG00EWwQaqiIfS18GrJZt0cPfUMDr9XVaNmCDMQ0KTom4NHwGMtAVvWyusb1te3BSrOIAoU3FJMxhvei38XwiJeE8weP8RPEp4p0phfMUQIYLnQle09RSuL1x5u6aUUAgm4fEsibkXyNT35KM0fGTrXk05xHr8Q",
    },
  ];

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-white min-h-screen">
      {/* Cinematic Hero Header */}
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
            PRE-<span className="text-primary-container">ORDERS</span>
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

      <main className="max-w-[1700px] mx-auto px-12 py-16 flex flex-col xl:flex-row gap-16">
        {/* Machined Sidebar Filters */}
        <aside
          className="w-full xl:w-72 flex-shrink-0 space-y-12 reveal-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div>
            <h3 className="font-headline font-black text-2xl tracking-tighter uppercase mb-8 flex items-center gap-4 italic">
              <span className="w-2 h-8 bg-primary-container inline-block"></span>
              FILTERS
            </h3>

            <div className="space-y-10">
              <FilterSection title="BRAND PROTOCOL">
                <FilterToggle label="HOT WHEELS" />
                <FilterToggle label="MATCHBOX" />
                <FilterToggle label="MINI GT" />
                <FilterToggle label="INNO64" checked />
              </FilterSection>

              <FilterSection title="SERIES CLASS">
                <FilterToggle label="RED LINE CLUB" />
                <FilterToggle label="SUPER TREASURE HUNT" />
                <FilterToggle label="CAR CULTURE" />
              </FilterSection>

              <FilterSection title="SCALE HUB">
                <div className="grid grid-cols-2 gap-3">
                  {["1:64", "1:43", "1:18", "1:24"].map((scale) => (
                    <button
                      key={scale}
                      className="py-3 px-4 bg-surface-container-high text-[10px] font-black uppercase tracking-widest hover:bg-primary-container hover:text-white transition-all border border-white/5 italic"
                    >
                      {scale}
                    </button>
                  ))}
                </div>
              </FilterSection>
            </div>
          </div>
        </aside>

        {/* Specimen Reservation Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reservations.map((item, idx) => (
              <ReservationCard key={item.id} {...item} index={idx} />
            ))}
          </div>

          {/* Telemetry Status Bar */}
          <div
            className="mt-20 flex flex-col items-center reveal-up"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-[10px] font-headline font-black uppercase tracking-[0.4em] text-on-surface/20 mb-6 italic">
              Showing 12 of 48 Pending Releases
            </p>
            <div className="w-full max-w-sm h-1 bg-[#1A1A1A] mb-10 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1/4 bg-primary-container animate-pulse"></div>
            </div>
            <button className="px-20 py-5 bg-transparent border-2 border-primary-container text-primary-container font-headline font-black uppercase tracking-widest text-[10px] hover:bg-primary-container hover:text-white transition-all italic shadow-2xl active:scale-95">
              SHOW MORE
            </button>
          </div>
        </div>
      </main>

      {/* Industrial Footer Credit */}
      <footer className="bg-surface-container-lowest py-20 px-12 mt-20 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="font-headline font-black text-2xl italic text-primary-container tracking-tighter">
            TURBO COLLECTOR
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
            {[
              "Terms of Sale",
              "Shipping Specs",
              "Privacy Protocol",
              "Contact Engine",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-primary-container transition-colors italic underline decoration-white/0 hover:decoration-primary-container/40 underline-offset-8"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-[10px] font-black text-white/5 tracking-[0.4em]">
            © 2026 MACHINA CONTROL INDUSTRIAL
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .spec-badge {
          clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);
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

const FilterSection = ({ title, children }) => (
  <section className="space-y-5">
    <h4 className="text-[9px] font-headline font-black tracking-[0.4em] text-on-surface/20 uppercase italic">
      {title}
    </h4>
    <div className="flex flex-col gap-4">{children}</div>
  </section>
);

const FilterToggle = ({ label, checked }) => (
  <label className="flex items-center gap-4 cursor-pointer group">
    <div className="relative size-5 border-2 border-white/10 rounded-[1px] group-hover:border-primary-container transition-all flex items-center justify-center overflow-hidden">
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
    <span className="text-[11px] font-black uppercase tracking-widest text-on-surface/30 group-hover:text-white transition-colors italic">
      {label}
    </span>
  </label>
);

const ReservationCard = ({
  brand,
  series,
  name,
  price,
  arrival,
  img,
  badge,
  index,
}) => (
  <article
    className="group relative bg-[#1A1A1A] border border-white/5 overflow-hidden flex flex-col transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_45px_100px_rgba(0,0,0,1)] reveal-up shadow-2xl"
    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
  >
    <div className="relative aspect-square overflow-hidden bg-black p-6">
      <img
        className="w-full h-full object-contain mix-blend-lighten transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-6 opacity-60 group-hover:opacity-100"
        src={img}
        alt={name}
      />

      {/* Dynamic Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
        <span className="bg-primary-container text-white px-4 py-1 font-headline font-black text-[9px] tracking-[0.2em] uppercase spec-badge italic border-r-4 border-white/20">
          PRE-ORDER
        </span>
        {badge && (
          <span className="bg-secondary-container text-black px-4 py-1 font-headline font-black text-[9px] tracking-[0.2em] uppercase spec-badge italic shadow-xl">
            {badge}
          </span>
        )}
      </div>

      {/* Reservation Intent Overlay */}
      <div className="absolute inset-0 bg-primary-container/0 group-hover:bg-primary-container/20 transition-all duration-500 flex items-center justify-center z-20">
        <button className="opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-500 bg-[#E5112D] text-white px-8 py-4 font-headline font-black uppercase tracking-widest text-xs italic shadow-[0_20px_40px_rgba(0,0,0,0.5)] active:scale-90">
          RESERVE SLOT
        </button>
      </div>
    </div>

    <div className="p-8 flex-1 flex flex-col border-t border-white/5 relative bg-gradient-to-b from-transparent to-black/20">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-headline font-black tracking-[0.3em] text-primary-container uppercase italic">
          {brand}
        </span>
        <span className="text-[10px] font-black text-secondary-container italic tabular-nums">
          {price}
        </span>
      </div>
      <h3 className="font-headline font-black text-xl leading-none uppercase italic tracking-tighter mb-2 group-hover:text-white transition-colors truncate">
        {name}
      </h3>
      <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-[0.2em] mb-8 italic opacity-30">
        {series}
      </p>

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em] italic">
          Expected Arrival
        </span>
        <span className="text-[10px] font-black text-on-surface uppercase tracking-widest italic animate-pulse">
          {arrival}
        </span>
      </div>
    </div>
  </article>
);
