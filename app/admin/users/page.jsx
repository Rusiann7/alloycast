"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";

export default function AdminCustomers() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Open by default based on request visual
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [customers, setCustomer] = useState([]);

  const supabase = createClient();

  const totalUsers = customers.length;

  const getCustomer = async () => {
    try {
      const { data, error } = await supabase.from("Customer").select(
        `id, firstname, lastname, user_id, gender, dob,
        Users!user_id( id, email, created_at,
          Reservation!user_id( id, quantity, discount, created_at, status, inventory_id,
            Inventory!inventory_id( id, item_name, item_image, price, brand, category )
          )
        )`,
      );

      if (error) throw error;

      setCustomer(data || []);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const handleRowClick = (customerId) => {
    const matchedCustomer = customers.find(
      (item) => item.id === parseInt(customerId),
    );

    setSelectedCustomer(matchedCustomer);
    console.log(matchedCustomer);
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-x-hidden selection:bg-primary-container selection:text-white">
      {/* --- Main Content --- */}
      <main
        className={`lg:ml-64 pt-10 lg:pt-10 min-h-screen flex transition-all duration-500 ${isDrawerOpen ? "lg:mr-[450px]" : ""}`}
      >
        {/* Table Section */}
        <section className="lg:ml-64 pt-28 lg:pt-10 min-h-screen">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-10 mb-16 reveal-up">
            <div className="space-y-4 px-10 flex flex-col">
              <h2 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
                Users
              </h2>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-primary-container shadow-[0_0_10px_rgba(200,16,46,0.3)]"></span>
                <span className="bg-surface-container-high/60 text-primary-container px-3 py-1 text-[10px] font-mono font-bold border border-white/5 uppercase tracking-widest">
                  TOTAL USERS: {totalUsers}
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
                    <th className="px-10 py-6 font-headline text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Reservations
                    </th>
                    <th className="px-10 py-6 font-headline text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Gender
                    </th>
                    <th className="px-10 py-6 font-headline text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">
                      Date of Birth
                    </th>
                    <th className="px-10 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {customers.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => handleRowClick(c.id)}
                      className="group hover:bg-[#1C1B1B] transition-all duration-300 cursor-pointer border-l-4"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div>
                            <div className="font-headline font-black text-sm tracking-tight uppercase transition-colors">
                              {c.firstname} {c.lastname}
                            </div>
                            <div className="font-mono text-[10px] text-white/30 mt-1 tabular-nums italic lowercase">
                              {c.Users?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="font-mono text-xs bg-[#2a2a2a]/60 px-3 py-1.5 rounded-[1px] border border-white/5 tabular-nums">
                          1233
                        </span>
                      </td>
                      <td className="text-[11px] font-black font-headline uppercase leading-none">
                        {c.gender}
                      </td>
                      <td className="px-10 py-6 text-right font-mono text-secondary-container font-black text-xs tabular-nums">
                        {c.dob}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className="material-symbols-outlined transition-all">
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
                {selectedCustomer.firstname} {""} {selectedCustomer.lastname}
              </h2>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                  MEMBER SINCE:
                </span>
                <span className="text-[10px] font-mono text-white uppercase font-black tabular-nums">
                  {selectedCustomer.Users?.created_at}
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
                    value={selectedCustomer.Users?.email}
                    icon="content_copy"
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
                    temp data
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
                  {selectedCustomer.Users?.Reservation.map((item) => (
                    <div key={item.id}>
                      {item.Inventory?.item_name}
                      {item.Inventory?.brand}
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer Actions */}
              <div className="space-y-3 pt-4 pb-10">
                <button className="w-full bg-primary-container hover:brightness-110 text-white font-headline font-black uppercase italic tracking-[0.25em] text-xs py-5 rounded-[1px] transition-all transform active:scale-[0.98] shadow-lg shadow-primary-container/20">
                  REMOVE ACCOUNT
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
