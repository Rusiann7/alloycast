"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import emailjs from "@emailjs/browser";
import dynamic from "next/dynamic";
import Image from "next/image";

// Import  new helper & utility functions
import { getDateBounds } from "../../../utils/dateBounds";
import {
  aggregateRevenue,
  computeTopProducts,
  mergeCustomerDetails,
} from "../../../helpers/dashboardHelpers";
import { exportToExcelFile } from "../../../utils/exportExcelAdminDashboard";

const DynamicCriticalStockModal = dynamic(
  () => import("../../components/CriticalStockModal"),
  {
    ssr: false,
  },
);

const DynamicOrderStatusConfirmationModal = dynamic(
  () => import("../../components/OrderStatusConfirmationModal"),
  {
    ssr: false,
  },
);

const DynamicToast = dynamic(() => import("../../components/Toast"), {
  ssr: false,
});

// 2. Instantiate Supabase singleton at the module level (avoids recreation on render)
const supabase = createClient();

export default function AdminDashboard() {
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [data, setData] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    revenueEstimate: 0,
    criticalStockCount: 0,
    loading: true,
  });
  const [activeReservation, setActiveReservation] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    reservationId: null,
    newStatus: null,
    customerEmail: null,
    customerName: null,
    productName: null,
  });
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // Revenue Graph States
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const router = useRouter();

  // 3. Functional toast setter prevents stale state closures
  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  }, []);

  // 4. Stable useCallback for fetching Analytics
  const fetchAllAnalytics = useCallback(async () => {
    const { startDate, endDate } = getDateBounds(dateRange);
    const { data: posData, error: posError } = await supabase
      .from("POS")
      .select("quantity, created_at, Inventory(price, item_name)")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    if (posError || !posData) {
      console.error("Error fetching POS analytics:", posError);
      showToast("Failed to fetch POS analytics data", "error");
      return;
    }
    const currentYear = new Date().getFullYear();
    const { totalRevenue: sumRev, chartData } = aggregateRevenue(
      posData,
      dateRange,
      currentYear,
    );
    setTotalRevenue(sumRev);
    setRevenueData(chartData);
    const products = computeTopProducts(posData, 5);
    setTopProducts(products);
  }, [dateRange, showToast]);

  // 5. Stable useCallback for fetching general Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    try {
      const { data: resData } = await supabase
        .from("Reservation")
        .select("status");
      const { data: invData } = await supabase
        .from("Inventory")
        .select("item_name, item_image, brand, stock, reorder_point");
      setData({
        totalReservations: resData?.length || 0,
        pendingReservations:
          resData?.filter((r) => r.status === "Pending").length || 0,
        criticalStockCount: invData?.filter((i) => i.stock <= 5).length || 0,
        loading: false,
      });
      const criticalItems = invData?.filter((i) => i.stock <= 5) || [];
      setLowStockProducts(criticalItems);
      const { data: arrivalsData } = await supabase
        .from("Inventory")
        .select("id, item_name, price, item_image")
        .order("created_at", { ascending: false })
        .limit(4);
      setNewArrivals(arrivalsData || []);
      const { data: activityData } = await supabase
        .from("Reservation")
        .select("*, Users(email), Inventory(item_name, item_image, brand)")
        .order("created_at", { ascending: false })
        .limit(9);
      const { data: customerData } = await supabase
        .from("Customer")
        .select("user_id, firstname, lastname");
      if (activityData && customerData) {
        const merged = mergeCustomerDetails(activityData, customerData);
        setRecentActivities(merged);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showToast("Error updating dashboard statistics", "error");
    }
  }, [showToast]);

  // 6. Hook trigger relies on stable reference functions
  useEffect(() => {
    const initializeFunction = async () => {
      fetchDashboardData();
      fetchAllAnalytics();
    };
    initializeFunction();
  }, [fetchDashboardData, fetchAllAnalytics]);

  // 7. Decoupled Excel export handler
  const exportToExcel = async () => {
    try {
      const { startDate, endDate } = getDateBounds(dateRange);

      const { data: posData, error: posErr } = await supabase
        .from("POS")
        .select("quantity, created_at, Inventory(price, item_name)")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (posErr) throw posErr;

      const { data: reservations } = await supabase
        .from("Reservation")
        .select(
          "id, created_at, status, quantity, user_id, Inventory(item_name, item_image), Users(email)",
        )
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: false });

      const { data: arrivals } = await supabase
        .from("Inventory")
        .select("id, item_name, price, created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: false });

      exportToExcelFile({
        dateRange,
        posData: posData || [],
        reservations: reservations || [],
        arrivals: arrivals || [],
        showToast,
      });
    } catch (err) {
      console.error("Export failed: ", err);
      showToast("Failed to export dashboard data", "error");
    }
  };

  const handleActionClick = (res, newStatus) => {
    setConfirmModal({
      isOpen: true,
      reservationId: res.id,
      newStatus,
      customerEmail: res.customer_email,
      customerName: res.customer_name,
      productName: res.Inventory?.item_name,
    });
  };

  const statusUpdate = async (
    reservationId,
    newStatus,
    customerEmail,
    customerName,
    productName,
    reasonCancellation = "",
  ) => {
    // 1. Update Supabase
    const { error } = await supabase
      .from("Reservation")
      .update({ status: newStatus })
      .eq("id", reservationId);

    if (error) {
      showToast("Failed to update status", "error");
      return;
    }

    // 2. Send Email via EmailJS
    try {
      if (newStatus === "Approved") {
        await emailjs.send(
          "service_mu3qrbd",
          "template_uhrasxf",
          {
            to_email: customerEmail,
            customerName: customerName,
            productName: productName,
            status: newStatus,
            message:
              newStatus === "Approved"
                ? "Great news! Your order is approved. Please visit the store for pickup."
                : "Unfortunately, your reservation could not be accommodated.",
          },
          "3ilQZwBk_Cxjfohab", // Your Public Key
        );
        showToast("Order updated and email sent to customer!", "success");
      } else if (newStatus === "Declined") {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to_email: customerEmail,
            customerName: customerName,
            productName: productName,
            status: newStatus,
            reasonCancellation: reasonCancellation,
          }),
        });
        const result = await response.json();
        if (result.success) {
          showToast("Cancellation email sent to customer", "success");
        } else {
          throw new Error(result.error);
        }
      }
    } catch (err) {
      showToast("Status updated, but email failed to send.", "error");
      console.error(err);
    }

    // 3. Update local state
    setRecentActivities((prev) =>
      prev.map((res) =>
        res.id === reservationId ? { ...res, status: newStatus } : res,
      ),
    );
    setIsDetailsModalOpen(false);
  };

  // Functions to handle the Confirmation Modal buttons
  const handleConfirm = (reasonCancellation) => {
    const {
      reservationId,
      newStatus,
      customerEmail,
      customerName,
      productName,
    } = confirmModal;
    setConfirmModal({ ...confirmModal, isOpen: false });
    statusUpdate(
      reservationId,
      newStatus,
      customerEmail,
      customerName,
      productName,
      reasonCancellation,
    );
  };

  const handleCancel = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  return (
    <div className="font-body min-h-screen overflow-x-hidden select-none">
      {/* --- Main Content Canvas --- */}
      <main className="pl-0 lg:pl-[var(--sidebar-width)] ml-5  pt-24 lg:pt-5 px-6 lg:px-8 pb-12 min-h-screen transition-all duration-300">
        {" "}
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 reveal-up">
          <div>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl text-font-color font-black font-headline tracking-tighter uppercase italic leading-none">
              Admin Dashboard
            </h3>
          </div>
          <div className="w-full lg:w-auto">
            <button
              onClick={exportToExcel}
              className="w-full lg:w-auto bg-primary-container text-black/90 shadow-lg/30 px-6 py-3 rounded-lg text-sm font-headline font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              <span>Export Dashboard Data</span>
            </button>
          </div>
        </div>
        {/* KPI Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            icon="bookmark_manager"
            label="Total Reservations"
            value={data.totalReservations.toLocaleString()}
            delay="0.1s"
            onClick={() => router.push("/admin/reservations")}
          />
          <KPICard
            icon="pending_actions"
            label="Pending Review"
            value={data.pendingReservations.toLocaleString()}
            onClick={() => router.push("/admin/reservations")}
          />
          <KPICard
            icon="payments"
            label="POS Revenue"
            value={`₱${totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            onClick={() => router.push("/admin/analytics")}
          />
          <KPICard
            icon="warning"
            label="Critical Stock"
            value={data.criticalStockCount.toString().padStart(2, "0")}
            trend={
              data.criticalStockCount > 0 ? "Urgent Restock" : "Enough Stock"
            }
            trendColor={
              data.criticalStockCount > 0
                ? "text-primary-container"
                : "text-green-500"
            }
            delay="0.4s"
            badge={data.criticalStockCount > 0 ? "Urgent" : null}
            onClick={() => setIsStockModalOpen(true)}
          />
        </div>
        {/* Primary Data Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div
            className="lg:col-span-2 bg-input-field p-4 rounded-lg border border-primary-container  text-white/90 shadow-lg/30 relative reveal-up"
            style={{ animationDelay: "0.5s" }}
          >
            {/* Updated Header Layout: Responsive stacking */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-10 gap-8">
              {/* 1. Title */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-container">
                    insights
                  </span>
                </div>
                <h4 className="text-xl font-black font-headline uppercase tracking-tighter italic text-white/90">
                  Revenue Analysis
                </h4>
              </div>

              {/* 2. Filter Buttons - Grid 2x2 on mobile, flex on desktop */}
              <div className="w-full xl:w-auto">
                <div className="grid grid-cols-2 2xl:flex items-center bg-secondary-container p-1 rounded-lg  gap-1">
                  {["Last 7 Days", "This Month", "Last Month", "Annual"].map(
                    (label) => (
                      <button
                        key={label}
                        onClick={() => setDateRange(label)}
                        className={`w-full xl:w-auto px-4 py-2 text-sm sm:text-xs font-headline font-black uppercase tracking-widest transition-all rounded-lg whitespace-nowrap ${
                          dateRange === label
                            ? "bg-primary-container text-black/90 shadow-lg"
                            : "text-white/90 opacity-80 hover:opacity-100 hover:bg-secondary-container/10"
                        }`}
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* 3. Total Revenue */}
              <div className="flex items-center space-x-3 bg-primary-container/10 px-5 py-3  rounded-lg w-full xl:w-auto justify-center xl:justify-start">
                <div className="w-2 h-2 bg-primary-container rounded-full shadow-[0_0_8px_rgba(248,228,8,0.5)] animate-pulse"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-headline font-bold uppercase tracking-[0.2em] text-white/60 leading-none mb-1">
                    TOTAL REVENUE
                  </span>
                  <span className="text-xl font-black font-headline text-primary-container leading-none">
                    ₱
                    {totalRevenue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Area - Responsive Height */}
            <div className="h-[250px] sm:h-[300px] lg:h-[400px] w-full relative mt-4">
              {!revenueData ||
              revenueData.length === 0 ||
              totalRevenue === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-white/60 uppercase font-black tracking-widest">
                  No available data on this category
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#22C55E"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22C55E"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="#ffffff"
                      fontSize={12}
                      tickMargin={10}
                      axisLine={10}
                      tickLine={10}
                      opacity={1}
                    />
                    <YAxis
                      stroke="#ffffff"
                      fontSize={12}
                      axisLine={10}
                      tickLine={10}
                      opacity={1}
                      tickFormatter={(value) => `₱${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--secondary-container)",
                        borderColor: "var(--primary-container)",
                        fontSize: "12px",
                        borderRadius: "8px",
                        color: "white",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      itemStyle={{ color: "#22C55E" }}
                      formatter={(value) => `₱${Number(value).toFixed(2)}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22C55E"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Side Panel: Volume */}
          <div
            className="bg-secondary-container p-8 rounded-lg text-white/90 shadow-lg/30 reveal-up h-fit"
            style={{ animationDelay: "0.6s" }}
          >
            <h4 className="text-xl font-black font-headline uppercase tracking-tighter mb-6">
              Top Selling Products
            </h4>
            <div className="space-y-6">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <ProgressBar
                    key={product.name}
                    label={product.name}
                    value={`${product.percentage}%`}
                  />
                ))
              ) : (
                <div className="py-10 text-center opacity-60 text-sm font-black uppercase tracking-widest">
                  No Sales Data
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Activity Table */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          <div
            className="xl:col-span-3  text-white/90 bg-secondary-container rounded-lg  shadow-lg/30 overflow-hidden reveal-up"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="p-6 border-b-2 border-primary-container bg-primary-container flex justify-between items-center">
              <h4 className="text-xl text-black/90 font-black font-headline uppercase tracking-tighter">
                Reservations
              </h4>
              <button
                onClick={() => router.push("/admin/reservations")}
                className="text-md sm:text-sm font-headline font-bold uppercase tracking-widest text-black/90 hover:text-input-field hover:underline transition-colors"
              >
                View All Reservations
              </button>
            </div>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
              <table className="w-full text-left min-w-[700px] text-white/90">
                <thead>
                  <tr>
                    <th className="px-6 py-5 border-primary-container border-b-2 border-r-2 text-sm text-center font-headline font-bold uppercase tracking-widest ">
                      Timestamp
                    </th>
                    <th className="px-6 py-5 border-primary-container border-b-2 border-r-2 text-sm text-center font-headline font-bold uppercase tracking-widest ">
                      Item
                    </th>
                    <th className="px-6 py-5 border-primary-container border-b-2 border-r-2 text-sm text-center font-headline font-bold uppercase tracking-widest ">
                      Action
                    </th>
                    <th className="px-6 py-5 border-primary-container border-b-2 border-r-2 text-sm text-center font-headline font-bold uppercase tracking-widest ">
                      Status
                    </th>
                    <th className="px-6 py-5 border-primary-container border-b-2  text-sm text-center font-headline font-bold uppercase tracking-widest">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <TableRow
                        key={activity.id}
                        onClick={() => {
                          setActiveReservation(activity);
                          setIsDetailsModalOpen(true);
                        }}
                        date={new Date(activity.created_at)
                          .toLocaleDateString("en-CA")
                          .replace(/-/g, ".")}
                        time={new Date(activity.created_at).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          },
                        )}
                        item={activity.Inventory?.item_name || "Unknown Item"}
                        action="Reservation Order"
                        status={activity.status}
                        statusColor={
                          activity.status === "Approved"
                            ? "bg-green-400 text-black/90"
                            : activity.status === "Pending"
                              ? "bg-primary-container/10 text-primary-container"
                              : activity.status === "Cancelled"
                                ? "bg-on-primary text-white/90 "
                                : "bg-on-primary text-white/90 "
                        }
                        refId={`#RES-${String(activity.id).slice(0, 4).toUpperCase()}`}
                        img={activity.Inventory?.item_image}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-10 text-center opacity-20 uppercase text-sm font-black tracking-widest"
                      >
                        No Recent Activity
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className="bg-secondary-container p-6 rounded-lg  text-white/90 shadow-lg/30 reveal-up"
            style={{ animationDelay: "0.8s" }}
          >
            <h4 className="text-md text-white/90 font-black font-headline uppercase tracking-widest mb-6">
              Inventory{" "}
              <span className="text-primary-container ml-2 text-sm">
                +{newArrivals.length} ADDED ITEMS
              </span>
            </h4>
            <div className="space-y-4">
              {newArrivals.length > 0 ? (
                newArrivals.map((item) => (
                  <InventoryItem
                    key={item.id}
                    name={item.item_name}
                    price={`₱${item.price.toLocaleString()}`}
                    img={item.item_image}
                  />
                ))
              ) : (
                <div className="py-10 text-center opacity-20 uppercase text-sm font-black tracking-widest">
                  No New Items Added
                </div>
              )}
            </div>
            <button
              onClick={() => router.push("/admin/inventory")}
              className="w-full mt-6 py-3 rounded-lg bg-primary-container text-md text-black/90 shadow-lg/50 font-headline font-bold uppercase tracking-widest hover:scale-105  transition-all"
            >
              Manage Inventory
            </button>
          </div>
        </div>
      </main>

      <DynamicCriticalStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        items={lowStockProducts}
      />

      {isDetailsModalOpen && activeReservation && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsDetailsModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-4xl bg-modal-background border border-white/5 p-6 sm:p-10 rounded-lg animate-scale-in max-h-[95vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-secondary-container">
                  info
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-headline uppercase italic">
                  Reservation Details
                </h3>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="material-symbols-outlined  hover:rotate-90 transition-all p-2"
              >
                close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              {/* Product Side */}
              <div className="flex flex-col sm:flex-row gap-6 p-6 bg-secondary-container border border-white/5 rounded-lg shadow-lg/30">
                <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                  <Image
                    src={activeReservation.Inventory?.item_image}
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                    alt=""
                    width={220}
                    height={100}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-container mb-2">
                    Product Info
                  </p>
                  <h4 className="text-xl text-white/90 font-black uppercase italic leading-tight mb-1">
                    {activeReservation.Inventory?.item_name}
                  </h4>
                  <p className="opacity-80 text-white/90 uppercase text-xs font-bold tracking-widest">
                    {activeReservation.Inventory?.brand}
                  </p>
                  <div className="mt-6 flex items-center justify-center sm:justify-start space-x-2">
                    <span className="text-sm text-white/90 opacity-80 uppercase font-black">
                      Quantity:
                    </span>
                    <span className="text-2xl text-white/90 font-black font-headline tabular-nums leading-none">
                      {activeReservation.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Side */}
              <div className="p-6 bg-secondary-container border border-white/5 rounded-lg shadow-lg/30">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-container mb-6">
                  Customer Information
                </p>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="material-symbols-outlined text-white/90 mt-1 hidden sm:block">
                      person
                    </span>
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-white/90 opacity-80 uppercase font-bold tracking-widest mb-1">
                        Full Name
                      </p>
                      <p className="font-black text-white/90 uppercase text-lg leading-none">
                        {activeReservation.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="material-symbols-outlined text-white/90 mt-1 hidden sm:block">
                      mail
                    </span>
                    <div className="text-center sm:text-left overflow-hidden w-full">
                      <p className="text-sm text-white/90 opacity-80 uppercase font-bold tracking-widest mb-1">
                        Email Address
                      </p>
                      <p className="font-mono text-white/90 font-bold text-sm break-all">
                        {activeReservation.customer_email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                <span
                  className={`px-6 py-2 rounded-full border text-sm font-black uppercase tracking-[0.2em] ${
                    activeReservation.status === "Approved"
                      ? "text-green-500 border-green-500/20 bg-green-500/5"
                      : activeReservation.status === "Pending"
                        ? "text-font-color border-primary-container/20 bg-primary-container"
                        : activeReservation.status === "Cancelled"
                          ? "bg-on-primary  border-white/10 "
                          : "text-red-500 border-red-500/20 bg-red-500/5"
                  }`}
                >
                  Status: {activeReservation.status}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  disabled={activeReservation.status !== "Pending"}
                  onClick={() =>
                    handleActionClick(activeReservation, "Declined")
                  }
                  className="w-full sm:w-auto px-10 py-4 bg-secondary-container text-white/90  rounded-lg font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-all disabled:opacity-10 disabled:cursor-not-allowed group flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">
                    close
                  </span>
                  <span>Decline Order</span>
                </button>
                <button
                  disabled={activeReservation.status !== "Pending"}
                  onClick={() =>
                    handleActionClick(activeReservation, "Approved")
                  }
                  className="w-full sm:w-auto px-10 py-4 bg-primary-container text-black/90 rounded-lg font-black uppercase text-xs tracking-[0.2em] hover:scale-105 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] transition-all disabled:opacity-20 disabled:cursor-not-allowed group flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">
                    check
                  </span>
                  <span>Approve Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      <DynamicOrderStatusConfirmationModal
        isOpen={confirmModal.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        status={confirmModal.newStatus}
        customerName={confirmModal.customerName}
        productName={confirmModal.productName}
      />
    </div>
  );
}

const KPICard = ({
  icon,
  label,
  value,
  trend,
  trendColor,
  delay,
  badge,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-secondary-container shadow-lg/30 p-6 rounded-lg  dark:border-l-3 dark:border-primary-container relative overflow-hidden group reveal-up hover:cursor-pointer hover:scale-105 transition-all"
    style={{ animationDelay: delay }}
  >
    <div className="flex justify-between items-start mb-4">
      <span className="material-symbols-outlined text-primary-container">
        {icon}
      </span>
      {badge ? (
        <span className="bg-primary-container text-secondary-container text-xs px-2 py-0.5 rounded font-bold uppercase">
          {badge}
        </span>
      ) : (
        <span className={`text-sm font-headline font-bold ${trendColor}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-xs font-headline font-bold uppercase tracking-widest text-white/90 mb-1">
      {label}
    </p>
    <h3 className="text-3xl text-white/90 font-black font-headline tracking-tighter">
      {value}
    </h3>
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <span className="material-symbols-outlined text-8xl">{icon}</span>
    </div>
  </div>
);

const ProgressBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-sm text-white/90 font-headline font-bold uppercase tracking-widest opacity-90">
        {label}
      </span>
      <span className="text-sm font-headline font-bold text-white/90">
        {value}
      </span>
    </div>
    <div className="h-1.5 w-full bg-input-field rounded-full overflow-hidden">
      <div
        className="h-full bg-primary-container transition-all duration-1000"
        style={{ width: value }}
      ></div>
    </div>
  </div>
);

const TableRow = ({
  date,
  time,
  item,
  action,
  status,
  statusColor,
  refId,
  img,
  onClick,
}) => (
  <tr onClick={onClick} className="transition-colors group cursor-pointer">
    <td className="px-6 py-4 border-primary-container border-b-2 border-r-2">
      <p className="text-sm text-white/90 font-bold">{date}</p>
      <p className="text-sm text-white/90 ">{time}</p>
    </td>
    <td className="px-6 py-4 border-primary-container border-b-2 border-r-2">
      <div className="flex items-center space-x-3">
        <div className="w-20 h-10 bg-surface-container-highest rounded-[2px] overflow-hidden flex items-center justify-center">
          <Image
            className="object-cover w-full h-full transition-all"
            src={img}
            alt=""
            width={80}
            height={40}
            loading="lazy"
          />
        </div>
        <p className="text-sm font-bold font-headline uppercase tracking-tight">
          {item}
        </p>
      </div>
    </td>
    <td className="px-6 py-4 border-primary-container border-b-2 border-r-2 text-sm font-headline font-bold uppercase tracking-widest text-center">
      {action}
    </td>
    <td className="px-6 py-4 border-r-2 border-primary-container border-b-2 text-center">
      <span
        className={`px-2 py-1  rounded-lg ${statusColor}  text-xs font-bold uppercase tracking-widest`}
      >
        {status}
      </span>
    </td>
    <td className="px-6 py-4 border-primary-container border-b-2  text-sm font-bold transition-opacity">
      {refId}
    </td>
  </tr>
);

const InventoryItem = ({ name, price, img }) => (
  <div className="flex items-center space-x-4 p-3 bg-surface-container-highest/20 rounded-[4px] group cursor-pointer hover:bg-surface-container-highest transition-all border border-transparent hover:border-primary-container/20">
    {img ? (
      <Image
        className="..."
        src={img}
        alt={name}
        width={80}
        height={40}
        loading="lazy"
      />
    ) : (
      <div className="w-20 h-10 bg-white/10 rounded-[2px]" />
    )}
    <div className="flex-1">
      <p className="text-md text-white/90 font-headline font-bold uppercase tracking-tight break-words">
        {name}
      </p>
      <p className="text-md font-headline text-primary-container font-black tracking-widest uppercase">
        {price}
      </p>
    </div>
  </div>
);
