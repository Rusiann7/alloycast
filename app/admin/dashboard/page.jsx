"use client";
import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import CriticalStockModal from "../../components/CriticalStockModal";
import OrderStatusConfirmationModal from "../../components/OrderStatusConfirmationModal";
import Toast from "../../components/Toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import emailjs from "@emailjs/browser";
import * as XLSX from "xlsx";

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

  const supabase = createClient();

  const router = useRouter();

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 4000);
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAllAnalytics();
  }, [dateRange]);

  const fetchAllAnalytics = async () => {
    // 1. Calculate Date Bounds
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (dateRange) {
      case "Last 7 Days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "This Month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "Last Month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case "All Time":
        startDate = new Date(0);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const { data: analyticsData, error } = await supabase
      .from("Reservation")
      .select("quantity, created_at, Inventory(price, item_name)")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .neq("status", "Pending")
      .neq("status", "Rejected");

    if (error || !analyticsData) {
      console.error("Error fetching analytics:", error);
      return;
    }

    // Process Revenue
    const dailyRevenue = {};
    let sumRev = 0;
    analyticsData.forEach((res) => {
      if (res.Inventory?.price) {
        const rev = res.quantity * res.Inventory.price;
        sumRev += rev;
        const dateStr = res.created_at.split("T")[0];
        dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + rev;
      }
    });

    setTotalRevenue(sumRev);
    const chartData = Object.keys(dailyRevenue)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((dateStr) => ({
        name: new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        revenue: dailyRevenue[dateStr],
      }));
    setRevenueData(chartData);

    // Top Products
    const productCounts = {};
    let totalReserved = 0;

    analyticsData.forEach((res) => {
      const name = res.Inventory?.item_name;
      if (name) {
        productCounts[name] = (productCounts[name] || 0) + res.quantity;
        totalReserved += res.quantity;
      }
    });

    const sortedProducts = Object.keys(productCounts)
      .map((name) => ({
        name,
        units: productCounts[name],
        percentage:
          totalReserved > 0
            ? Math.round((productCounts[name] / totalReserved) * 100)
            : 0,
      }))
      .sort((a, b) => b.units - a.units);

    setTopProducts(sortedProducts.slice(0, 5));
  };

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Reservations
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

      // activity ledger recent reservations
      const { data: ActivityData } = await supabase
        .from("Reservation")
        .select("id, created_at, status, Inventory(item_name, item_image)")
        .order("created_at", { ascending: false })
        .limit(5);

      // new added products from inventory
      const { data: arrivalsData } = await supabase
        .from("Inventory")
        .select("id, item_name, price, item_image")
        .order("created_at", { ascending: false })
        .limit(4);

      setRecentActivities(ActivityData || []);
      setNewArrivals(arrivalsData || []);

      // fetch recent reservations with customer data to display in acitivity ledger modal
      const { data: activityData } = await supabase
        .from("Reservation")
        .select("*, Users(email), Inventory(item_name, item_image, brand)")
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: customerData } = await supabase
        .from("Customer")
        .select("user_id, firstname, lastname");
      if (activityData && customerData) {
        const merged = activityData.map((res) => {
          const customer = customerData.find((c) => c.user_id === res.user_id);
          return {
            ...res,
            customer_name: customer
              ? `${customer.firstname} ${customer.lastname}`
              : "Unknown Customer",
            customer_email: res.Users?.email,
          };
        });
        setRecentActivities(merged);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // --- SHEET 1: REVENUE SUMMARY ---
    const revenueExport = revenueData.map((item) => ({
      Date: item.name,
      "Revenue (PHP)": item.revenue,
    }));
    revenueExport.push({ Date: "TOTAL", "Revenue (PHP)": totalRevenue });
    const revSheet = XLSX.utils.json_to_sheet(revenueExport);
    XLSX.utils.book_append_sheet(workbook, revSheet, "Revenue Report");

    // --- SHEET 2: TOP SELLING PRODUCTS ---
    const topProductsExport = topProducts.map((p) => ({
      "Product Name": p.name,
      "Units Sold": p.count,
      "Market Share (%)": p.percentage + "%",
    }));
    const topSheet = XLSX.utils.json_to_sheet(topProductsExport);
    XLSX.utils.book_append_sheet(workbook, topSheet, "Top Products");

    // --- SHEET 3: RECENT ACTIVITY LEDGER ---
    const activityExport = recentActivities.map((act) => ({
      Date: new Date(act.created_at).toLocaleDateString(),
      Customer: act.customer_name,
      Product: act.Inventory?.item_name,
      Quantity: act.quantity,
      Status: act.status,
    }));
    const actSheet = XLSX.utils.json_to_sheet(activityExport);
    XLSX.utils.book_append_sheet(workbook, actSheet, "Activity Ledger");

    // --- SHEET 4: LIVE INVENTORY (NEW ARRIVALS) ---
    const inventoryExport = newArrivals.map((item) => ({
      "Item Name": item.item_name,
      Price: item.price,
      "Date Added": new Date(
        item.created_at || Date.now(),
      ).toLocaleDateString(),
    }));
    const invSheet = XLSX.utils.json_to_sheet(inventoryExport);
    XLSX.utils.book_append_sheet(workbook, invSheet, "New Inventory");

    // --- GENERATE DOWNLOAD ---
    const timestamp = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Alloycast_Dashboard_Report_${timestamp}.xlsx`);

    showToast("Multi-sheet business report exported!", "success");
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
    } catch (err) {
      showToast("Status updated, but email failed to send.", "error");
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
  const handleConfirm = () => {
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
    );
  };

  const handleCancel = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen overflow-x-hidden select-none">
      {/* --- Main Content Canvas --- */}
      <main className="lg:ml-64 pt-24 lg:pt-5 px-6 lg:px-8 pb-12 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 reveal-up">
          <div>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl text-primary-container font-black font-headline tracking-tighter uppercase italic leading-none">
              Admin <span className="text-white/90">Dashboard</span>
            </h3>
          </div>
          <div className="w-full lg:w-auto">
            <button
              onClick={exportToExcel}
              className="w-full lg:w-auto bg-primary-container text-black/90 px-6 py-3 rounded-lg text-[11px] font-headline font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform active:scale-95"
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
            label="Revenue Estimate"
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
            className="lg:col-span-2 bg-surface-container-low p-8 rounded-[4px] border border-outline-variant/10 relative reveal-up"
            style={{ animationDelay: "0.5s" }}
          >
            {/* Updated Header Layout: Responsive stacking */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-10 gap-8">
              {/* 1. Title */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container">
                    insights
                  </span>
                </div>
                <h4 className="text-lg font-black font-headline uppercase tracking-tighter italic text-primary-container">
                  Revenue Analysis
                </h4>
              </div>

              {/* 2. Filter Buttons - Grid 2x2 on mobile, flex on desktop */}
              <div className="w-full xl:w-auto">
                <div className="grid grid-cols-2 2xl:flex items-center bg-surface-container-high/10 p-1 rounded-lg border border-white/5 gap-1">
                  {["Last 7 Days", "This Month", "Last Month", "All Time"].map(
                    (label) => (
                      <button
                        key={label}
                        onClick={() => setDateRange(label)}
                        className={`w-full xl:w-auto px-4 py-2 text-[10px] sm:text-[11px] font-headline font-black uppercase tracking-widest transition-all rounded-[4px] whitespace-nowrap ${
                          dateRange === label
                            ? "bg-primary-container text-black/90 shadow-lg"
                            : "text-on-surface/30 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* 3. Total Revenue */}
              <div className="flex items-center space-x-3 bg-green-500/5 px-5 py-3 border border-green-500/10 rounded-lg w-full xl:w-auto justify-center xl:justify-start">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-headline font-bold uppercase tracking-[0.2em] opacity-40 leading-none mb-1">
                    TOTAL PERIOD REVENUE
                  </span>
                  <span className="text-lg font-black font-headline text-green-500 leading-none">
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
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#ffffff"
                    fontSize={13}
                    tickMargin={10}
                    axisLine={10}
                    tickLine={10}
                  />
                  <YAxis
                    stroke="#ffffff"
                    fontSize={13}
                    axisLine={10}
                    tickLine={10}
                    tickFormatter={(value) => `₱${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#131313",
                      borderColor: "#333",
                      fontSize: "13px",
                      borderRadius: "4px",
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
            </div>
          </div>

          {/* Side Panel: Volume */}
          <div
            className="bg-surface-container-low p-8 rounded-[4px] border border-outline-variant/10 reveal-up h-fit"
            style={{ animationDelay: "0.6s" }}
          >
            <h4 className="text-lg font-black font-headline uppercase tracking-tighter mb-6">
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
                <div className="py-10 text-center opacity-20 text-[10px] font-black uppercase tracking-widest">
                  No Sales Data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div
            className="xl:col-span-3 bg-surface-container-low rounded-[4px] border border-outline-variant/10 overflow-hidden reveal-up"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="text-lg font-black font-headline uppercase tracking-tighter">
                Activity Ledger
              </h4>
              <button
                onClick={() => router.push("/admin/reservations")}
                className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary-container hover:text-secondary-container transition-colors"
              >
                View All Reservations
              </button>
            </div>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-highest/30">
                    <th className="px-6 py-5 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Timestamp
                    </th>
                    <th className="px-6 py-5 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Entity / Item
                    </th>
                    <th className="px-6 py-5 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Action
                    </th>
                    <th className="px-6 py-5 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Status
                    </th>
                    <th className="px-6 py-5 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40 text-right">
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
                            ? "bg-green-500/10 text-green-500"
                            : activity.status === "Pending"
                              ? "bg-primary-container/10 text-primary-container"
                              : "bg-secondary-container/10 text-secondary-container"
                        }
                        refId={`#RES-${String(activity.id).slice(0, 4).toUpperCase()}`}
                        img={activity.Inventory?.item_image}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-10 text-center opacity-20 uppercase text-[10px] font-black tracking-widest"
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
            className="bg-surface-container-low p-6 rounded-[4px] border border-outline-variant/10 reveal-up"
            style={{ animationDelay: "0.8s" }}
          >
            <h4 className="text-sm font-black font-headline uppercase tracking-widest mb-6">
              Live Inventory{" "}
              <span className="text-primary-container ml-2 text-[10px]">
                {newArrivals.length} NEW
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
                <div className="py-10 text-center opacity-20 uppercase text-[10px] font-black tracking-widest">
                  No New Items Added
                </div>
              )}
            </div>
            <button
              onClick={() => router.push("/admin/inventory")}
              className="w-full mt-6 py-3 border border-outline-variant/20 rounded-lg bg-primary-container/70 text-[13px] text-black/90 font-headline font-bold uppercase tracking-widest hover:bg-secondary-container hover:text-white/90 transition-all"
            >
              Manage Inventory
            </button>
          </div>
        </div>
      </main>

      <CriticalStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        items={lowStockProducts}
      />

      {isDetailsModalOpen && activeReservation && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setIsDetailsModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-4xl bg-surface-container-low border border-white/5 p-6 sm:p-10 rounded-lg animate-scale-in max-h-[95vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-primary-container">
                  info
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-headline uppercase italic">
                  Reservation Details
                </h3>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="material-symbols-outlined opacity-40 hover:opacity-100 hover:rotate-90 transition-all p-2"
              >
                close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              {/* Product Side */}
              <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-lg">
                <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                  <img
                    src={activeReservation.Inventory?.item_image}
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                    alt=""
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-container mb-2">
                    Product Info
                  </p>
                  <h4 className="text-xl font-black uppercase italic leading-tight mb-1">
                    {activeReservation.Inventory?.item_name}
                  </h4>
                  <p className="opacity-40 uppercase text-xs font-bold tracking-widest">
                    {activeReservation.Inventory?.brand}
                  </p>
                  <div className="mt-6 flex items-center justify-center sm:justify-start space-x-2">
                    <span className="text-[10px] opacity-40 uppercase font-black">
                      Quantity
                    </span>
                    <span className="text-2xl font-black font-headline tabular-nums leading-none">
                      {activeReservation.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Side */}
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-container mb-6">
                  Customer Information
                </p>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="material-symbols-outlined opacity-20 mt-1 hidden sm:block">
                      person
                    </span>
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest mb-1">
                        Full Name
                      </p>
                      <p className="font-black uppercase text-lg leading-none">
                        {activeReservation.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="material-symbols-outlined opacity-20 mt-1 hidden sm:block">
                      mail
                    </span>
                    <div className="text-center sm:text-left overflow-hidden w-full">
                      <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest mb-1">
                        Email Address
                      </p>
                      <p className="font-mono text-sm break-all">
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
                  className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${
                    activeReservation.status === "Approved"
                      ? "text-green-500 border-green-500/20 bg-green-500/5"
                      : activeReservation.status === "Pending"
                        ? "text-primary-container border-primary-container/20 bg-primary-container/5"
                        : "text-red-500 border-red-500/20 bg-red-500/5"
                  }`}
                >
                  {activeReservation.status} Status
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  disabled={activeReservation.status !== "Pending"}
                  onClick={() =>
                    handleActionClick(activeReservation, "Rejected")
                  }
                  className="w-full sm:w-auto px-10 py-4 bg-white/5 text-red-500 border border-white/10 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-10 disabled:cursor-not-allowed group flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">
                    close
                  </span>
                  <span>Reject Order</span>
                </button>
                <button
                  disabled={activeReservation.status !== "Pending"}
                  onClick={() =>
                    handleActionClick(activeReservation, "Approved")
                  }
                  className="w-full sm:w-auto px-10 py-4 bg-primary-container text-black font-black uppercase text-[11px] tracking-[0.2em] hover:brightness-110 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] transition-all disabled:opacity-20 disabled:cursor-not-allowed group flex items-center justify-center space-x-2"
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
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      <OrderStatusConfirmationModal
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
    className="bg-surface-container-low p-6 rounded-lg border-l-2 border-primary-container relative overflow-hidden group reveal-up hover:cursor-pointer hover:bg-surface-container-highest"
    style={{ animationDelay: delay }}
  >
    <div className="flex justify-between items-start mb-4">
      <span className="material-symbols-outlined text-primary-container">
        {icon}
      </span>
      {badge ? (
        <span className="bg-primary-container/20 text-primary-container text-[8px] px-2 py-0.5 rounded font-bold uppercase">
          {badge}
        </span>
      ) : (
        <span className={`text-[10px] font-headline font-bold ${trendColor}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40 mb-1">
      {label}
    </p>
    <h3 className="text-3xl font-black font-headline tracking-tighter">
      {value}
    </h3>
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <span className="material-symbols-outlined text-8xl">{icon}</span>
    </div>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center space-x-1">
    <div className={`w-3 h-3 ${color} rounded-full`}></div>
    <span className="text-[10px] font-headline font-bold uppercase tracking-widest">
      {label}
    </span>
  </div>
);

const ProgressBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-[10px] font-headline font-bold uppercase tracking-widest opacity-60">
        {label}
      </span>
      <span className="text-[10px] font-headline font-bold text-primary-container">
        {value}
      </span>
    </div>
    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
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
  <tr
    onClick={onClick}
    className="hover:bg-surface-container-highest/20 transition-colors group cursor-pointer"
  >
    <td className="px-6 py-4">
      <p className="text-xs font-mono">{date}</p>
      <p className="text-[10px] opacity-40">{time}</p>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-6 bg-surface-container-highest rounded-[2px] overflow-hidden flex items-center justify-center">
          <img
            className="object-cover w-full h-full transition-all"
            src={img}
            alt=""
          />
        </div>
        <p className="text-xs font-bold font-headline uppercase tracking-tight">
          {item}
        </p>
      </div>
    </td>
    <td className="px-6 py-4 text-[10px] font-headline font-medium uppercase tracking-widest opacity-60">
      {action}
    </td>
    <td className="px-6 py-4">
      <span
        className={`px-2 py-1 rounded-[2px] ${statusColor} text-[8px] font-bold uppercase tracking-widest`}
      >
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right text-[10px] font-mono opacity-40 group-hover:opacity-100 transition-opacity">
      {refId}
    </td>
  </tr>
);

const InventoryItem = ({ name, price, img }) => (
  <div className="flex items-center space-x-4 p-3 bg-surface-container-highest/20 rounded-[4px] group cursor-pointer hover:bg-surface-container-highest transition-all border border-transparent hover:border-primary-container/20">
    <img
      className="w-12 h-12 rounded-[2px] object-cover transition-all"
      src={img}
      alt=""
    />
    <div className="flex-1">
      <p className="text-[13px] font-headline font-bold uppercase tracking-tight truncate">
        {name}
      </p>
      <p className="text-[13px] font-headline text-primary-container font-black tracking-widest uppercase">
        {price}
      </p>
    </div>
  </div>
);
