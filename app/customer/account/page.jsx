"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Account() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
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
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-xs font-black uppercase tracking-widest leading-none">
              Update
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="font-headline font-black text-4xl lg:text-6xl uppercase italic tracking-tighter leading-[0.9] mb-4">
              {firstName} <br />{" "}
              <span className="text-primary-container">{lastName}</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#A8A8A0]">
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
            onClick={handleLogout}
            className="px-6 py-3 border border-white/10 hover:border-primary-container/50 hover:bg-primary-container/5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3"
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
              className="bg-surface-container-high border border-white/5 p-8 rounded-lg relative overflow-hidden group hover:border-primary-container/30 transition-all"
            >
              <div className="absolute -top-10 -right-10 size-32 bg-primary-container/5 blur-3xl group-hover:bg-primary-container/10 transition-colors"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#555555] mb-2">
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
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-6">
              <div>
                <h2 className="font-headline font-black text-2xl uppercase italic tracking-tight mb-1">
                  Active Reservoir
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                  Manage and track your diecast allocations
                </p>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2 p-1 bg-surface-container-high rounded-lg border border-white/5">
                {["All", "Pending", "Approved", "Rejected"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded ${
                      filter === f
                        ? "bg-primary-container text-white shadow-lg"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReservations.length === 0 ? (
                <div className="md:col-span-2 py-20 text-center border border-dashed border-white/10 rounded-lg">
                  <p className="font-headline text-white/20 uppercase tracking-widest text-sm">
                    No {filter !== "All" ? filter : ""} Reservations Found
                  </p>
                  <Link
                    href="/customer/product"
                    className="text-primary-container text-[10px] font-black uppercase tracking-[0.3em] mt-4 inline-block hover:underline"
                  >
                    Start Your Collection
                  </Link>
                </div>
              ) : (
                filteredReservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-surface-container-low border border-white/5 p-6 rounded-lg flex items-center gap-6 group hover:bg-surface-container-high transition-colors"
                  >
                    <div className="size-16 bg-surface-container-highest rounded flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={
                          res.Inventory?.item_image ||
                          "https://via.placeholder.com/150"
                        }
                        alt={res.Inventory?.item_name}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#555555] mb-1 leading-none">
                        {res.Inventory?.brand}
                      </p>
                      <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-white mb-2 leading-none">
                        {res.Inventory?.item_name}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                        <span className="opacity-40">
                          {new Date(res.created_at).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-[2px] ${
                            res.status === "Approved"
                              ? "bg-green-500/10 text-green-500"
                              : res.status === "Rejected"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {res.status || "Pending"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right pr-4">
                      <p className="text-[10px] font-black uppercase text-white/20 mb-1">
                        Qty
                      </p>
                      <p className="font-headline text-xl font-black italic">
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
    </div>
  );
}
