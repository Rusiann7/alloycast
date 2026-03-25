"use client";

import React, { useState } from "react";

export default function AdminAnalytics() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const topModels = [
    { name: "Nissan Skyline GT-R R34 (Z-Tune)", units: 48, percentage: 92 },
    { name: "Porsche 911 GT3 RS (992)", units: 42, percentage: 80 },
    { name: "Toyota Supra MK4 (Quicksilver)", units: 35, percentage: 65 },
    { name: "Lamborghini Countach LPI 800-4", units: 31, percentage: 58 },
    { name: "Ford Bronco Wildtrak (Area 51)", units: 28, percentage: 52 },
    { name: "Mazda RX-7 FD (Spirit R)", units: 24, percentage: 45 },
  ];

  const criticalStock = [
    {
      name: "LB-Works Lamborghini Aventador",
      sku: "MINI-GT-248",
      base: 120,
      current: 12,
      reserved: 108,
      urgency: "High",
    },
    {
      name: "BMW M3 GTR (E46) Most Wanted",
      sku: "HW-RLC-993",
      base: 50,
      current: 3,
      reserved: 47,
      urgency: "High",
    },
    {
      name: "Mercedes-Benz 190E 2.5-16 Evo II",
      sku: "TARMAC-821",
      base: 80,
      current: 24,
      reserved: 56,
      urgency: "Medium",
    },
    {
      name: "Shelby Cobra 427 S/C (Guardsman Blue)",
      sku: "AW-202-BL",
      base: 60,
      current: 45,
      reserved: 15,
      urgency: "Low",
    },
  ];

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen font-body relative overflow-x-hidden selection:bg-primary-container selection:text-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-[60] bg-[#131313]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-container flex items-center justify-center rounded-[4px]">
            <span className="material-symbols-outlined text-white text-sm">
              precision_manufacturing
            </span>
          </div>
          <h1 className="text-lg font-black font-headline uppercase leading-none italic uppercase">
            ETHAN MARCUS
          </h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="material-symbols-outlined text-white"
        >
          {isSidebarOpen ? "close" : "menu"}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[65]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SideNavBar --- */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-[70] bg-[#131313] flex flex-col pt-12 pb-6 transition-transform duration-500 ease-in-out border-r border-white/5 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-10 mb-16">
          <h1 className="text-2xl font-black text-[#e5e2e1] font-headline uppercase leading-[0.8] tracking-tighter italic">
            ETHAN MARCUS
          </h1>
          <p className="font-headline uppercase text-[9px] font-black tracking-[0.3em] text-[#C8102E] mt-2">
            DIECAST ADMIN
          </p>
        </div>

        <nav className="flex-1 space-y-0.5">
          <SidebarLink
            icon="grid_view"
            label="OVERVIEW"
            href="/admin/dashboard"
          />
          <SidebarLink
            icon="inventory_2"
            label="INVENTORY"
            href="/admin/inventory"
          />
          <SidebarLink
            icon="event_available"
            label="RESERVATIONS"
            href="/admin/reservations"
          />
          <SidebarLink
            icon="analytics"
            label="ANALYTICS"
            active
            href="/admin/analytics"
          />
          <SidebarLink icon="group" label="CUSTOMERS" href="/admin/customers" />
          <SidebarLink icon="ios_share" label="EXPORT" href="/admin/export" />
        </nav>

        <div className="px-6 pt-6 border-t border-white/5 mt-auto">
          <button className="w-full bg-primary-container text-white py-3 font-headline font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all rounded-[2px] mb-6">
            ADD NEW STOCK
          </button>
          <div className="flex items-center gap-4 px-4 py-2 bg-surface-container-high/20 rounded-[4px] border border-white/5 group">
            <div className="w-9 h-9 rounded bg-surface-container-highest border border-white/10 overflow-hidden">
              <img
                src="https://i.pravatar.cc/150?u=ethan"
                alt="Admin"
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-tight">
                Ethan Marcus
              </p>
              <p className="text-[8px] opacity-40 uppercase font-black tracking-widest">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- TopNavBar --- */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[#131313]/60 backdrop-blur-md hidden lg:flex justify-between items-center h-16 px-10 border-b border-white/[0.03]">
        <div className="flex items-center gap-6">
          <h2 className="font-headline uppercase font-black text-2xl tracking-tighter italic">
            Analytics
          </h2>
          <span className="bg-primary-container/20 text-primary-container px-3 py-1 rounded-[2px] text-[10px] font-black border border-primary-container/30 uppercase tracking-widest">
            1,284 UNITS
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/20 text-sm group-focus-within:text-primary-container transition-colors">
              search
            </span>
            <input
              className="bg-[#2a2a2a]/50 border border-white/5 text-[10px] font-headline font-black uppercase tracking-[0.1em] pl-11 pr-4 py-2.5 w-72 focus:ring-1 focus:ring-primary-container/40 rounded-[2px] outline-none transition-all placeholder:opacity-10"
              placeholder="SEARCH SKU OR BRAND..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-5">
            <NavIcon icon="notifications" badge />
            <NavIcon icon="settings" />
            <NavIcon icon="account_circle" />
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="lg:ml-64 pt-24 lg:pt-16 min-h-screen">
        {/* Sticky Date Range Control */}
        <div className="sticky top-16 z-30 bg-[#131313]/90 backdrop-blur-xl border-b border-white/5 px-10 py-5 flex flex-wrap items-center justify-between gap-6 reveal-up">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-lg">
              calendar_today
            </span>
            <span className="font-headline font-black text-xl uppercase tracking-tighter italic">
              Mar 1 – Mar 23, 2026
            </span>
          </div>

          <div className="flex items-center bg-surface-container-high/20 p-1 rounded-[2px] border border-white/5">
            {[
              "Last 7 Days",
              "Last 30 Days",
              "This Month",
              "Last Month",
              "All Time",
            ].map((label) => (
              <button
                key={label}
                onClick={() => setDateRange(label)}
                className={`px-4 py-2 text-[9px] font-headline font-black uppercase tracking-widest transition-all rounded-[1px] ${
                  dateRange === label
                    ? "bg-primary-container text-white shadow-lg"
                    : "text-on-surface/30 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <DateInput label="FROM" value="2026-03-01" />
            <DateInput label="TO" value="2026-03-23" />
          </div>
        </div>

        <div className="p-10 space-y-8 max-w-[1600px] mx-auto">
          {/* Revenue Analysis */}
          <section className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <h3 className="font-headline font-black text-3xl uppercase tracking-tighter italic">
                  Revenue Analysis
                </h3>
                <p className="text-[10px] font-black uppercase text-on-surface/20 tracking-[0.3em] mt-2 border-l-2 border-primary-container pl-3">
                  Aggregate financial performance across all channels
                </p>
              </div>
              <div className="flex sm:flex-col gap-10">
                <LegendItem
                  dotColor="bg-secondary-container"
                  label="ESTIMATED"
                  value="₱412,850.00"
                  valueColor="text-secondary-container"
                />
                <LegendItem
                  dotColor="bg-green-500"
                  label="CONFIRMED"
                  value="₱284,120.00"
                  valueColor="text-green-500"
                />
              </div>
            </div>

            <div className="h-[350px] w-full relative">
              <svg
                className="w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 1000 300"
              >
                <defs>
                  <linearGradient id="grad-green" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#22C55E"
                      stopOpacity="0.2"
                    ></stop>
                    <stop
                      offset="100%"
                      stopColor="#22C55E"
                      stopOpacity="0"
                    ></stop>
                  </linearGradient>
                  <linearGradient id="grad-yellow" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#FFD700"
                      stopOpacity="0.1"
                    ></stop>
                    <stop
                      offset="100%"
                      stopColor="#FFD700"
                      stopOpacity="0"
                    ></stop>
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                {[60, 120, 180, 240].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="1000"
                    y1={y}
                    y2={y}
                    className="stroke-white/[0.05]"
                    strokeWidth="1"
                  />
                ))}
                {/* Estimated Line (Yellow) */}
                <path
                  d="M0,220 L100,180 L200,240 L300,140 L400,160 L500,80 L600,100 L700,40 L800,60 L900,20 L1000,30"
                  fill="none"
                  stroke="#FFD700"
                  strokeDasharray="8,4"
                  strokeWidth="2"
                  strokeOpacity="0.4"
                />
                <path
                  d="M0,220 L100,180 L200,240 L300,140 L400,160 L500,80 L600,100 L700,40 L800,60 L900,20 L1000,30 L1000,300 L0,300 Z"
                  fill="url(#grad-yellow)"
                />
                {/* Confirmed Line (Green) */}
                <path
                  d="M0,250 L100,210 L200,270 L300,190 L400,210 L500,130 L600,150 L700,90 L800,110 L900,70 L1000,80"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="3"
                  className="drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                />
                <path
                  d="M0,250 L100,210 L200,270 L300,190 L400,210 L500,130 L600,150 L700,90 L800,110 L900,70 L1000,80 L1000,300 L0,300 Z"
                  fill="url(#grad-green)"
                />
              </svg>

              <div className="absolute left-0 h-full flex flex-col justify-between text-[9px] font-mono text-on-surface/20 pointer-events-none py-1">
                <span>₱15k</span>
                <span>₱12k</span>
                <span>₱9k</span>
                <span>₱6k</span>
                <span>₱3k</span>
                <span>₱0</span>
              </div>
            </div>
            <div className="flex justify-between mt-6 px-4 text-[9px] font-mono text-on-surface/30 uppercase tracking-[0.3em]">
              <span>MAR 01</span>
              <span>MAR 05</span>
              <span>MAR 10</span>
              <span>MAR 15</span>
              <span>MAR 20</span>
              <span>MAR 23</span>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Reserved Models */}
            <section
              className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-10 italic">
                Top Reserved Models
              </h3>
              <div className="space-y-6">
                {topModels.map((model, i) => (
                  <div key={model.name} className="space-y-3 group">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="group-hover:text-primary-container transition-colors">
                        {model.name}
                      </span>
                      <span className="font-mono text-primary-container tabular-nums">
                        {model.units} UNITS
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/5 relative">
                      <div
                        className="h-full bg-primary-container transition-all duration-1000"
                        style={{
                          width: `${model.percentage}%`,
                          transitionDelay: `${i * 100}ms`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Market Share by Brand */}
            <section
              className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-10 italic">
                Market Share by Brand
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="relative w-56 h-56 group">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="10"
                    ></circle>
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#C8102E"
                      strokeDasharray="251.2"
                      strokeDashoffset="62.8"
                      strokeWidth="12"
                      className="transition-all duration-1000 hover:stroke-width-15 cursor-pointer"
                    ></circle>
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#1446A0"
                      strokeDasharray="251.2"
                      strokeDashoffset="150.7"
                      strokeWidth="12"
                    ></circle>
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#2D6A4F"
                      strokeDasharray="251.2"
                      strokeDashoffset="188.4"
                      strokeWidth="12"
                    ></circle>
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#6B21A8"
                      strokeDasharray="251.2"
                      strokeDashoffset="213.5"
                      strokeWidth="12"
                    ></circle>
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#92400E"
                      strokeDasharray="251.2"
                      strokeDashoffset="238.6"
                      strokeWidth="12"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-headline font-black text-white italic tracking-tighter">
                      412
                    </span>
                    <span className="text-[10px] font-black text-on-surface/20 uppercase tracking-[0.2em] leading-none mt-2">
                      TOTAL UNITS
                    </span>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <BrandLegendItem
                    color="#C8102E"
                    label="Hot Wheels"
                    percentage="35%"
                  />
                  <BrandLegendItem
                    color="#1446A0"
                    label="Matchbox"
                    percentage="25%"
                  />
                  <BrandLegendItem
                    color="#2D6A4F"
                    label="Greenlight"
                    percentage="15%"
                  />
                  <BrandLegendItem
                    color="#6B21A8"
                    label="AutoWorld"
                    percentage="10%"
                  />
                  <BrandLegendItem
                    color="#92400E"
                    label="M2 Machines"
                    percentage="10%"
                  />
                  <BrandLegendItem
                    color="rgba(255,255,255,0.05)"
                    label="Jada"
                    percentage="5%"
                  />
                </div>
              </div>
            </section>

            {/* Fulfillment Pipeline */}
            <section
              className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-10 italic">
                Fulfillment Pipeline
              </h3>
              <div className="h-14 w-full flex rounded-[2px] overflow-hidden mb-10 border border-white/5 p-1 bg-black/40">
                <PipelineSegment
                  color="bg-amber-500"
                  percentage="30%"
                  label="30%"
                />
                <PipelineSegment
                  color="bg-blue-500"
                  percentage="45%"
                  label="45%"
                />
                <PipelineSegment
                  color="bg-green-600"
                  percentage="20%"
                  label="20%"
                />
                <PipelineSegment
                  color="bg-white/10"
                  percentage="5%"
                  label="5%"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <StatusCard
                  border="border-amber-500"
                  label="Pending"
                  count="124"
                />
                <StatusCard
                  border="border-blue-500"
                  label="Confirmed"
                  count="185"
                />
                <StatusCard
                  border="border-green-600"
                  label="Ready"
                  count="82"
                />
                <StatusCard
                  border="border-white/10"
                  label="Cancelled"
                  count="21"
                />
              </div>
            </section>

            {/* Activity Heatmap */}
            <section
              className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter italic">
                  Activity Heatmap
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-on-surface/20 uppercase tracking-widest">
                  <span>Low</span>
                  <HeatBox opacity="0.1" />
                  <HeatBox opacity="0.4" />
                  <HeatBox opacity="0.7" />
                  <HeatBox opacity="1" />
                  <span>High</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2.5 h-[200px]">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-primary-container rounded-[2px] hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-primary-container/0 hover:shadow-primary-container/20"
                    style={{ opacity: Math.random() * 0.9 + 0.1 }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-7 mt-5 text-[10px] font-black text-on-surface/20 uppercase text-center tracking-widest">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
            </section>
          </div>

          {/* Critical Stock Urgency */}
          <section
            className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] overflow-hidden reveal-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="p-10 border-b border-white/[0.03] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="font-headline font-black text-3xl uppercase tracking-tighter italic">
                  Critical Stock Urgency
                </h3>
                <p className="text-[10px] font-black text-primary-container uppercase tracking-widest mt-2 underline decoration-2 underline-offset-8 cursor-pointer">
                  View All Inventory
                </p>
              </div>
              <button className="bg-primary-container text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all rounded-[1px]">
                STOCK REPORT
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#131313] text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                  <tr>
                    <th className="px-10 py-6">Product Model / SKU</th>
                    <th className="px-10 py-6 text-center">Base Stock</th>
                    <th className="px-10 py-6 text-center">Current</th>
                    <th className="px-10 py-6 text-center">Reserved</th>
                    <th className="px-10 py-6">Urgency</th>
                    <th className="px-10 py-6 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {criticalStock.map((item) => (
                    <tr
                      key={item.sku}
                      className="hover:bg-white/[0.01] transition-all group cursor-pointer"
                    >
                      <td className="px-10 py-6">
                        <p className="font-headline font-black text-sm tracking-tight uppercase group-hover:text-primary-container transition-colors italic">
                          {item.name}
                        </p>
                        <p className="text-[9px] font-mono uppercase text-on-surface/20 mt-1 tabular-nums">
                          SKU: {item.sku}
                        </p>
                      </td>
                      <td className="px-10 py-6 font-mono text-center text-xs opacity-40 tabular-nums">
                        {item.base}
                      </td>
                      <td
                        className={`px-10 py-6 font-mono text-center text-xs font-black tabular-nums ${
                          item.urgency === "High"
                            ? "text-primary-container"
                            : item.urgency === "Medium"
                              ? "text-amber-500"
                              : "text-blue-400"
                        }`}
                      >
                        {item.current}
                      </td>
                      <td className="px-10 py-6 font-mono text-center text-xs opacity-60 tabular-nums">
                        {item.reserved}
                      </td>
                      <td className="px-10 py-6">
                        <span
                          className={`px-3 py-1.5 rounded-[1px] text-[9px] font-black uppercase border tracking-widest ${
                            item.urgency === "High"
                              ? "bg-primary-container/10 text-primary-container border-primary-container/20"
                              : item.urgency === "Medium"
                                ? "bg-amber-900/30 text-amber-500 border-amber-900/50"
                                : "bg-blue-900/30 text-blue-500 border-blue-900/20"
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button className="px-6 py-2.5 bg-white/5 hover:bg-primary-container hover:text-white transition-all text-[9px] font-black uppercase rounded-[1px] border border-white/5 hover:border-transparent tracking-widest active:scale-95 duration-100">
                          Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer Decoration */}
        <footer className="mt-20 px-10 pb-20 opacity-10 pointer-events-none">
          <div className="flex items-center gap-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/30"></div>
            <p className="font-headline font-black text-5xl uppercase tracking-tighter italic">
              ETHAN MARCUS DIECAST ADMIN
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/30"></div>
          </div>
        </footer>
      </main>
    </div>
  );
}

const SidebarLink = ({ icon, label, active, href }) => (
  <a
    href={href}
    className={`flex items-center space-x-5 px-10 py-4.5 transition-all group relative ${
      active ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 h-full w-0.5 bg-[#C8102E]" />
    )}
    <span
      className={`material-symbols-outlined transition-all text-xl font-light ${
        active
          ? "text-[#C8102E] scale-110"
          : "opacity-15 group-hover:opacity-100 group-hover:text-white"
      }`}
    >
      {icon}
    </span>
    <span
      className={`text-[10px] font-headline font-black uppercase tracking-[0.35em] transition-all ${
        active ? "text-white" : "text-[#A8A8A0] group-hover:text-white"
      }`}
    >
      {label}
    </span>
  </a>
);

const NavIcon = ({ icon, badge }) => (
  <button className="relative hover:text-primary-container transition-colors group">
    <span className="material-symbols-outlined font-light text-2xl group-hover:rotate-6 transition-transform">
      {icon}
    </span>
    {badge && (
      <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary-container rounded-full ring-2 ring-[#131313]"></span>
    )}
  </button>
);

const DateInput = ({ label, value }) => (
  <div className="flex items-center bg-black/40 border border-white/[0.05] px-4 py-2.5 rounded-[2px] group focus-within:border-primary-container/40 transition-all">
    <span className="text-[9px] font-black text-on-surface/20 mr-4 tracking-widest">
      {label}
    </span>
    <input
      className="bg-transparent border-none p-0 text-[10px] font-mono uppercase focus:ring-0 w-28 text-white tabular-nums outline-none"
      type="text"
      defaultValue={value}
    />
    <span className="material-symbols-outlined text-sm opacity-10 group-hover:opacity-40 transition-opacity ml-2">
      edit
    </span>
  </div>
);

const LegendItem = ({ dotColor, label, value, valueColor }) => (
  <div className="flex flex-col items-end">
    <div className="flex items-center gap-3 mb-2">
      <span
        className={`w-2.5 h-2.5 ${dotColor} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
      ></span>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/30">
        {label}
      </span>
    </div>
    <span
      className={`font-headline font-black text-2xl ${valueColor} italic tracking-tight`}
    >
      {value}
    </span>
  </div>
);

const BrandLegendItem = ({ color, label, percentage }) => (
  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest group cursor-pointer">
    <div
      className="w-2.5 h-2.5 rounded-[1px] shadow-sm transition-transform group-hover:scale-125"
      style={{ backgroundColor: color }}
    ></div>
    <span className="flex-1 text-on-surface/40 group-hover:text-white transition-colors">
      {label}
    </span>
    <span className="font-mono text-on-surface/40 group-hover:text-primary-container tabular-nums transition-colors">
      {percentage}
    </span>
  </div>
);

const PipelineSegment = ({ color, percentage, label }) => (
  <div
    className={`h-full ${color} flex items-center justify-center text-[9px] font-black text-black/60 uppercase tracking-widest transition-all hover:brightness-110 cursor-pointer border-r border-black/10`}
    style={{ width: percentage }}
  >
    {label}
  </div>
);

const StatusCard = ({ border, label, count }) => (
  <div
    className={`p-5 bg-white/[0.01] rounded-[2px] border-l-[3px] ${border} group hover:bg-white/[0.03] transition-all cursor-pointer`}
  >
    <span className="block text-[9px] font-black text-on-surface/20 uppercase tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">
      {label}
    </span>
    <span className="text-3xl font-headline font-black text-white italic tracking-tighter">
      {count}{" "}
      <span className="text-[10px] opacity-20 group-hover:opacity-40 tabular-nums ml-1 NOT-ITALIC">
        UNITS
      </span>
    </span>
  </div>
);

const HeatBox = ({ opacity }) => (
  <div
    className="w-2.5 h-2.5 bg-primary-container rounded-sm shadow-sm"
    style={{ opacity }}
  ></div>
);
