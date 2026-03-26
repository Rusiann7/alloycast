"use client";

import React, { useState } from "react";

export default function AdminCustomers() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Open by default based on request visual
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: "ER",
    name: "Elias Rossi",
    email: "elias.rossi@strada.io",
    phone: "+39 342 901 1022",
    memberSince: "JAN 14, 2023",
    totalOrders: "08",
    lifetimeValue: "₱ 28.5K",
    initials: "ER",
    color: "bg-[#C8102E]",
  });

  const customers = [
    {
      id: "JD",
      name: "Julian Draxler",
      email: "j.draxler@motorsport.de",
      reservations: 14,
      activity: "2 HOURS AGO",
      activityType: "Active Session",
      portfolio: "₱ 42,450.00",
      status: "Active",
      initials: "JD",
      color: "bg-[#2e3b4e]",
      active: false,
    },
    {
      id: "SH",
      name: "Sienna Halloway",
      email: "sienna.h@collection.co",
      reservations: "03",
      activity: "YESTERDAY",
      activityType: "Checkout Abandoned",
      portfolio: "₱ 12,100.00",
      status: "Active",
      initials: "SH",
      color: "bg-[#4e2e2e]",
      active: false,
    },
    {
      id: "MK",
      name: "Marcus Kaine",
      email: "m.kaine@kainecapital.com",
      reservations: 42,
      activity: "3 DAYS AGO",
      activityType: "Order Fulfillment",
      portfolio: "₱ 184,200.00",
      status: "Inactive",
      initials: "MK",
      color: "bg-[#2e4e3b]",
      active: false,
    },
    {
      id: "ER",
      name: "Elias Rossi",
      email: "elias.rossi@strada.io",
      reservations: "08",
      activity: "NOW ACTIVE",
      activityType: "Viewing Details",
      portfolio: "₱ 28,500.00",
      status: "Active",
      initials: "ER",
      color: "bg-[#C8102E]",
      active: true,
    },
  ];

  const handleRowClick = (customer) => {
    setSelectedCustomer({
      ...customer,
      phone: "+39 342 901 1022", // Mocking extra details
      memberSince: "JAN 14, 2023",
      totalOrders: customer.reservations,
      lifetimeValue: "₱ 28.5K",
    });
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-x-hidden selection:bg-primary-container selection:text-white">
      {/* --- Main Content --- */}
      <main
        className={`lg:ml-64 pt-10 lg:pt-10 min-h-screen flex transition-all duration-500 ${isDrawerOpen ? "lg:mr-[450px]" : ""}`}
      >
        {/* Table Section */}
        <section className="flex-1 px-10 overflow-y-auto bg-surface-container-lowest/20">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-10 mb-16 reveal-up">
            <div className="space-y-4">
              <h2 className="text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
                Customers
              </h2>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-primary-container shadow-[0_0_10px_rgba(200,16,46,0.3)]"></span>
                <span className="bg-surface-container-high/60 text-primary-container px-3 py-1 text-[10px] font-mono font-bold border border-white/5 uppercase tracking-widest">
                  128_REGISTERED_USERS
                </span>
              </div>
            </div>
            <div className="relative group lg:w-[450px]">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/20 text-xl group-focus-within:text-primary-container transition-colors">
                search
              </span>
              <input
                className="w-full bg-[#161616] border-2 border-[#2a2a2a] focus:border-primary-container text-xs font-mono py-5 pl-14 pr-6 transition-all placeholder:opacity-10 outline-none uppercase"
                placeholder="SEARCH NAME OR EMAIL..."
                type="text"
              />
            </div>
          </div>

          {/* Customer Table */}
          <div
            className="bg-[#111111]/40 border-2 border-[#2a2a2a] rounded-[2px] overflow-hidden reveal-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#161616] border-b-2 border-[#2a2a2a]">
                    <th className="px-10 py-6 font-headline text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Identity
                    </th>
                    <th className="px-10 py-6 font-headline text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">
                      Reservations
                    </th>
                    <th className="px-10 py-6 font-headline text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Activity
                    </th>
                    <th className="px-10 py-6 font-headline text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">
                      Portfolio Value
                    </th>
                    <th className="px-10 py-6 font-headline text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">
                      Status
                    </th>
                    <th className="px-10 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {customers.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => handleRowClick(c)}
                      className={`group hover:bg-[#1C1B1B] transition-all duration-300 cursor-pointer border-l-4 ${c.id === selectedCustomer.id ? "bg-[#1C1B1B] border-primary-container" : "border-transparent hover:border-primary-container"}`}
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div
                            className={`w-11 h-11 ${c.color} flex items-center justify-center font-headline font-black text-xs text-white border border-white/5 italic shadow-lg`}
                          >
                            {c.initials}
                          </div>
                          <div>
                            <div
                              className={`font-headline font-black text-sm tracking-tight uppercase transition-colors ${c.id === selectedCustomer.id || c.active ? "text-white" : "group-hover:text-primary-container"}`}
                            >
                              {c.name}
                            </div>
                            <div className="font-mono text-[10px] text-white/30 mt-1 tabular-nums italic lowercase">
                              {c.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="font-mono text-xs bg-[#2a2a2a]/60 px-3 py-1.5 rounded-[1px] border border-white/5 tabular-nums">
                          {c.reservations}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div
                          className={`text-[11px] font-black font-headline uppercase leading-none ${c.activity === "NOW ACTIVE" ? "text-secondary-container" : "text-white"}`}
                        >
                          {c.activity}
                        </div>
                        <div className="text-[10px] font-mono text-white/20 uppercase mt-1.5 italic tracking-tighter">
                          {c.activityType}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right font-mono text-secondary-container font-black text-xs tabular-nums">
                        {c.portfolio}
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span
                          className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border ${
                            c.status === "Active"
                              ? "bg-green-900/10 text-green-500 border-green-500/20"
                              : "bg-white/[0.02] text-white/20 border-white/5"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span
                          className={`material-symbols-outlined transition-all ${c.id === selectedCustomer.id ? "text-primary-container" : "text-white/10 group-hover:text-primary-container"}`}
                        >
                          {c.id === selectedCustomer.id
                            ? "arrow_forward_ios"
                            : "chevron_right"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Customer Detail Drawer */}
        {isDrawerOpen && (
          <aside className="fixed top-16 right-0 w-full max-w-[450px] h-[calc(100vh-64px)] bg-[#131313] border-l-2 border-[#2a2a2a] flex flex-col z-[45] animate-slide-in-right">
            {/* Drawer Header */}
            <div className="p-10 border-b-2 border-[#2a2a2a] bg-[#161616]">
              <div className="flex items-start justify-between mb-8">
                <div
                  className={`w-20 h-20 ${selectedCustomer.color} flex items-center justify-center font-headline font-black text-3xl text-white border-2 border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] italic`}
                >
                  {selectedCustomer.initialials || selectedCustomer.initials}
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-12 h-12 flex items-center justify-center border-2 border-white/10 hover:bg-white/5 transition-all group"
                >
                  <span className="material-symbols-outlined opacity-40 group-hover:opacity-100 group-hover:rotate-90 transition-all text-2xl font-light">
                    close
                  </span>
                </button>
              </div>
              <h2 className="text-4xl font-black font-headline uppercase tracking-tighter italic leading-none">
                {selectedCustomer.name}
              </h2>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                  MEMBER SINCE:
                </span>
                <span className="text-[10px] font-mono text-white uppercase font-black tabular-nums">
                  {selectedCustomer.memberSince}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
              {/* Communication Section */}
              <section>
                <h3 className="font-headline font-black text-[10px] uppercase tracking-[0.4em] text-white/30 mb-6 border-l-2 border-primary-container pl-4">
                  Communication
                </h3>
                <div className="space-y-3">
                  <DrawerContactCard
                    label="EMAIL"
                    value={selectedCustomer.email}
                    icon="content_copy"
                  />
                  <DrawerContactCard
                    label="PHONE"
                    value={selectedCustomer.phone}
                    icon="call"
                  />
                </div>
              </section>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-5">
                <div className="p-6 bg-white/[0.01] border-b-4 border-primary-container group hover:bg-white/[0.03] transition-all">
                  <span className="text-[10px] font-mono text-white/20 block mb-3 uppercase tracking-widest">
                    TOTAL ORDERS
                  </span>
                  <span className="text-4xl font-black font-headline tracking-tighter italic tabular-nums">
                    {selectedCustomer.totalOrders}
                  </span>
                </div>
                <div className="p-6 bg-white/[0.01] border-b-4 border-secondary-container group hover:bg-white/[0.03] transition-all">
                  <span className="text-[10px] font-mono text-white/20 block mb-3 uppercase tracking-widest">
                    LIFETIME VALUE
                  </span>
                  <span className="text-2xl font-black font-headline tracking-tighter italic text-secondary-container tabular-nums">
                    {selectedCustomer.lifetimeValue}
                  </span>
                </div>
              </div>

              {/* Reservation Logs */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-headline font-black text-[10px] uppercase tracking-[0.4em] text-white/30 border-l-2 border-primary-container pl-4">
                    Reservation Logs
                  </h3>
                  <button className="text-[10px] font-black text-primary-container hover:underline decoration-2 underline-offset-4 uppercase tracking-widest">
                    VIEW ALL
                  </button>
                </div>
                <div className="space-y-3">
                  <LogItem
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuCFm3n44ExWcljFV1sx-50x7hOa36_SE-Wl-p8n0t3uubSUKajtFMLKe69WnSVNoo6ogO89T6uhNO1Ba4tl1AUbVyNZoQe7FUYbPKG73ESnj-TLPhQHO7LElJ9VylUpHKb382cbuFP4yjXKzEO1Jgr18CQbMDPaNzK7RJziMeQqH0vi5rTVX9amXurPakc7rVywMaW7XpKAJRnp0icpk7iE-JFTD-3Ft3J8Xr-sg8BiKRVtOZJErblc8kTXtoSEnJgERO0hLwgB4Xg"
                    title="Ferrari F40 Competizione"
                    meta="OCT 22, 2023 • SHIPPED"
                    statusColor="bg-green-500"
                  />
                  <LogItem
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuBGqmjtNU4fGdCht_QoMqlPVibJ5HAX3gmQ-BffdwrvxF1vunNE_Hz7eFjLChxEdszhUFqioLdI3W8yWEUeFmviNjcg82iow5lmXekUfe6f_TZTyIniGie1Sf5kUFCFjq0Q4OPOQyn1IgBd0h7tg18Pz4fWbjtJQhtXi7qsNDGBRpWk-JSwYXiIEzPgypbhik8fEmNWqYDn0-_c6kkEwrwhdU9dBAAlWLMEsvOXhEksc0q9bBIfcfog4rrrOn-Q2Y1_yE3as4mzwDE"
                    title="Bugatti Chiron Pur Sport"
                    meta="AUG 12, 2023 • CANCELLED"
                    statusColor="bg-primary-container"
                  />
                </div>
              </section>

              {/* Admin Directives */}
              <section>
                <h3 className="font-headline font-black text-[10px] uppercase tracking-[0.4em] text-white/30 mb-6 border-l-2 border-primary-container pl-4">
                  Internal Directives
                </h3>
                <div className="relative group">
                  <textarea
                    className="w-full bg-[#161616] border-2 border-[#2a2a2a] focus:border-primary-container p-6 text-xs font-medium min-h-[120px] resize-none placeholder:opacity-10 outline-none transition-all font-body text-white/70"
                    placeholder="LOG CUSTOMER INTERACTION..."
                  ></textarea>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-20 group-focus-within:opacity-60 transition-opacity">
                    <span className="material-symbols-outlined text-xs">
                      cloud_done
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em] font-black">
                      AUTOSAVED
                    </span>
                  </div>
                </div>
              </section>

              {/* Footer Actions */}
              <div className="space-y-3 pt-4 pb-10">
                <button className="w-full bg-primary-container hover:brightness-110 text-white font-headline font-black uppercase italic tracking-[0.25em] text-xs py-5 rounded-[1px] transition-all transform active:scale-[0.98] shadow-lg shadow-primary-container/20">
                  SEND RE-ENGAGEMENT EMAIL
                </button>
                <button className="w-full bg-[#1C1B1B] hover:bg-[#2a2a2a] border border-white/5 text-white/40 hover:text-white font-headline font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-[1px] transition-all">
                  FLAG FOR REVIEW
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Global Floating Action Button */}
        <div
          className={`fixed bottom-10 z-50 transition-all duration-500 ${isDrawerOpen ? "right-[490px]" : "right-10"}`}
        >
          <button className="group flex items-center gap-5 bg-secondary-container text-black p-5 rounded-[2px] shadow-[0_20px_50px_rgba(255,219,60,0.3)] hover:bg-white hover:-translate-y-2 transition-all">
            <span className="material-symbols-outlined font-black text-2xl">
              person_add
            </span>
            <span className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 whitespace-nowrap font-headline font-black uppercase text-xs tracking-widest italic">
              Register New Lead
            </span>
          </button>
        </div>
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
        .animate-slide-in-right {
          animation: slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slide-in-right {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
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

const SidebarSmallLink = ({ icon, label }) => (
  <a className="flex items-center gap-4 px-10 py-2.5 opacity-20 hover:opacity-100 hover:bg-white/5 transition-all group cursor-pointer">
    <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">
      {icon}
    </span>
    <span className="text-[9px] font-mono tracking-tighter uppercase">
      {label}
    </span>
  </a>
);

const HeaderNavLink = ({ label, active }) => (
  <button
    className={`px-5 py-2 text-[10px] font-headline font-bold uppercase tracking-widest transition-all rounded-[2px] ${
      active
        ? "text-[#C8102E] bg-white/[0.03]"
        : "text-white/40 hover:text-white hover:bg-white/0.01"
    }`}
  >
    {label}
  </button>
);

const DrawerContactCard = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/[0.05] rounded-[1px] group hover:border-primary-container/40 cursor-pointer transition-all">
    <div className="flex flex-col">
      <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1.5">
        {label}
      </span>
      <span className="text-[11px] font-black font-headline text-white/80 group-hover:text-white transition-colors uppercase italic">
        {value}
      </span>
    </div>
    <span className="material-symbols-outlined text-lg opacity-20 group-hover:opacity-100 group-hover:text-primary-container transition-all">
      {icon}
    </span>
  </div>
);

const LogItem = ({ img, title, meta, statusColor }) => (
  <div className="flex items-center gap-5 p-3 bg-white/[0.01] hover:bg-white/[0.03] transition-all border border-white/[0.03] group cursor-pointer">
    <div className="w-14 h-12 bg-black/40 flex-shrink-0 border border-white/10 overflow-hidden relative">
      <img
        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
        src={img}
        alt=""
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[11px] font-black font-headline truncate uppercase tracking-tight group-hover:text-primary-container transition-colors italic">
        {title}
      </div>
      <div className="text-[9px] font-mono text-white/20 uppercase mt-1 tabular-nums">
        {meta}
      </div>
    </div>
    <div
      className={`w-2 h-2 rounded-full ${statusColor} shadow-[0_0_8px_rgba(0,0,0,0.5)] group-hover:animate-pulse`}
    ></div>
  </div>
);
