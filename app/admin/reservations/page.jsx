"use client";

import React, { useState } from "react";

export default function AdminReservations() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Items");
  const [activeReservation, setActiveReservation] = useState(null);

  const reservations = [
    {
      id: "RES-8820-K",
      customer: "Julian Thorne",
      email: "j.thorne@collector.io",
      model: "Porsche 911 GT3 RS",
      brand: "AUTOART",
      qty: "01",
      date: "2 Hours Ago",
      status: "Pending",
      statusColor:
        "bg-secondary-container/10 text-secondary-container border-secondary-container/20",
      statusDot: "bg-secondary-container",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4Rl2nAenIRwanibZAlksY_LXmxUg640gGWANtomYbgv4wXmu3QdttMrAG7dOU-OYBwh8IarQOZK0e6zMPAHBlX16M_LNVkC5-GUI8Ldm2vKx1ypUc0LlJsLUN78NGYaT6SR2YvgTmCovfpfVlPt2CGpMoOSocZoTC_FK_hIOQDAw-sjHvlH7y46ZbO5uG-M9wYfXa0IERNZU_FbBwUZC2yw-8r_urHeympVFTvHnQvUVbwufHypZE1VXraDuM3YP3-xk11z8NzE0",
    },
    {
      id: "RES-8821-K",
      customer: "Marcus Sterling",
      email: "m.sterling@vault.net",
      model: "Ferrari F40 Competizione",
      brand: "KYOSHO",
      qty: "02",
      date: "Today, 09:14",
      status: "Confirmed",
      statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      statusDot: "bg-blue-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8przAME5P8n5WlkkRKv-DiD0d8L8RlDGkgpHt0Izx2dctiAsFXgUTqZNDUcpisyDJOTGfSmW5l_DRnMdBYmd2VcmXVBrqQUXRyNWLIyPbWBCP7i_JLI-OTn3Ty62tV01Fw5iGWlLKgLU3qE75oc-X6Le1gvPAdDtucPdQzhOBUyPT5N3zI2bMD_cB32IswADCquEl3boZuMxJHiNd0n9dtqujJAXAfUvFZYbZt4wVW2DlWjYs9_g2PQ9yKKqsvuOrXeTAGOdk1P8",
    },
    {
      id: "RES-8822-K",
      customer: "Elena Rossi",
      email: "e.rossi@milano.it",
      model: "Lambo Countach LP500S",
      brand: "HOT WHEELS RLC",
      qty: "01",
      date: "Yesterday",
      status: "Ready",
      statusColor: "bg-green-500/10 text-green-400 border-green-500/20",
      statusDot: "bg-green-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRnlXTFevWjcMaHUhT4pXS7RRsz0k27Jmfol1vmJPctEB7S0JPNdtFaydjd7RADfzohTxtVGUYSUjQ-R4cm_9DtlfBLz5a2DSVOd2Wxx3yklqtVTvotLBEK0POqyR-DI6IYRXszuP2j6uIu3Sk5JhuCCNevnD-FyIr6oybLAQRlA673ojdflHEVam819Azz3Cof6hd0nGJPLt_z6RSJISIDBrD0_8zC4kfB4tt_JJ7kf1ddL8WFyuRFEy9IJWyV69Ed8fClOUhr5o",
    },
  ];

  const handleRowClick = (res) => {
    setActiveReservation(res);
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-x-hidden selection:bg-primary-container selection:text-white">
      {/* --- Main Content --- */}
      <main
        className={`lg:ml-64 pt-24 lg:pt-10 px-10 pb-12 transition-all duration-500 ${isDrawerOpen ? "lg:mr-[450px]" : ""}`}
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 reveal-up">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-6xl font-black font-headline tracking-tighter uppercase italic">
                Reservations
              </h2>
              <span className="bg-primary-container text-white px-3 py-1 text-[10px] font-black font-headline uppercase tracking-widest rounded-[2px] shadow-lg shadow-primary-container/20">
                128 TOTAL
              </span>
            </div>
            <p className="text-on-surface/40 text-sm font-body italic">
              Processing incoming requests for the Q4 collection cycle.
            </p>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-3 bg-surface-container-high/40 px-6 py-3 border border-white/5 font-headline font-bold text-[10px] uppercase tracking-widest hover:bg-surface-container-highest transition-all rounded-[2px] group relative overflow-hidden">
              <span className="material-symbols-outlined text-lg opacity-40">
                download
              </span>
              <span>Export Data</span>
              <span className="material-symbols-outlined text-lg opacity-40 group-hover:rotate-180 transition-transform">
                expand_more
              </span>
            </button>
            {/* Dropdown Logic would go here */}
          </div>
        </div>

        {/* Status Tabs */}
        <div
          className="flex items-center gap-10 border-b border-white/5 mb-10 overflow-x-auto scrollbar-hide reveal-up"
          style={{ animationDelay: "0.1s" }}
        >
          {[
            "All Items",
            "Pending",
            "Confirmed",
            "Ready for Pickup",
            "Cancelled",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-5 text-[10px] font-headline font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative ${
                activeTab === tab
                  ? "text-primary-container"
                  : "text-on-surface/30 hover:text-white"
              }`}
            >
              {tab}
              {tab === "Pending" && (
                <span className="ml-2 w-2 h-2 rounded-full bg-secondary-container inline-block" />
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-container animate-scale-in" />
              )}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 reveal-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="md:col-span-2 bg-[#161616] p-1 rounded-[2px] border border-white/5 flex items-center group focus-within:border-primary-container/40 transition-colors">
            <span className="material-symbols-outlined px-5 text-on-surface/20 group-hover:text-primary-container transition-colors">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-xs font-headline font-bold uppercase tracking-widest w-full py-4 text-white placeholder:opacity-10"
              placeholder="Search customer, SKU, or model name..."
              type="text"
            />
          </div>
          <div className="bg-[#161616] p-1 rounded-[2px] border border-white/5 flex items-center relative group">
            <span className="material-symbols-outlined px-5 text-on-surface/20">
              calendar_month
            </span>
            <select className="bg-transparent border-none focus:ring-0 text-[10px] font-headline font-black uppercase tracking-widest w-full py-4 appearance-none text-white/60">
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>Custom Range</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 text-on-surface/10 pointer-events-none">
              expand_more
            </span>
          </div>
          <div className="bg-[#161616] p-1 rounded-[2px] border border-white/5 flex items-center relative group">
            <span className="material-symbols-outlined px-5 text-on-surface/20">
              filter_list
            </span>
            <select className="bg-transparent border-none focus:ring-0 text-[10px] font-headline font-black uppercase tracking-widest w-full py-4 appearance-none text-white/60">
              <option>All Brands</option>
              <option>Hot Wheels</option>
              <option>AutoArt</option>
              <option>Kyosho</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 text-on-surface/10 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Reservations Table */}
        <div
          className="bg-[#111111]/40 border border-white/[0.03] rounded-[2px] overflow-hidden reveal-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#131313] border-b border-white/[0.03]">
                  <th className="p-6 w-16 text-center">
                    <Checkbox />
                  </th>
                  <th className="p-6 font-headline text-[10px] font-black tracking-[0.3em] uppercase text-white/30">
                    Customer Details
                  </th>
                  <th className="p-6 font-headline text-[10px] font-black tracking-[0.3em] uppercase text-white/30">
                    Product Model
                  </th>
                  <th className="p-6 font-headline text-[10px] font-black tracking-[0.3em] uppercase text-white/30 text-center">
                    Qty
                  </th>
                  <th className="p-6 font-headline text-[10px] font-black tracking-[0.3em] uppercase text-white/30">
                    Date Reserved
                  </th>
                  <th className="p-6 font-headline text-[10px] font-black tracking-[0.3em] uppercase text-white/30">
                    Status
                  </th>
                  <th className="p-6 font-headline text-[10px] font-black tracking-[0.3em] uppercase text-white/30 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {reservations.map((res) => (
                  <tr
                    key={res.id}
                    className={`group hover:bg-white/[0.01] transition-all duration-300 cursor-pointer ${activeReservation?.id === res.id ? "bg-primary-container/[0.03] border-l-4 border-l-primary-container" : "border-l-4 border-l-transparent"}`}
                    onClick={() => handleRowClick(res)}
                  >
                    <td
                      className="p-6 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox />
                    </td>
                    <td className="p-6">
                      <p className="font-headline font-black text-sm tracking-tight uppercase group-hover:text-primary-container transition-colors">
                        {res.customer}
                      </p>
                      <p className="font-body text-[10px] text-white/30 mt-1 tabular-nums italic">
                        {res.email}
                      </p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 bg-black/40 rounded-[1px] overflow-hidden border border-white/5 relative group-hover:border-primary-container/30 transition-all duration-500">
                          <img
                            src={res.img}
                            alt={res.model}
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                          />
                        </div>
                        <div>
                          <p className="font-headline font-bold text-xs tracking-tight uppercase">
                            {res.model}
                          </p>
                          <span className="inline-block px-2 py-0.5 bg-white/[0.03] text-[8px] font-black border border-white/[0.05] text-white/40 mt-1.5 uppercase tracking-widest">
                            {res.brand}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center font-black text-xs tabular-nums opacity-60 group-hover:opacity-100 transition-opacity">
                      {res.qty}
                    </td>
                    <td className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors uppercase">
                      {res.date}
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 ${res.statusColor} text-[9px] font-black uppercase tracking-widest rounded-[1px] border`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${res.statusDot} animate-pulse`}
                        ></span>
                        {res.status}
                      </span>
                    </td>
                    <td
                      className="p-6 text-right space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="w-9 h-9 flex items-center justify-center hover:bg-white/[0.03] transition-colors rounded-[2px] group/btn">
                        <span className="material-symbols-outlined text-lg opacity-20 group-hover/btn:opacity-100 transition-opacity">
                          visibility
                        </span>
                      </button>
                      <button
                        className="w-9 h-9 flex items-center justify-center hover:bg-primary-container/10 transition-colors rounded-[2px] text-primary-container group/btn"
                        onClick={() => setIsEmailModalOpen(true)}
                      >
                        <span className="material-symbols-outlined text-lg opacity-40 group-hover/btn:opacity-100 transition-opacity">
                          mail
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-8 bg-[#131313]/50 border-t border-white/[0.03]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              Showing 3 of 128 items
            </p>
            <div className="flex items-center gap-3">
              <PaginationButton icon="chevron_left" disabled />
              <PaginationButton label="1" active />
              <PaginationButton label="2" />
              <PaginationButton label="3" />
              <PaginationButton icon="chevron_right" />
            </div>
          </div>
        </div>
      </main>

      {/* --- Details Drawer --- */}
      {isDrawerOpen && (
        <aside className="fixed top-0 right-0 w-full max-w-[450px] h-screen bg-[#0F0F0F] z-[100] border-l border-white/[0.05] flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] animate-slide-in-right">
          <div className="p-10 border-b border-white/[0.03] flex justify-between items-center bg-[#131313]">
            <div>
              <h3 className="font-headline font-black text-3xl tracking-tighter uppercase italic leading-none">
                #7729
              </h3>
              <p className="text-[10px] font-black text-[#C8102E] tracking-[0.3em] uppercase mt-2">
                ID: RES-8820-K
              </p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-12 h-12 flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors rounded-[2px] group"
            >
              <span className="material-symbols-outlined opacity-40 group-hover:opacity-100 group-hover:rotate-90 transition-all text-2xl font-light">
                close
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            {/* Summary Card */}
            <div className="bg-surface-container-high/40 p-6 rounded-[2px] border-l-[3px] border-secondary-container relative group overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-container">
                  STATUS: PENDING VERIFICATION
                </span>
                <button className="text-primary-container font-headline text-[10px] font-black uppercase tracking-widest hover:underline underline-offset-4">
                  EDIT STATUS
                </button>
              </div>
              <div className="flex gap-6 relative z-10">
                <div className="w-24 h-24 bg-black/40 border border-white/5 rounded-[1px] overflow-hidden">
                  <img
                    src={activeReservation?.img}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                    alt=""
                  />
                </div>
                <div>
                  <p className="font-headline font-black text-lg uppercase leading-tight mb-2 italic">
                    Porsche 911 GT3 RS (992)
                  </p>
                  <p className="text-[10px] font-medium text-white/40 mb-4 uppercase tracking-widest">
                    Scale: 1:18 • Finish: Chalk Gray
                  </p>
                  <p className="font-headline font-black text-2xl text-secondary-fixed italic">
                    $289.00
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            </div>

            {/* Customer Info */}
            <section>
              <h4 className="font-headline font-black text-[10px] uppercase tracking-[0.35em] mb-6 flex items-center gap-4 text-white/60">
                <span className="material-symbols-outlined text-lg text-primary-container">
                  person
                </span>
                Customer Identity
              </h4>
              <div className="space-y-4 bg-white/[0.01] p-6 rounded-[2px] border border-white/[0.03]">
                <DetailEntry label="Full Name" value="Julian Thorne" />
                <DetailEntry
                  label="Member Tier"
                  value="Prestige Member"
                  valueClass="text-secondary-fixed font-black italic underline underline-offset-4"
                />
                <DetailEntry
                  label="Account Email"
                  value="j.thorne@collector.io"
                />
                <DetailEntry label="Last Purchase" value="14 Oct 2023" />
              </div>
            </section>

            {/* Notes */}
            <section className="space-y-8">
              <div>
                <label className="block font-headline font-black text-[9px] uppercase tracking-[0.3em] mb-4 opacity-30">
                  Customer Notes
                </label>
                <div className="p-5 bg-[#161616] border border-white/[0.03] text-sm italic text-white/70 rounded-[2px] border-l-2 border-white/10">
                  "Please ensure the box is in mint condition. For museum
                  display."
                </div>
              </div>
              <div>
                <label className="block font-headline font-black text-[9px] uppercase tracking-[0.3em] mb-4 opacity-30">
                  Internal Admin Notes (Autosave)
                </label>
                <textarea
                  className="w-full bg-black/40 border border-white/[0.05] focus:ring-1 focus:ring-primary-container/40 text-sm font-body p-5 placeholder:opacity-10 rounded-[2px] outline-none transition-all focus:border-primary-container/40"
                  placeholder="Add private notes for staff..."
                  rows="4"
                ></textarea>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[8px] font-black uppercase tracking-widest text-green-500/60 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[12px]">
                      check_circle
                    </span>{" "}
                    Changes Saved
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/10 tabular-nums">
                    Last edited by Marcus E. • 4m ago
                  </span>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h4 className="font-headline font-black text-[10px] uppercase tracking-[0.35em] mb-8 flex items-center gap-4 text-white/60">
                <span className="material-symbols-outlined text-lg text-primary-container">
                  history
                </span>
                Audit Trail
              </h4>
              <div className="relative space-y-10 pl-6 border-l border-white/5 ml-3">
                <TimelineEvent
                  title="Reservation Created"
                  meta="12 Nov 2023, 14:02 by System"
                  active
                />
                <TimelineEvent
                  title="Awaiting Payment"
                  meta="12 Nov 2023, 14:02 by System"
                />
                <TimelineEvent
                  title="Inventory Verification"
                  meta="System Locked SKU #ARC-5902"
                />
              </div>
            </section>
          </div>

          <div className="p-10 bg-[#131313] flex gap-4 border-t border-white/[0.05]">
            <button className="flex-1 bg-primary-container text-white py-4 font-headline font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-primary-container/20 rounded-[2px]">
              Confirm Order
            </button>
            <button className="w-16 h-14 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] hover:text-[#C8102E] hover:border-[#C8102E]/40 transition-all rounded-[2px] group">
              <span className="material-symbols-outlined text-2xl opacity-20 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                delete
              </span>
            </button>
          </div>
        </aside>
      )}

      {/* --- Email Modal --- */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setIsEmailModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-2xl bg-[#0F0F0F] border border-white/[0.08] shadow-[0_0_100px_rgba(0,0,0,1)] p-12 rounded-[2px] animate-scale-in">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-headline font-black text-3xl tracking-tighter uppercase italic">
                Send Notification
              </h3>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="material-symbols-outlined opacity-20 hover:text-primary-container hover:opacity-100 transition-all"
              >
                close
              </button>
            </div>
            <form className="space-y-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 border-l-2 border-[#C8102E] pl-3">
                  Recipient
                </label>
                <input
                  className="w-full bg-white/[0.02] border border-white/5 text-white/50 text-sm py-4 px-6 font-headline font-bold uppercase tracking-widest rounded-[1px] outline-none"
                  readOnly
                  type="text"
                  value={activeReservation?.email}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 border-l-2 border-[#C8102E] pl-3">
                  Subject
                </label>
                <input
                  className="w-full bg-black/40 border border-white/[0.05] focus:ring-1 focus:ring-primary-container/40 text-sm py-4 px-6 font-headline font-black uppercase tracking-widest rounded-[1px] outline-none focus:border-primary-container/40 transition-all"
                  type="text"
                  defaultValue={`Reservation Update: ${activeReservation?.model}`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 border-l-2 border-[#C8102E] pl-3">
                  Message Body
                </label>
                <textarea
                  className="w-full bg-black/40 border border-white/[0.05] focus:ring-1 focus:ring-primary-container/40 text-sm py-5 px-6 font-body rounded-[1px] outline-none focus:border-primary-container/40 transition-all"
                  rows="8"
                  defaultValue={`Hello ${activeReservation?.customer},\n\nYour reservation for the ${activeReservation?.model} (ID: ${activeReservation?.id}) is currently being processed. Our curating team is performing a final quality inspection before packaging.\n\nBest regards,\nThe Kinetic Team`}
                ></textarea>
              </div>
              <div className="flex justify-end gap-5 pt-4">
                <button
                  className="px-8 py-4 font-headline font-black text-[10px] uppercase tracking-[0.3em] border border-white/5 hover:bg-white/[0.03] transition-all rounded-[1px] opacity-40 hover:opacity-100"
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                >
                  Discard
                </button>
                <button
                  className="px-12 py-4 bg-primary-container text-white font-headline font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-container/20 rounded-[1px]"
                  type="button"
                >
                  Transmit Email
                </button>
              </div>
            </form>
          </div>
        </div>
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
        @keyframes scale-in {
          0% {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

const SidebarItemSmall = ({ icon, label }) => (
  <a
    href="#"
    className="flex items-center gap-4 px-10 py-3 text-white/30 hover:text-white transition-all group"
  >
    <span className="material-symbols-outlined text-[18px] font-light group-hover:rotate-12 transition-transform">
      {icon}
    </span>
    <span className="text-[9px] font-headline font-black uppercase tracking-widest">
      {label}
    </span>
  </a>
);

const Checkbox = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-6 h-6 rounded-[1px] border flex items-center justify-center transition-all duration-300 ${
      checked
        ? "bg-primary-container border-primary-container"
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

const PaginationButton = ({ label, icon, active, disabled }) => (
  <button
    className={`w-10 h-10 flex items-center justify-center transition-all rounded-[1px] text-[10px] font-black ${
      active
        ? "bg-primary-container text-white shadow-lg shadow-primary-container/20"
        : disabled
          ? "opacity-10 cursor-not-allowed"
          : "border border-white/5 hover:bg-white/5 text-white/30 hover:text-white"
    }`}
    disabled={disabled}
  >
    {icon ? (
      <span className="material-symbols-outlined text-lg">{icon}</span>
    ) : (
      label
    )}
  </button>
);

const DetailEntry = ({
  label,
  value,
  valueClass = "text-white font-black uppercase",
}) => (
  <div className="flex justify-between items-center text-[10px] font-headline">
    <span className="text-white/30 uppercase tracking-[0.1em]">{label}</span>
    <span className={`${valueClass} tracking-widest`}>{value}</span>
  </div>
);

const TimelineEvent = ({ title, meta, active }) => (
  <div className="relative">
    <span
      className={`absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#0F0F0F] ${active ? "bg-secondary-container shadow-[0_0_15px_rgba(255,219,60,0.5)]" : "bg-white/10"}`}
    ></span>
    <p
      className={`text-[10px] font-black uppercase tracking-widest mb-1 ${active ? "text-white" : "text-white/30"}`}
    >
      {title}
    </p>
    <p className="text-[9px] text-white/10 font-bold uppercase tracking-widest tabular-nums">
      {meta}
    </p>
  </div>
);
