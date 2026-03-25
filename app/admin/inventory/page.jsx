"use client";

import React, { useState } from "react";

export default function AdminInventory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Sample Inventory Data
  const inventory = [
    {
      id: "1",
      name: "Ferrari F40 Competizione",
      sku: "DF-F40-18-01",
      brand: "Bburago",
      series: "Signature Series",
      price: "4850",
      stock: 12,
      scale: "1:18",
      status: "Active",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ4E21lXBurIS_TWCdfOL3rkgZAV8Q_HCvzGktxGs6jRWCzAQMeGTr4aj1eVjl7l_mB8x6M2Ol4jKJk-7ubei34idebYwVoKaf9ZBwpGO7p7nKtweGTsDREJ2RsyqvdHR-Au6iXtJiQXGnXYTXol45bJ4VSK4GPXoup5TXjGLOBiSOsgQhOlmSHBe6XdfpNEqDWUvR7Ay1pcCnaFvM0ZNZ1QULJhZ5As6xOuafgQ3rUICZETKcs1ng_zOfulAipRuvNB1QV7I49hc",
    },
    {
      id: "2",
      name: "Ford Mustang GT 1967",
      sku: "MA-MST-67-B",
      brand: "Maisto",
      series: "Special Edition",
      price: "2450",
      stock: 24,
      scale: "1:24",
      status: "Active",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvnfL0yv-UW2-T7Nabl5WAx9WDhSchBQ2ju9m-HEbEtdIHPDi0Q14U_hR6h0UUvMVeweWdCwTJYKytE9v64ihc0LiP-p5GR-O1ByWLsK3OeAbx-BQ_mwbV8ZJ_q-5E9PQ0tVaBiVbQMbu1rjSMn_7c-9K9o18eA5dkGCUfU2Tmj0Wn_fcGyop9Fb5x8Zn5LirHCBQONOUhSjZ9vcNlKxp775T1Jco_QQ2EpMwEJrdAy5NMQzMm--BnYHOF-I7lEIWlFxqzM5_FYUw",
    },
    {
      id: "3",
      name: "Porsche 911 GT3 RS",
      sku: "GT-P911-22-O",
      brand: "GT Spirit",
      series: "Resin Collection",
      price: "6800",
      stock: 0,
      scale: "1:18",
      status: "Inactive",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaQJvoMAucdYmdAY1MkbvHWsUYYf0TTpqG52izUkcXXZj3E8exiAsky5Bqlza1l101KvZAfbsYe3ztUDaTOuW9sudFSrI_4V-MBhmaKB5amnxNRYQU9cRzKSpHXyaaFy4vZIBOKnxRe-ql3rdHcHA64AYdm5ZbxfUXiPnU95V5sZ_JOeFdL0PQaoi5_6m-Uq8OboqcCKShkkuPX1G2y_2_3nTyvgM1e2KmtkLwmSm1_8rMJO9yMIxDCebPsqiK7Z2crfc7bet-rLU",
    },
  ];

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleEditClick = (item) => {
    setActiveItem(item);
    setIsEditDrawerOpen(true);
  };

  return (
    <div className="bg-[#0A0A0A] text-[#e5e2e1] min-h-screen font-body relative overflow-hidden select-none">
      {/* Mobile Top Bar */}
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
        className={`fixed top-0 left-0 h-full w-64 z-[70] bg-[#111111] flex flex-col pt-12 pb-6 transition-transform duration-500 ease-in-out border-r border-white/[0.03] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-10 mb-16">
          <h1 className="text-2xl font-black text-[#e5e2e1] font-headline uppercase leading-[0.8] tracking-tighter italic">
            ETHAN MARCUS
          </h1>
          <p className="font-headline uppercase text-[9px] font-black tracking-[0.3em] text-[#C8102E] mt-2 opacity-80">
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
            active
            href="/admin/inventory"
          />
          <SidebarLink
            icon="calendar_today"
            label="RESERVATIONS"
            href="/admin/reservations"
          />
          <SidebarLink icon="group" label="CUSTOMERS" href="/admin/customers" />
          <SidebarLink icon="ios_share" label="EXPORT" href="/admin/export" />
        </nav>

        <div className="px-8 pt-8 border-t border-white/[0.03] mt-auto">
          <div className="flex items-center space-x-4 p-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-white/5 group hover:border-primary-container/40 transition-colors">
              <img
                src="https://i.pravatar.cc/150?u=ethan"
                alt="Admin"
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black font-headline uppercase text-white truncate">
                MARCUS E.
              </p>
              <p className="text-[8px] font-headline text-[#C8102E] font-bold uppercase tracking-[0.15em] whitespace-nowrap">
                SUPER ADMIN
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="lg:pl-64 pt-20 lg:pt-0 min-h-screen">
        {/* Top Breadcrumb / Search Overlay */}
        <header className="px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10 animate-fade-in">
          <div className="flex items-center space-x-6">
            <div className="flex flex-col">
              <h2 className="text-[10px] font-black font-headline uppercase tracking-[0.4em] text-white">
                DASHBOARD
              </h2>
              <div className="h-0.5 w-6 bg-primary-container mt-1" />
            </div>
            <div className="flex items-center bg-surface-container-high/30 border border-white/[0.03] px-5 h-11 rounded-[2px] w-80 backdrop-blur-md">
              <span className="material-symbols-outlined text-sm opacity-20">
                search
              </span>
              <input
                type="text"
                placeholder="QUICK SEARCH MODELS..."
                className="bg-transparent border-none outline-none text-[10px] font-headline font-bold uppercase tracking-widest w-full ml-4 placeholder:opacity-20 text-white"
              />
            </div>
          </div>
        </header>

        <div className="px-10 pb-40">
          {/* Section Header */}
          <div className="mb-14 reveal-up">
            <h3 className="text-6xl font-black font-headline uppercase tracking-tighter mb-3 italic">
              INVENTORY
            </h3>
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-headline font-bold uppercase tracking-[0.25em] text-white/40">
                TOTAL STOCK: <span className="text-white">1,248</span> UNITS
              </p>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <p className="text-[11px] font-headline font-bold uppercase tracking-[0.25em] text-white/40">
                ACTIVE LISTINGS:{" "}
                <span className="text-primary-container">84</span>
              </p>
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div
            className="bg-[#111111] border border-white/[0.03] p-5 rounded-[2px] mb-10 flex items-center gap-5 reveal-up shadow-xl"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex-1 flex items-center gap-5 bg-black/40 border border-white/[0.02] px-6 h-14 rounded-[2px]">
              <span className="material-symbols-outlined text-on-surface/20 text-xl font-light">
                search
              </span>
              <input
                type="text"
                placeholder="FILTER BY BRAND, SCALE, OR SKU..."
                className="bg-transparent border-none outline-none text-xs font-headline font-bold uppercase tracking-[0.1em] w-full placeholder:opacity-10 text-white"
              />
            </div>
          </div>

          {/* Inventory Table */}
          <div
            className="bg-[#111111]/40 border border-white/[0.03] rounded-[2px] overflow-hidden reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.03] bg-[#131313]">
                  <th className="px-8 py-5 w-16 text-center">
                    <Checkbox
                      checked={
                        selectedItems.length === inventory.length &&
                        inventory.length > 0
                      }
                      onChange={() => {
                        if (selectedItems.length === inventory.length)
                          setSelectedItems([]);
                        else setSelectedItems(inventory.map((i) => i.id));
                      }}
                    />
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black font-headline uppercase tracking-[0.3em] text-white/30">
                    MEDIA
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black font-headline uppercase tracking-[0.3em] text-white/30">
                    PRODUCT NAME
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black font-headline uppercase tracking-[0.3em] text-white/30">
                    BRAND
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black font-headline uppercase tracking-[0.3em] text-white/30">
                    SERIES
                  </th>
                  <th className="px-10 py-5 text-center">
                    <span className="material-symbols-outlined text-sm opacity-10">
                      more_horiz
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {inventory.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-white/[0.01] transition-all duration-300 cursor-pointer"
                    onClick={() => handleEditClick(item)}
                  >
                    <td
                      className="px-8 py-5 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>
                    <td className="px-8 py-5">
                      <div className="w-16 h-10 bg-black/40 rounded-[2px] overflow-hidden border border-white/5 group-hover:border-primary-container/30 transition-all duration-500">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                        />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[11px] font-black font-headline uppercase tracking-tight group-hover:text-primary-container transition-colors duration-300">
                        {item.name}
                      </p>
                      <p className="text-[8px] font-mono uppercase opacity-20 mt-1 tabular-nums">
                        SKU: {item.sku}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-2.5 py-1 rounded-[1px] text-[8px] font-black uppercase tracking-[0.1em] ${
                          item.brand === "Bburago"
                            ? "bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/30"
                            : item.brand === "Maisto"
                              ? "bg-[#0051A8]/20 text-[#4285F4] border border-[#0051A8]/30"
                              : "bg-surface-container-highest/20 text-white/40 border border-white/10"
                        }`}
                      >
                        {item.brand}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] opacity-30 group-hover:opacity-60 transition-opacity">
                        {item.series}
                      </p>
                    </td>
                    <td className="px-10 py-5 text-center">
                      <button className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 group-hover:text-primary-container transition-all">
                        edit_note
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- Bulk Action Bar --- */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-10 left-[calc(50%+128px)] -translate-x-1/2 z-[80] bg-[#161616] border border-white/10 rounded-[2px] px-10 py-5 flex items-center gap-16 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] animate-slide-in-up backdrop-blur-xl">
          <div className="flex items-center gap-5 border-r border-white/5 pr-12">
            <span className="text-3xl font-headline italic font-black text-primary-container leading-none tabular-nums">
              {selectedItems.length.toString().padStart(2, "0")}
            </span>
            <div className="flex flex-col">
              <p className="text-[10px] font-black font-headline uppercase tracking-[0.2em] leading-none">
                ITEMS
              </p>
              <p className="text-[10px] font-black font-headline uppercase tracking-[0.2em] opacity-20 mt-1 leading-none">
                SELECTED
              </p>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <button className="flex items-center gap-4 group">
              <span className="material-symbols-outlined text-2xl opacity-20 group-hover:text-white transition-all transform group-hover:scale-110">
                block
              </span>
              <span className="text-[10px] font-black font-headline uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                SET INACTIVE
              </span>
            </button>
            <button className="flex items-center gap-4 group">
              <span className="material-symbols-outlined text-2xl opacity-20 group-hover:text-[#C8102E] transition-all transform group-hover:scale-110">
                delete
              </span>
              <span className="text-[10px] font-black font-headline uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                DELETE
              </span>
            </button>
          </div>
        </div>
      )}

      {/* --- Edit Model Drawer --- */}
      {isEditDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] animate-fade-in"
            onClick={() => setIsEditDrawerOpen(false)}
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#0F0F0F] z-[100] border-l border-white/[0.05] shadow-[0_0_100px_rgba(0,0,0,1)] animate-slide-in-right flex flex-col">
            <header className="p-10 border-b border-white/[0.03] flex items-center justify-between">
              <h4 className="text-3xl font-black font-headline uppercase tracking-tighter italic leading-none">
                EDIT MODEL
              </h4>
              <button
                onClick={() => setIsEditDrawerOpen(false)}
                className="w-10 h-10 flex items-center justify-center border border-white/5 hover:bg-white/5 transition-colors rounded-[2px] group"
              >
                <span className="material-symbols-outlined opacity-40 group-hover:opacity-100 group-hover:rotate-90 transition-all text-xl font-light">
                  close
                </span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="space-y-3">
                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                  PRODUCT NAME
                </label>
                <input
                  type="text"
                  defaultValue={activeItem?.name}
                  className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                    BRAND
                  </label>
                  <div className="relative">
                    <select className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest appearance-none outline-none focus:border-primary-container transition-all text-white">
                      <option>{activeItem?.brand}</option>
                      <option>Bburago</option>
                      <option>Maisto</option>
                      <option>AutoArt</option>
                      <option>GT Spirit</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-xl font-light">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                    SCALE
                  </label>
                  <div className="relative">
                    <select className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest appearance-none outline-none focus:border-primary-container transition-all text-white">
                      <option>{activeItem?.scale}</option>
                      <option>1:18</option>
                      <option>1:24</option>
                      <option>1:43</option>
                      <option>1:64</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-xl font-light">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                    PRICE (₱)
                  </label>
                  <input
                    type="text"
                    defaultValue={activeItem?.price}
                    className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest outline-none focus:border-primary-container transition-all text-white tabular-nums"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                    STOCK
                  </label>
                  <input
                    type="text"
                    defaultValue={activeItem?.stock}
                    className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest outline-none focus:border-primary-container transition-all text-white tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                  MODEL IMAGE
                </label>
                <div className="w-full h-56 bg-black/40 border border-dashed border-white/10 flex flex-col items-center justify-center group cursor-pointer hover:border-primary-container transition-all duration-500 rounded-[2px] relative overflow-hidden">
                  {activeItem?.img && (
                    <img
                      src={activeItem.img}
                      className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl font-light opacity-20 mb-4 group-hover:text-primary-container group-hover:opacity-100 transition-all duration-500">
                      cloud_upload
                    </span>
                    <p className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]">
                      <span className="opacity-20 group-hover:opacity-40 transition-opacity">
                        DRAG & DROP OR
                      </span>{" "}
                      <span className="text-[#C8102E] group-hover:text-primary-container transition-colors">
                        BROWSE
                      </span>
                    </p>
                    <p className="text-[8px] text-white/10 mt-3 uppercase tracking-[0.1em]">
                      High-res PNG/JPG preferred.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/[0.03] flex items-center justify-between">
                <div className="flex flex-col">
                  <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-white/60">
                    ACTIVE LISTING
                  </label>
                  <p className="text-[8px] text-white/10 uppercase tracking-[0.1em] mt-1 italic">
                    Visible to all potential clients
                  </p>
                </div>
                <button
                  className="w-16 h-8 bg-black border border-white/10 rounded-full relative p-1.5 transition-all hover:border-[#C8102E]/40"
                  onClick={(e) => {
                    e.currentTarget.classList.toggle("bg-[#C8102E]");
                    e.currentTarget.firstChild.classList.toggle(
                      "translate-x-8",
                    );
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full transition-transform duration-300 pointer-events-none" />
                </button>
              </div>
            </div>

            <footer className="p-10 border-t border-white/[0.03] grid grid-cols-2 gap-6 bg-black">
              <button
                onClick={() => setIsEditDrawerOpen(false)}
                className="h-16 border border-white/5 rounded-[2px] text-[10px] font-black font-headline uppercase tracking-[0.3em] hover:bg-white/[0.03] transition-all opacity-40 hover:opacity-100"
              >
                DISCARD CHANGES
              </button>
              <button className="h-16 bg-[#C8102E] rounded-[2px] text-[10px] font-black font-headline uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-[#C8102E]/20">
                SAVE PRODUCT
              </button>
            </footer>
          </aside>
        </>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(200, 16, 46, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(200, 16, 46, 0.5);
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
      className={`material-symbols-outlined transition-all text-[20px] font-light ${
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

const Checkbox = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-6 h-6 rounded-[1px] border flex items-center justify-center transition-all duration-300 ${
      checked
        ? "bg-[#C8102E] border-[#C8102E]"
        : "border-white/[0.08] hover:border-white/20 bg-white/[0.02]"
    }`}
  >
    {checked && (
      <span className="material-symbols-outlined text-[16px] text-white font-light">
        done
      </span>
    )}
  </button>
);
