"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SessionModal from "../../components/SessionModal";
import dynamic from "next/dynamic";
import Image from "next/image";

const DynamicSessionModal = dynamic(
  () => import("../../components/SessionModal"),
);

export default function Account() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);
      try {
        // 1. Get Current User First
        const {
          data: { user: authUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !authUser) {
          router.push("/customer/auth/login");
          return;
        }
        setUser(authUser);

        // 2. Get Reservations for this user
        const { data: reservationData, error: reservationError } =
          await supabase
            .from("Reservation")
            .select("*")
            .eq("user_id", authUser.id)
            .order("created_at", { ascending: false });

        if (reservationError) throw reservationError;

        // 3. Manually fetch Inventory details for these reservations (Manual Join)
        if (reservationData && reservationData.length > 0) {
          const inventoryIds = reservationData.map((r) => r.inventory_id);

          const { data: inventoryData, error: inventoryError } = await supabase
            .from("Inventory")
            .select("id, item_name, brand, item_image")
            .in("id", inventoryIds);

          if (inventoryError) throw inventoryError;

          // Merge the data manually
          const mergedData = reservationData.map((res) => ({
            ...res,
            Inventory: inventoryData.find((inv) => inv.id === res.inventory_id),
          }));
          setReservations(mergedData);
        } else {
          setReservations([]);
        }
      } catch (error) {
        console.error("Error fetching account data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  const showLogoutModal = async () => {
    setShowSessionModal(true);
  };

  const logoutAccount = async () => {
    await supabase.auth.signOut();
    setShowSessionModal(false);
    router.push("/");
  };

  const handleCancelReservation = async (
    reservationId,
    inventoryId,
    quantity,
  ) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      // 1. Update reservation status to Cancelled
      const { error: updateError } = await supabase
        .from("Reservation")
        .update({ status: "Cancelled" })
        .eq("id", reservationId);

      if (updateError) throw updateError;

      // 2. Fetch current stock and restore it
      const { data: inventory, error: fetchError } = await supabase
        .from("Inventory")
        .select("stock")
        .eq("id", inventoryId)
        .single();

      if (!fetchError && inventory) {
        const restoredStock = inventory.stock + quantity;
        await supabase
          .from("Inventory")
          .update({ stock: restoredStock })
          .eq("id", inventoryId);
      }

      // 3. Update local state
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId ? { ...r, status: "Cancelled" } : r,
        ),
      );
    } catch (error) {
      console.error("Cancellation Failed: ", error.message);
      alert("Failed to cancel reservation");
    }
  };

  const [filter, setFilter] = useState("All");

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="size-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const firstName = user?.user_metadata?.first_name || "Collector";
  const lastName = user?.user_metadata?.last_name || "";
  const email = user?.email || "";

  // Stats calculation
  const totalReserved = reservations.length;
  const pendingCount = reservations.filter(
    (r) => r.status === "Pending" || !r.status,
  ).length;
  const approvedCount = reservations.filter(
    (r) => r.status === "Approved",
  ).length;

  const stats = [
    {
      label: "Total Reserved",
      value: totalReserved.toString().padStart(2, "0"),
      unit: "Items",
    },
    {
      label: "Active Requests",
      value: pendingCount.toString().padStart(2, "0"),
      unit: "Pending",
    },
    {
      label: "Vault Approved",
      value: approvedCount.toString().padStart(2, "0"),
      unit: "Approved",
    },
  ];

  const filteredReservations = reservations.filter((res) => {
    if (filter === "All") return true;
    if (filter === "Pending") return res.status === "Pending" || !res.status;
    return res.status === filter;
  });

  return (
    <div className="bg-background font-body text-on-surface min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col gap-12 lg:gap-20">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-center gap-8 md:gap-12 animate-fade-in pb-12 border-b border-white/5">
          <div className="relative size-32 lg:size-40 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container shadow-[0_0_30px_rgba(200,16,46,0.1)] group">
            <img
              src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=E31837&color=fff`}
              alt="User"
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="font-headline font-black text-4xl lg:text-6xl uppercase italic tracking-tighter leading-[0.9] mb-4 drop-shadow-lg/30">
              {firstName} {lastName}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm tracking-[0.2em] text-font-color">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span>{" "}
                {email}
              </span>

              <span className="px-2 py-1 bg-secondary-fixed text-on-secondary-fixed italic">
                Verified Customer
              </span>
            </div>
          </div>
          <button
            onClick={showLogoutModal}
            className="px-6 py-3 border-secondary-container bg-secondary-container rounded-lg hover:scale-105 text-xs text-white/90 font-black uppercase tracking-widest transition-all flex items-center gap-3 drop-shadow-lg/25"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </section>

        {/* Stats Grid */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-up"
          style={{ animationDelay: "200ms" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-secondary-container  p-8 rounded-lg relative overflow-hidden group transition-all"
            >
              <div className="absolute -top-10 -right-10 size-32 bg-primary-container/5 blur-3xl group-hover:bg-primary-container/10 transition-colors"></div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/90 mb-2">
                {stat.label}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-headline font-black italic">
                  {stat.value}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-primary-container mb-2">
                  {stat.unit}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Activity Sections */}
        <div className="flex flex-col gap-12">
          {/* Recent Reservations */}
          <div
            className="space-y-8 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-6 gap-6">
              <div>
                <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase italic tracking-tight mb-1 text-font-color">
                  Your Reservations
                </h2>
                <p className="text-xs font-black uppercase tracking-widest text-font-color">
                  Manage and track your diecast reservations status
                </p>
              </div>

              {/* Filter Buttons */}
              <div className="grid grid-cols-2 lg:flex items-center gap-2 p-1 bg-secondary-container rounded-lg border border-white/5">
                {["All", "Pending", "Approved", "Rejected", "Cancelled"].map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded ${
                        filter === f
                          ? "bg-primary-container text-black/90 shadow-lg"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredReservations.length === 0 ? (
                <div className="lg:col-span-2 py-20 text-center border border-dashed border-secondary-container rounded-lg">
                  <p className="font-headline text-font-color  uppercase tracking-widest text-md px-6">
                    No {filter !== "All" ? filter : ""} Reservations Found
                  </p>
                  <Link
                    href="/customer/product"
                    className="text-secondary-container dark:text-primary-container text-sm font-black uppercase tracking-[0.3em] mt-4 inline-block hover:underline"
                  >
                    Start Your Collection
                  </Link>
                </div>
              ) : (
                filteredReservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-secondary-container border border-white/5 p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 drop-shadow-lg/30 transition-colors"
                  >
                    <div className="relative w-full sm:w-40 h-64 sm:h-40 bg-surface-container-highest rounded flex items-center justify-center p-3 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                      <Image
                        src={
                          res.Inventory?.item_image ||
                          "https://via.placeholder.com/150"
                        }
                        alt={res.Inventory?.item_name}
                        className="object-contain p-2"
                        fill
                        sizes="(max-width: 768px) 100vw, 160px"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm font-black uppercase tracking-widest text-white/90 mb-1 leading-none">
                        {res.Inventory?.brand}
                      </p>
                      <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-white/90 mb-3 sm:mb-2 leading-none">
                        {res.Inventory?.item_name}
                      </h3>
                      <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-white font-black uppercase tracking-widest">
                        <span>
                          {new Date(res.created_at).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                        <span
                          className={`p-2 rounded-lg text-md ${
                            res.status === "Approved"
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : res.status === "Rejected" ||
                                  res.status === "Cancelled"
                                ? "bg-on-primary text-white/90  border border-red-500/20"
                                : "bg-primary-container text-font-color border border-yellow-500/20"
                          }`}
                        >
                          {res.status || "Pending"}
                        </span>
                        {(res.status === "Pending" || !res.status) && (
                          <button
                            onClick={() =>
                              handleCancelReservation(
                                res.id,
                                res.inventory_id,
                                res.quantity,
                              )
                            }
                            className="bg-on-primary p-2 transition-colors flex items-center gap-1 group/cancel rounded-lg text-xs"
                          >
                            <span className="material-symbols-outlined text-xs group-hover/cancel:rotate-90 transition-transform">
                              close
                            </span>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex items-center justify-start sm:flex-col sm:items-end sm:justify-center gap-2 sm:pr-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <p className="text-sm font-black uppercase text-white/90">
                        Quantity: {""}
                      </p>
                      <p className="font-headline text-2xl sm:text-xl font-black italic text-primary-container sm:text-white leading-none">
                        {res.quantity?.toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <DynamicSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onConfirm={logoutAccount}
      />
    </div>
  );
}
