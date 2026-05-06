"use client";
import { useState, useEffect } from "react";
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
import CriticalStockModal from "../../components/CriticalStockModal";

export default function AdminDashboard() {
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [data, setData] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    revenueEstimate: 0,
    criticalStockCount: 0,
    loading: true,
  });

  // Revenue Graph States
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const supabase = createClient();

  const router = useRouter();

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

    // 2. Fetch Data
    const { data: analyticsData, error } = await supabase
      .from("Reservation")
      .select("quantity, created_at, Inventory(price)")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .neq("status", "Pending")
      .neq("status", "Rejected");

    if (error || !analyticsData) {
      console.error("Error fetching analytics:", error);
      return;
    }

    // 3. Process Revenue
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
  };

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Reservations
      const { data: resData } = await supabase
        .from("Reservation")
        .select("status");

      // 2. Fetch Sales (for revenue)
      // const { data: salesData } = await supabase
      //   .from("Sales")
      //   .select("revenue");
      // 3. Fetch Inventory (for critical stock)
      const { data: invData } = await supabase
        .from("Inventory")
        .select("item_name, item_image, brand, stock, reorder_point");
      setData({
        totalReservations: resData?.length || 0,
        pendingReservations:
          resData?.filter((r) => r.status === "Pending").length || 0,
        // revenueEstimate:
        //   salesData?.reduce((sum, s) => sum + (Number(s.revenue) || 0), 0) || 0,
        criticalStockCount: invData?.filter((i) => i.stock <= 5).length || 0,
        loading: false,
      });

      const criticalItems = invData?.filter((i) => i.stock <= 5) || [];
      setLowStockProducts(criticalItems);

      console.log("All goods!");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen overflow-x-hidden select-none">
      {/* --- Main Content Canvas --- */}
      <main className="lg:ml-64 pt-24 lg:pt-5 px-6 lg:px-8 pb-12 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 reveal-up">
          <div>
            <h3 className="text-4xl sm:text-6xl text-primary-container font-black font-headline tracking-tighter uppercase italic leading-none">
              Admin <span className="text-white/90">Dashboard</span>
            </h3>
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-primary-container text-black/90 px-4 py-2 rounded-lg text-[10px] font-headline font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              <span>Export Data</span>
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
            {/* Updated Header Layout: Title (Left), Filters (Center), Revenue (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 items-center mb-10 gap-6">
              {/* 1. Title (Top Left) */}
              <div className="lg:justify-self-start">
                <h4 className="text-lg font-black font-headline uppercase tracking-tighter italic text-primary-container">
                  Revenue Analysis Graph
                </h4>
              </div>

              {/* 2. Filter Buttons (Top Center) */}
              <div className="max-w-sm lg:justify-self-center flex items-center bg-surface-container-high/10 p-1 rounded-lg border border-white/5 overflow-x-hidden scrollbar-hide">
                {["Last 7 Days", "This Month", "Last Month", "All Time"].map(
                  (label) => (
                    <button
                      key={label}
                      onClick={() => setDateRange(label)}
                      className={`whitespace-nowrap px-3 py-1.5 text-[13px] font-headline font-black uppercase tracking-widest transition-all rounded-[2px] ${
                        dateRange === label
                          ? "bg-primary-container text-black/90 shadow-lg rounded-lg"
                          : "text-on-surface/30 hover:text-white hover:bg-white/5 rounded-lg"
                      }`}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>

              {/* 3. Total Revenue (Top Right) */}
              <div className="lg:justify-self-end flex items-center space-x-2 bg-green-500/5 px-4 py-2 border border-green-500/10 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[11px] font-headline font-bold uppercase tracking-widest opacity-40">
                  TOTAL REVENUE:
                </span>
                <span className="text-[13px] font-black font-headline text-green-500">
                  ₱
                  {totalRevenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-64 w-full relative mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
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
            className="bg-surface-container-low p-8 rounded-[4px] border border-outline-variant/10 reveal-up"
            style={{ animationDelay: "0.6s" }}
          >
            <h4 className="text-lg font-black font-headline uppercase tracking-tighter mb-6">
              Top Brand Volume
            </h4>
            <div className="space-y-6">
              <ProgressBar label="Shelby American" value="42%" />
              <ProgressBar label="Porsche AG" value="28%" />
              <ProgressBar label="Ferrari S.P.A" value="18%" />
              <ProgressBar label="Ford Performance" value="12%" />
            </div>
            <div className="mt-8 p-4 bg-surface-container-highest/20 rounded-[4px] border border-outline-variant/10">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-secondary-container">
                  trending_up
                </span>
                <div>
                  <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/80">
                    Growth Peak
                  </p>
                  <p className="text-[8px] text-on-surface/40 leading-relaxed uppercase">
                    Vintage Muscle segments up 14% this week.
                  </p>
                </div>
              </div>
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
              <button className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary-container hover:text-secondary-container transition-colors">
                View All Archive
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-highest/30">
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Entity / Item
                    </th>
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Action
                    </th>
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40 text-right">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <TableRow
                    date="2023.10.24"
                    time="14:22:01"
                    item="1967 Mustang GT500"
                    action="Inventory Restock"
                    status="Priority"
                    statusColor="bg-secondary-container/10 text-secondary-container"
                    refId="#ARC-5902"
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuCvnfL0yv-UW2-T7Nabl5WAx9WDhSchBQ2ju9m-HEbEtdIHPDi0Q14U_hR6h0UUvMVeweWdCwTJYKytE9v64ihc0LiP-p5GR-O1ByWLsK3OeAbx-BQ_mwbV8ZJ_q-5E9PQ0tVaBiVbQMbu1rjSMn_7c-9K9o18eA5dkGCUfU2Tmj0Wn_fcGyop9Fb5x8Zn5LirHCBQONOUhSjZ9vcNlKxp775T1Jco_QQ2EpMwEJrdAy5NMQzMm--BnYHOF-I7lEIWlFxqzM5_FYUw"
                  />
                  <TableRow
                    date="2023.10.24"
                    time="13:10:45"
                    item="Porsche 911 GT3 RS"
                    action="Order Delivery"
                    status="Complete"
                    statusColor="bg-green-500/10 text-green-500"
                    refId="#ORD-1284"
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuCaQJvoMAucdYmdAY1MkbvHWsUYYf0TTpqG52izUkcXXZj3E8exiAsky5Bqlza1l101KvZAfbsYe3ztUDaTOuW9sudFSrI_4V-MBhmaKB5amnxNRYQU9cRzKSpHXyaaFy4vZIBOKnxRe-ql3rdHcHA64AYdm5ZbxfUXiPnU95V5sZ_JOeFdL0PQaoi5_6m-Uq8OboqcCKShkkuPX1G2y_2_3nTyvgM1e2KmtkLwmSm1_8rMJO9yMIxDCebPsqiK7Z2crfc7bet-rLU"
                  />
                  <TableRow
                    date="2023.10.24"
                    time="09:45:12"
                    item="Ferrari 250 GTO"
                    action="Bid Process"
                    status="Pending"
                    statusColor="bg-primary-container/10 text-primary-container"
                    refId="#BID-8831"
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuCwwpKwF-HxZjdbKsnnEe8r5T5F4ZCENjpQ42K7ftQG61XAnFYzmMjjT_5yj3WKJEFUPcUV4kuEywNsoSxPmBrEoPy-M3wN9cg_QtbKLJtN5sG36zRSf295CbBhI--hN9HVfbfYcH2nIhVkKOCnuUPKRKDIbtLHndboEcL-y_OchXzVsiiTiRA9rc0UhBi7mTGIKgCjMIwmbUBeNL0ppFCUEwBwA_xCJqYb1MYVizcJFTVZrYO_ISdffA0CUZAu-IP_FRFxvlAx-2w"
                  />
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
                14 NEW
              </span>
            </h4>
            <div className="space-y-4">
              <InventoryItem
                name="Ferrari F40 Comp"
                price="$2.45M"
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ4E21lXBurIS_TWCdfOL3rkgZAV8Q_HCvzGktxGs6jRWCzAQMeGTr4aj1eVjl7l_mB8x6M2Ol4jKJk-7ubei34idebYwVoKaf9ZBwpGO7p7nKtweGTsDREJ2RsyqvdHR-Au6iXtJiQXGnXYTXol45bJ4VSK4GPXoup5TXjGLOBiSOsgQhOlmSHBe6XdfpNEqDWUvR7Ay1pcCnaFvM0ZNZ1QULJhZ5As6xOuafgQ3rUICZETKcs1ng_zOfulAipRuvNB1QV7I49hc"
              />
              <InventoryItem
                name="Porsche 911 Singer"
                price="$1.85M"
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuAhTnncqNeHV29ytKg7N8n0hCB20gPaVNwCqaugA2N9Yl5CQFJ8z4LlVLRhAHzi3U-8moB8L-c05Bv9dDz2v3i7ee_coSItfNJHYdFu2HJUZmTU6k0EBVUXbPy-SiQPcE4-r0hySdIoSP6XOpBuAG9ODy2k-7HUVhUcdHF8UqeMHKbrWocUl7TJlYrEN6O3cfyY5DbRykaoXEfscvYlmdCset2ruMOb6sJA-qqwdvnfIIl0HjfIRgG6zhhAr__zMQPnCymQ5IjlQ0U"
              />
              <InventoryItem
                name="AC Cobra 427 S/C"
                price="$1.10M"
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuADCCjlhQRddil5lw4UtXaD4aEdI0SpHODnwQv4wUwNCusIrAU7vK9MRawdsiM56fMHyDM-Ll6vnNlWiZ6lboalxgzMxpgdOuoOwYnC36qybnBXUGamCVgyHLnI58bxfK6jj1_IS8-uSc3N6VKR1QxksGkmRvYbORLI3DMrjxpYk-YxUKWlk-toiwiC23RibNYA3lc5mEtpT_gnhW6kQK7X2fSZDmJifzzdQ9tC3W8Kf3DDUrbScO5bMbaEuonKkbpH3_ZcjE2f0Fs"
              />
            </div>
            <button className="w-full mt-6 py-3 border border-outline-variant/20 rounded-[4px] text-[10px] font-headline font-bold uppercase tracking-widest hover:bg-surface-container-highest hover:border-primary-container/20 transition-all">
              Manage Stock Vault
            </button>
          </div>
        </div>
      </main>

      {/* Contextual FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-black/90 rounded-[4px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-3xl">add</span>
        <span className="absolute right-full mr-4 bg-primary-container text-black/90 text-[10px] font-headline font-bold uppercase tracking-widest px-3 py-1 rounded-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Launch New Batch Listing
        </span>
      </button>
      <CriticalStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        items={lowStockProducts}
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
}) => (
  <tr className="hover:bg-surface-container-highest/20 transition-colors group cursor-pointer">
    <td className="px-6 py-4">
      <p className="text-xs font-mono">{date}</p>
      <p className="text-[10px] opacity-40">{time}</p>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-6 bg-surface-container-highest rounded-[2px] overflow-hidden flex items-center justify-center">
          <img
            className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all"
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
      className="w-12 h-12 rounded-[2px] object-cover filter grayscale group-hover:grayscale-0 transition-all"
      src={img}
      alt=""
    />
    <div className="flex-1">
      <p className="text-[10px] font-headline font-bold uppercase tracking-tight truncate">
        {name}
      </p>
      <p className="text-[9px] font-headline text-primary-container font-black tracking-widest uppercase">
        {price}
      </p>
    </div>
    <span className="material-symbols-outlined text-on-surface/20 group-hover:text-primary-container transition-colors text-sm">
      arrow_forward_ios
    </span>
  </div>
);
