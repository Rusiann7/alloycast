"use client";

import React, { useState } from "react";

export default function AdminExport() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const exportHistory = [
    {
      name: "Inv_Audit_Aug24.pdf",
      size: "14.2 MB",
      time: "2m ago",
      status: "Ready",
      type: "pdf",
      color: "text-[#4CAF50]",
    },
    {
      name: "Rev_Summary_Q2.xlsx",
      size: "3.1 MB",
      time: "45m ago",
      status: "Expired",
      type: "excel",
      color: "text-primary-container",
    },
    {
      name: "Res_Log_Week32.pdf",
      size: "8.8 MB",
      time: "3h ago",
      status: "Failed",
      type: "pdf",
      color: "text-[#4CAF50]",
    },
    {
      name: "Stock_Valuation_Full.xlsx",
      size: "22.4 MB",
      time: "Yesterday",
      status: "Ready",
      type: "excel",
      color: "text-primary-container",
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
          <h1 className="text-lg font-black font-headline uppercase leading-none italic">
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
            href="/admin/analytics"
          />
          <SidebarLink icon="group" label="CUSTOMERS" href="/admin/customers" />
          <SidebarLink
            icon="ios_share"
            label="EXPORT"
            active
            href="/admin/export"
          />
        </nav>

        <div className="px-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-4 px-4 py-2 bg-white/[0.02] rounded-[4px] border border-white/5 group">
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
            Export Center
          </h2>
          <span className="bg-primary-container/20 text-primary-container px-3 py-1 rounded-[2px] text-[10px] font-black border border-primary-container/30 uppercase tracking-widest leading-none">
            SYSTEM SERVICES
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm group-focus-within:text-primary-container transition-colors">
              search
            </span>
            <input
              className="bg-[#2a2a2a]/50 border border-white/5 text-[10px] font-headline font-black uppercase tracking-[0.1em] pl-11 pr-4 py-2.5 w-72 focus:ring-1 focus:ring-primary-container/40 rounded-[2px] outline-none transition-all placeholder:opacity-10"
              placeholder="SEARCH FILES OR LOGS..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-5">
            <NavIcon icon="notifications" badge />
            <NavIcon icon="settings" />
            <div className="size-8 rounded bg-surface-container-highest border border-white/5 flex items-center justify-center font-mono text-[10px] font-black text-primary-container tracking-tighter italic">
              ADM
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="lg:ml-64 pt-24 lg:pt-16 min-h-screen flex flex-col">
        <div className="flex-1 p-10 lg:p-14 max-w-[1440px] mx-auto w-full">
          {/* Header Section */}
          <div className="mb-14 reveal-up">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="material-symbols-outlined text-primary-container font-fill"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                download
              </span>
              <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase font-headline">
                System Services
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black font-headline uppercase leading-none italic tracking-tighter">
              Data Export Center
            </h1>
            <p className="text-white/40 mt-6 max-w-2xl border-l-2 border-primary-container pl-6 text-sm lg:text-base leading-relaxed">
              Generate machine-readable reports for inventory audit, booking
              schedules, and financial projections. All exports are logged for
              compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-12 items-start">
            {/* Export Config Column */}
            <section className="space-y-8">
              {/* Inventory Report */}
              <ExportCard
                icon="table_chart"
                title="Inventory Report"
                desc="Full breakdown of chassis, scale, and mint condition metrics."
                accentColor="bg-primary-container"
              >
                <div className="space-y-4 mb-10">
                  <ToggleSwtich label="Include Inactive Stock" />
                  <ToggleSwtich label="Limited Edition Audit Only" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ExportButton label="Export PDF" icon="description" outline />
                  <ExportButton label="Export Excel" icon="grid_on" />
                </div>
              </ExportCard>

              {/* Reservations Report */}
              <ExportCard
                icon="format_list_bulleted"
                title="Reservations Report"
                desc="Client booking history and upcoming track schedules."
              >
                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] font-headline">
                      From Date
                    </label>
                    <input
                      className="w-full bg-[#1c1b1b] border-2 border-white/5 focus:border-primary-container/40 text-on-surface font-mono p-4 rounded-[1px] text-[10px] outline-none transition-all uppercase"
                      type="date"
                      defaultValue="2026-03-01"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] font-headline">
                      To Date
                    </label>
                    <input
                      className="w-full bg-[#1c1b1b] border-2 border-white/5 focus:border-primary-container/40 text-on-surface font-mono p-4 rounded-[1px] text-[10px] outline-none transition-all uppercase"
                      type="date"
                      defaultValue="2026-03-31"
                    />
                  </div>
                </div>
                <div className="mb-10">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] font-headline mb-4 block">
                    Filter by Status
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <StatusCheckbox label="Pending" checked />
                    <StatusCheckbox label="Confirmed" checked />
                    <StatusCheckbox label="Canceled" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ExportButton label="PDF Report" outline />
                  <ExportButton label="Excel Sheet" />
                </div>
              </ExportCard>

              {/* Revenue Summary */}
              <ExportCard
                icon="trending_up"
                title="Revenue Summary"
                desc="Quarterly growth analysis and ROI tracking per SKU."
              >
                <div className="mb-8 space-y-2">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] font-headline">
                    Select Period
                  </label>
                  <select className="w-full bg-[#1c1b1b] border-2 border-white/5 focus:border-primary-container/40 text-on-surface font-headline p-4 rounded-[1px] text-[10px] font-black uppercase tracking-widest outline-none transition-all appearance-none">
                    <option>Current Quarter (Q3 2026)</option>
                    <option>Previous Quarter (Q2 2026)</option>
                    <option>Full Fiscal Year 2026</option>
                    <option>Lifetime Data</option>
                  </select>
                </div>
                <div className="bg-secondary-container/5 border-l-4 border-secondary-container p-5 mb-10 reveal-up">
                  <div className="flex gap-4">
                    <span
                      className="material-symbols-outlined text-secondary-container text-base font-fill"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      info
                    </span>
                    <p className="text-[10px] text-secondary-container/80 font-bold leading-relaxed uppercase tracking-tight">
                      Financial estimates are based on current market value and
                      exchange rates. Final reconciliation should be performed
                      via the Treasury panel.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ExportButton label="PDF Summary" outline />
                  <ExportButton label="Excel Data" />
                </div>
              </ExportCard>
            </section>

            {/* History Sidebar */}
            <aside className="reveal-up" style={{ animationDelay: "0.2s" }}>
              <div className="sticky top-24 bg-[#111111] border-2 border-[#2a2a2a] p-10 rounded-[2px]">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="font-headline font-black text-xl uppercase tracking-wider italic">
                    Export History
                  </h3>
                  <span className="bg-white/5 text-[9px] font-mono px-3 py-1.5 rounded-[1px] border border-white/10 uppercase text-white/30 font-black tabular-nums">
                    LAST 20 SESSIONS
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {exportHistory.map((item, i) => (
                    <HistoryItem key={i} item={item} />
                  ))}
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 text-center">
                  <button className="text-[10px] font-black font-headline uppercase tracking-[0.3em] text-white/20 hover:text-primary-container hover:tracking-[0.4em] transition-all duration-500 underline decoration-2 underline-offset-8">
                    Load Older Exports
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/5 bg-[#0e0e0e] p-10 italic">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] font-black">
                ©2026 MACHINA CONTROL INDUSTRIAL INTERFACE
              </p>
              <div className="h-4 w-px bg-white/10 hidden md:block"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container underline decoration-2 underline-offset-4">
                System Version 2.4.9-Stable
              </p>
            </div>
            <div className="flex items-center gap-8">
              <FooterLink label="Security Protocol" />
              <FooterLink label="API Docs" />
              <FooterLink label="Compliance" />
            </div>
          </div>
        </footer>
      </main>

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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c8102e;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.2;
          cursor: pointer;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
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

const ExportCard = ({ icon, title, desc, children }) => (
  <div className="bg-[#161616] border-2 border-[#2a2a2a] p-10 rounded-[2px] relative overflow-hidden group reveal-up">
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-container/5 rounded-full blur-3xl group-hover:bg-primary-container/10 transition-all duration-700" />
    <div className="flex items-start gap-8 mb-10">
      <div className="p-4 bg-[#1c1b1b] rounded-[1px] border border-white/5 shadow-xl group-hover:border-primary-container/30 transition-all">
        <span className="material-symbols-outlined text-secondary-container text-3xl font-light">
          {icon}
        </span>
      </div>
      <div>
        <h3 className="font-headline font-black text-2xl uppercase tracking-tighter italic mb-2 group-hover:text-primary-container transition-colors">
          {title}
        </h3>
        <p className="text-[11px] font-black uppercase text-white/20 tracking-wider font-headline">
          {desc}
        </p>
      </div>
    </div>
    {children}
  </div>
);

const ToggleSwtich = ({ label }) => (
  <div className="flex items-center justify-between p-4 bg-[#1c1b1b] rounded-[1px] border border-white/[0.03] group hover:border-white/10 transition-all">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">
      {label}
    </label>
    <div className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" />
      <div className="w-11 h-6 bg-white/5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container peer-checked:after:bg-white"></div>
    </div>
  </div>
);

const StatusCheckbox = ({ label, checked }) => (
  <label className="flex items-center gap-3 p-3 bg-[#1c1b1b] border border-white/5 rounded-[1px] cursor-pointer hover:bg-white/5 transition-all group">
    <input
      type="checkbox"
      defaultChecked={checked}
      className="w-4 h-4 bg-black border-2 border-white/10 text-primary-container rounded-[1px] focus:ring-0 peer cursor-pointer"
    />
    <span className="text-[9px] font-black uppercase tracking-widest text-white/30 peer-checked:text-white group-hover:text-white transition-all">
      {label}
    </span>
  </label>
);

const ExportButton = ({ label, icon, outline }) => (
  <button
    className={`py-4 px-6 font-black font-headline uppercase text-[10px] tracking-[0.2em] italic flex items-center justify-center gap-3 transition-all transform active:scale-95 duration-100 ${
      outline
        ? "bg-white/5 hover:bg-white/10 text-white border-b-4 border-white/10"
        : "bg-primary-container hover:brightness-110 text-white border-b-4 border-on-primary-fixed shadow-lg shadow-primary-container/20"
    }`}
  >
    {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
    {label}
  </button>
);

const HistoryItem = ({ item }) => (
  <div className="bg-[#1c1b1b]/50 border-2 border-white/[0.03] p-5 rounded-[1px] flex items-center justify-between group hover:bg-[#222121] hover:border-white/10 transition-all duration-300">
    <div className="flex items-center gap-5">
      <div
        className={`${item.color} transition-transform group-hover:scale-110`}
      >
        <span
          className="material-symbols-outlined text-2xl font-fill"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {item.type === "pdf" ? "description" : "grid_on"}
        </span>
      </div>
      <div>
        <p className="text-xs font-black font-headline uppercase leading-none mb-2 italic tracking-tight group-hover:text-primary-container transition-colors">
          {item.name}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-white/20 tabular-nums">
            {item.size}
          </span>
          <span className="text-[9px] font-mono text-white/10">•</span>
          <span className="text-[9px] font-mono text-white/20 tabular-nums uppercase">
            {item.time}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span
        className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-[1px] border ${
          item.status === "Ready"
            ? "bg-secondary-container/10 text-secondary-container border-secondary-container/20"
            : item.status === "Expired"
              ? "bg-white/5 text-white/20 border-white/5"
              : "bg-primary-container/10 text-primary-container border-primary-container/20"
        }`}
      >
        {item.status}
      </span>
      <button
        className={`w-9 h-9 flex items-center justify-center rounded-[1px] transition-all ${
          item.status === "Ready"
            ? "bg-primary-container text-white hover:brightness-125"
            : item.status === "Failed"
              ? "bg-white/5 text-white/60 hover:text-white"
              : "bg-white/5 text-white/10 cursor-not-allowed"
        }`}
      >
        <span className="material-symbols-outlined text-sm">
          {item.status === "Failed"
            ? "refresh"
            : item.status === "Expired"
              ? "block"
              : "download"}
        </span>
      </button>
    </div>
  </div>
);

const FooterLink = ({ label }) => (
  <a className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary-container transition-colors cursor-pointer decoration-2 decoration-transparent hover:decoration-primary-container underline underline-offset-4">
    {label}
  </a>
);
