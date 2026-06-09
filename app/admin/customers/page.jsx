"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import Link from "next/link";
import RemoveAccountModal from "../../components/RemoveAccountModal";
import { TableSkeleton } from "../../components/Skeleton";

const supabase = createClient();

export default function AdminCustomers() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomer] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    getCustomer();
  }, []);

  const searchedCustomers = customers.filter((c) => {
    const fullName = `${c.firstname} ${c.lastname}`.toLowerCase();
    const email = c.Users?.email?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const totalUsers = searchedCustomers.length;

  const handleRowClick = (customerId) => {
    const matchedCustomer = customers.find(
      (item) => item.id === parseInt(customerId),
    );

    setSelectedCustomer(matchedCustomer);
    console.log(matchedCustomer);
    setIsDrawerOpen(true);
  };

  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const deleteUser = async () => {
    try {
      const { error } = await supabase
        .from("Users")
        .delete()
        .eq("id", selectedCustomer?.Users?.id);

      if (error) throw error;
      setIsDrawerOpen(false);
      setIsRemoveOpen(false);
      setSelectedCustomer(null);
      getCustomer();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" text-font-color min-h-screen font-body relative overflow-hidden select-none">
      {/* --- Main Content --- */}
      <main className="pl-0 lg:pl-[var(--sidebar-width)] ml-5 pt-24 lg:pt-5 px-6 lg:px-8 pb-12 min-h-screen transition-all duration-300">
        <div className="px-4 sm:px-10 pb-40">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14 reveal-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h3 className="text-4xl sm:text-6xl text-font-color font-black font-headline tracking-tighter uppercase italic leading-none mb-4 sm:mb-0">
                CUSTOMERS
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-font-color">
                  TOTAL CUSTOMERS:{" "}
                  <span className="text-font-color font-bold">
                    {totalUsers}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/auth/register"
                className="flex items-center gap-3 bg-primary-container shadow-lg/30 px-6 py-3 border border-white/5 text-black/90 font-bold text-md uppercase tracking-widest hover:scale-105 transition-all rounded-lg overflow-hidden"
              >
                <span className="material-symbols-outlined text-lg">
                  person_add
                </span>
                <span>Register New Admin?</span>
              </Link>
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div
            className="bg-secondary-container shadow-lg/30 p-4 sm:p-5 rounded-lg mb-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 reveal-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-full sm:flex-1 flex items-center gap-4 sm:gap-5 border border-primary-container px-4 sm:px-6 h-14 rounded-lg bg-input-field">
              <span className="material-symbols-outlined text-xl font-light opacity-80">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="SEARCH NAME OR EMAIL..."
                className="flex-1 bg-transparent border-none outline-none text-sm sm:text-md font-headline font-bold tracking-[0.1em] placeholder:opacity-80  text-white/90"
              />
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div
              className="bg-secondary-container shadow-lg/30 rounded-lg overflow-x-auto reveal-up scrollbar-hide"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="p-6">
                <TableSkeleton columns={5} rows={5} />
              </div>
            </div>
          ) : (
            <div
              className="bg-secondary-container shadow-lg/30 rounded-lg overflow-x-auto reveal-up scrollbar-hide"
              style={{ animationDelay: "0.2s" }}
            >
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="border-b border-primary-container">
                  <tr className="bg-input-field">
                    <th className="px-6 sm:px-8 py-5 text-center text-xs sm:text-lg font-black font-headline uppercase tracking-[0.15em] sm:tracking-[0.3em] text-primary-container">
                      CUSTOMER NAME
                    </th>
                    <th className="px-6 sm:px-8 py-5 text-center text-xs sm:text-lg font-black font-headline uppercase tracking-[0.15em] sm:tracking-[0.3em] text-primary-container">
                      RESERVATIONS
                    </th>
                    <th className="px-6 sm:px-8 py-5 text-center text-xs sm:text-lg font-black font-headline uppercase tracking-[0.15em] sm:tracking-[0.3em] text-primary-container">
                      GENDER
                    </th>
                    <th className="px-6 sm:px-8 py-5 text-center text-xs sm:text-lg font-black font-headline uppercase tracking-[0.15em] sm:tracking-[0.3em] text-primary-container">
                      DATE OF BIRTH
                    </th>
                    <th className="px-6 sm:px-8 py-5 text-center text-xs sm:text-lg font-black font-headline uppercase tracking-[0.15em] sm:tracking-[0.3em] text-primary-container">
                      DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {searchedCustomers.length > 0 ? (
                    searchedCustomers
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage,
                      )
                      .map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => handleRowClick(c.id)}
                          className={`group hover:bg-white/[0.01] transition-all duration-300 cursor-pointer  border-b border-primary-container${
                            selectedCustomer?.id === c.id
                              ? "bg-white/[0.03]"
                              : ""
                          }`}
                        >
                          {/* Identity */}
                          <td className="px-6 sm:px-8 py-5">
                            <div className="flex items-center gap-4 justify-center">
                              <div className="text-center">
                                <p className="text-md sm:text-xl text-white font-bold font-headline uppercase tracking-tight group-hover:text-primary-container transition-colors duration-300">
                                  {c.firstname} {c.lastname}
                                </p>
                                <p className="text-sm text-white/60 font-bold mt-1 italic lowercase">
                                  {c.Users?.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Reservations */}
                          <td className="px-6 sm:px-8 py-5 text-center">
                            <span className="text-lg text-white font-headline font-bold">
                              {c.Users?.Reservation?.length || 0}
                            </span>
                          </td>

                          {/* Gender */}
                          <td className="px-6 sm:px-8 py-5 text-center">
                            <p className="text-md text-white font-bold uppercase tracking-[0.2em]">
                              {c.gender || "N/A"}
                            </p>
                          </td>

                          {/* Date of Birth */}
                          <td className="px-6 sm:px-8 py-5 text-center">
                            <p className="text-lg font-headline font-bold text-primary-container">
                              {c.dob || "N/A"}
                            </p>
                          </td>

                          {/* Details */}
                          <td className="px-6 sm:px-8 py-5 text-center">
                            <button className="w-8 h-8 flex items-center justify-center bg-primary-container rounded-lg text-black hover:bg-secondary-container/80 hover:text-white/80 transition-all mx-auto">
                              <span className="material-symbols-outlined text-sm">
                                {selectedCustomer?.id === c.id
                                  ? "arrow_forward_ios"
                                  : "chevron_right"}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-80">
                          <span className="material-symbols-outlined text-6xl">
                            person_off
                          </span>
                          <p className="text-xl text-white/90 font-headline font-black uppercase tracking-[0.2em]">
                            No users found
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="w-full flex items-center justify-center p-8 bg-input-field border-t border-primary-container">
                <div className="flex items-center gap-3">
                  {/* Previous */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-white/5 text-white/90 hover:bg-white/50 transition-colors disabled:opacity-20"
                  >
                    <span className="material-symbols-outlined text-md">
                      chevron_left
                    </span>
                  </button>

                  {/* Current Page Indicator */}
                  <button className="w-8 h-8 flex items-center justify-center bg-primary-container text-black font-black text-md">
                    {currentPage}
                  </button>

                  {/* Next */}
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(
                          p + 1,
                          Math.ceil(searchedCustomers.length / itemsPerPage),
                        ),
                      )
                    }
                    disabled={
                      currentPage >=
                      Math.ceil(searchedCustomers.length / itemsPerPage)
                    }
                    className="w-8 h-8 flex items-center justify-center border border-white/5 text-white/90 hover:bg-white/50 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-md">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Customer Detail Drawer — Overlay on mobile, side panel on desktop */}
      {isDrawerOpen && selectedCustomer && (
        <>
          {/* Mobile overlay backdrop */}
          <div
            className="fixed inset-0 bg-background/80 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="fixed top-10 lg:top-0 sm:top-5  right-0  sm:w-[400px] lg:w-[450px] h-screen bg-secondary-container border-l border-white/5 flex flex-col z-[45] animate-slide-in-right">
            {/* Drawer Header */}
            <div className="p-6 sm:p-10  bg-input-field">
              <div className="flex items-start justify-between mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-container flex items-center justify-center font-headline font-black text-2xl sm:text-3xl text-black/90 border-2 border-white/20 shadow-lg italic rounded-lg">
                  {selectedCustomer.firstname?.[0]}
                  {selectedCustomer.lastname?.[0]}
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-primary-container rounded-lg hover:scale-105 transition-all group"
                >
                  <span className="material-symbols-outlined opacity-80 text-primary-container group-hover:opacity-100 group-hover:rotate-90 transition-all text-xl sm:text-2xl font-light">
                    close
                  </span>
                </button>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-headline uppercase tracking-tighter italic leading-none text-white/90">
                {selectedCustomer.firstname} {selectedCustomer.lastname}
              </h2>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs font-headline font-bold text-white/80 uppercase tracking-[0.2em]">
                  MEMBER SINCE:
                </span>
                <span className="text-sm  font-bold text-primary-container uppercase">
                  {selectedCustomer.Users?.created_at
                    ? new Date(
                        selectedCustomer.Users.created_at,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 custom-scrollbar">
              {/* Communication Section */}
              <section>
                {/* Footer Actions */}
                <div className="space-y-3 pt-4 pb-10">
                  <button
                    onClick={() => setIsRemoveOpen(true)}
                    className="w-full bg-error-container hover:brightness-110 text-white font-headline font-black uppercase italic tracking-[0.25em] text-xs py-5 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-error-container/20"
                  >
                    REMOVE CUSTOMER ACCOUNT?
                  </button>
                </div>
                <h3 className="font-headline font-black text-xs uppercase tracking-[0.4em] text-primary-container mb-6 border-l-2 border-primary-container pl-4">
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
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                <div className="p-4 sm:p-6 bg-input-field border-b-4 border-primary-container group hover:scale-105 transition-all rounded-lg">
                  <span className="text-sm font-headline font-bold text-white/40 block mb-3 uppercase tracking-widest">
                    TOTAL ORDERS
                  </span>
                  <span className="text-3xl sm:text-4xl font-black font-headline tracking-tighter italic text-primary-container">
                    {selectedCustomer.Users?.Reservation?.length || 0}
                  </span>
                </div>
                <div className="p-4 sm:p-6 bg-input-field border-b-4 border-primary-container group hover:scale-105 transition-all rounded-lg">
                  <span className="text-sm font-headline font-bold text-white/40 block mb-3 uppercase tracking-widest">
                    GENDER
                  </span>
                  <span className="text-lg sm:text-xl font-black font-headline tracking-tighter italic uppercase text-primary-container">
                    {selectedCustomer.gender || "—"}
                  </span>
                </div>
              </div>

              {/* Reservation Logs */}
              <section>
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="font-headline font-black text-xs uppercase tracking-[0.4em] text-primary-container border-l-2 border-primary-container pl-4">
                    Reservation Logs
                  </h3>
                </div>
                <div className="space-y-3">
                  {selectedCustomer.Users?.Reservation?.length > 0 ? (
                    selectedCustomer.Users.Reservation.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-input-field border border-primary-container rounded-lg group hover:scale-105 transition-all"
                      >
                        <div>
                          <p className="text-md font-bold uppercase tracking-tight text-white/90  transition-colors">
                            {item.Inventory?.item_name}
                          </p>
                          <p className="text-xs font-headline font-bold text-white/80 mt-1 uppercase">
                            {item.Inventory?.brand}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-headline font-black uppercase tracking-wider px-3 py-1 rounded ${
                            item.status === "Approved"
                              ? "bg-green-400 text-black/90"
                              : item.status === "Pending"
                                ? "bg-yellow-400 text-black/90"
                                : item.status == "Declined"
                                  ? "bg-on-primary text-white/90"
                                  : item.status === "Cancelled"
                                    ? "bg-red-600/20 text-red-400"
                                    : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-8 opacity-50">
                      <span className="material-symbols-outlined text-3xl">
                        event_busy
                      </span>
                      <p className="text-xs font-headline font-bold uppercase tracking-[0.2em]">
                        No reservations yet
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </aside>
        </>
      )}

      <RemoveAccountModal
        open={isRemoveOpen && !!selectedCustomer}
        onClose={() => setIsRemoveOpen(false)}
        onConfirm={() => deleteUser()}
        customerName={
          selectedCustomer
            ? `${selectedCustomer.firstname} ${selectedCustomer.lastname}`
            : ""
        }
      />

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

const DrawerContactCard = ({ label, value }) => (
  <div className="flex items-center justify-between p-4 sm:p-5 bg-input-field border-b-4 border-primary-container rounded-lg group hover:scale-105 cursor-pointer transition-all">
    <div className="flex flex-col">
      <span className="text-xs font-headline font-bold text-white/80 uppercase tracking-widest mb-1.5">
        {label}
      </span>
      <span className="text-sm font-black  text-white/90 group-hover:text-white transition-colors  italic">
        {value}
      </span>
    </div>
  </div>
);
