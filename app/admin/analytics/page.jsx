"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dynamic from "next/dynamic";
import { getDateBounds } from "../../../utils/dateBounds";
import {
  calculateChannelRevenues,
  aggregateRevenueChartData,
  computeProductStats,
  aggregateBrandMarketShare,
  aggregatePipelineCounts,
} from "../../../helpers/analyticsHelpers";
import { exportAnnualRevenueToCSV } from "../../../helpers/exportCSVAdminAnalytics";

const DynamicToast = dynamic(() => import("../../components/Toast"));

const supabase = createClient();

// for market share by brands
const BRAND_COLORS = [
  "#10B981", // Green/Emerald (Graph Segment)
  "#3B82F6", // Blue
  "#A78BFA", // Violet
  "#F472B6", // Pink
  "#06B6D4", // Cyan
];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [lowProducts, setLowProducts] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [posRevenue, setPosRevenue] = useState(0);
  const [approvedReservationRevenue, setApprovedReservationRevenue] =
    useState(0);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });
  const [pipelineCounts, setPipelineCounts] = useState({
    Pending: 0,
    Approved: 0,
    Declined: 0,
    Cancelled: 0,
  });

  const showToast = useCallback((message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  }, []);

  // Refactored fetchAllANALytics
  const fetchAllAnalytics = useCallback(async () => {
    try {
      // Reuse utility to get date boundaries
      const { startDate, endDate } = getDateBounds(dateRange);

      // Fetch Reservation Data
      const { data: reservationData, error: reservationError } = await supabase
        .from("Reservation")
        .select(
          "quantity, created_at, status, Inventory(item_name, brand, price)",
        )
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (reservationError) throw reservationError;

      // Fetch POS Data
      const { data: posData, error: posError } = await supabase
        .from("POS")
        .select("quantity, created_at, Inventory(price)")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (posError) throw posError;

      const safeReservations = reservationData || [];
      const safePOS = posData || [];

      // Calculate in-store vs booking revenues
      const {
        posRevenue: calculatedPOS,
        approvedReservationRevenue: calculatedApproved,
      } = calculateChannelRevenues(safePOS, safeReservations);
      setPosRevenue(calculatedPOS);
      setApprovedReservationRevenue(calculatedApproved);

      // Aggregate revenue and chart points
      const { totalRevenue: calculatedTotal, chartData } =
        aggregateRevenueChartData(safePOS, dateRange);
      setTotalRevenue(calculatedTotal);
      setRevenueData(chartData);

      // Process product statistics (Top 6 / Low 6)
      const { topProducts: tops, lowProducts: lows } = computeProductStats(
        safeReservations,
        6,
      );
      setTopProducts(tops);
      setLowProducts(lows);

      // Compute market share brand distribution
      const brandDistribution = aggregateBrandMarketShare(
        safeReservations,
        BRAND_COLORS,
      );
      setTopBrands(brandDistribution);

      // Compute status pipeline counters
      const pipelines = aggregatePipelineCounts(safeReservations);
      setPipelineCounts(pipelines);
    } catch (err) {
      console.error("Error fetching analytics: ", err);
      showToast("Error getting analytics data", "error");
    } finally {
      setLoading(false);
    }
  }, [dateRange, showToast]);

  const exportAnnualRevenue = useCallback(async () => {
    try {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, 0, 1).toISOString();
      const endDate = new Date(currentYear, 11, 31, 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from("POS")
        .select("quantity, created_at, Inventory(price)")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      if (error) throw error;
      exportAnnualRevenueToCSV(data || [], currentYear);
    } catch (err) {
      showToast("Failed to export data. Try again later", "error");
      console.error("Failed to export data: ", err);
    }
  }, [showToast]);

  // 5. Run effects when date filters or callback references change
  useEffect(() => {
    const initializeFunction = async () => {
      fetchAllAnalytics();
    };
    initializeFunction();
  }, [dateRange, fetchAllAnalytics]);

  return (
    <div className="text-font-color min-h-screen font-body relative overflow-x-hidden selection:bg-primary-container selection:text-white">
      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      {/* --- Main Content --- */}
      <main className="pl-0 lg:pl-[var(--sidebar-width)] ml-5 pt-24 lg:pt-5 px-6 lg:px-8 pb-12 min-h-screen transition-all duration-300">
        <div className="space-y-4 flex flex-col md:flex-row md:justify-between md:items-end">
          <div>
            <h3 className="text-4xl sm:text-6xl text-font-color font-black font-headline tracking-tighter uppercase italic leading-none">
              ANALYTICS
            </h3>
            <div className="flex items-center gap-3">
              <span className="bg-primary-container text-black/90 px-3 py-1 text-sm font-mono font-bold rounded-lg uppercase tracking-widest drop-shadow-lg/50">
                ANALYSIS REPORT
              </span>
            </div>
          </div>
          <div className="relative group">
            <button
              onClick={exportAnnualRevenue}
              className="flex items-center gap-3 bg-primary-container shadow-lg/30 px-6 py-3 border border-white/5 text-black/90  font-bold text-md uppercase tracking-widest hover:scale-105 transition-all rounded-lg group relative overflow-hidden"
            >
              <span className="material-symbols-outlined text-lg">
                download
              </span>
              <span>Export Annual Revenue</span>
            </button>
          </div>
        </div>
        {/* Sticky Date Range Control */}
        <div className="sticky mt-5 z-30 bg-secondary-container backdrop-blur-xl border-b border-white/5 px-10 py-5 flex flex-wrap items-center justify-center gap-6 reveal-up rounded-lg shadow-lg/30">
          <div className="grid grid-cols-2 gap-1 2xl:flex items-center p-1 rounded-lg border border-primary-container">
            {["Last 7 Days", "This Month", "Last Month", "Annual"].map(
              (label) => (
                <button
                  key={label}
                  onClick={() => setDateRange(label)}
                  className={`w-full 2xl:w-auto px-4 py-2 text-sm font-headline font-black uppercase tracking-widest transition-all rounded-md ${
                    dateRange === label
                      ? "bg-primary-container text-black/90 shadow-lg"
                      : "text-white/90 opacity-80 hover:opacity-100"
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>
        <div className="pt-5 space-y-8 max-w-[1600px] mx-auto">
          {loading ? (
             <div className="space-y-8">
               <div className="h-[450px] w-full bg-secondary-container/50 animate-pulse rounded-lg relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[400px] bg-secondary-container/50 animate-pulse rounded-lg relative overflow-hidden"></div>
                  <div className="h-[400px] bg-secondary-container/50 animate-pulse rounded-lg relative overflow-hidden"></div>
               </div>
             </div>
          ) : (
          <>
          {/* Revenue Analysis */}
          <section className="bg-input-field  rounded-lg shadow-lg/30 p-4 reveal-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-6">
              <h3 className="font-headline font-black text-3xl  text-white/90 uppercase tracking-tighter italic">
                Revenue Analysis Graph
              </h3>
              <div className="flex gap-3 items-center">
                <LegendItem
                  dotColor="bg-primary-container"
                  label="TOTAL REVENUE"
                  value={`₱${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  valueColor="text-green-500"
                />
                <span
                  title="Actual sales from POS. Potential reservation revenue is shown separately as 'Potential Revenue (Approved)'"
                  className="material-symbols-outlined ml-2 text-sm"
                  aria-hidden
                >
                  info
                </span>
              </div>
            </div>

            <div className="h-[350px] w-full relative mt-8 ">
              {revenueData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/50 text-xl font-headline font-black uppercase tracking-widest italic">
                    No data for {dateRange.toLowerCase()}
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#22C55E"
                          stopOpacity={0.3}
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
                      tickMargin={11}
                    />
                    <YAxis
                      stroke="#ffffff"
                      fontSize={12}
                      tickFormatter={(value) => `₱${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#131313",
                        borderColor: "#333",
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
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Reserved Products */}
            <section
              className="bg-secondary-container shadow-lg/30 rounded-lg p-8 reveal-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="font-headline font-black text-2xl text-white/90 uppercase tracking-tighter mb-10 italic">
                Top Selling Products
              </h3>
              <div className="space-y-6">
                {topProducts.map((topProduct, index) => (
                  <div key={topProduct.name} className="space-y-3 group">
                    <div className="flex justify-between text-sm text-white/90   font-black uppercase tracking-widest">
                      <span className="group-hover:scale-105 transition-colors">
                        {topProduct.name}
                      </span>
                      <span className=" text-primary-container tabular-nums">
                        {topProduct.units} ORDERS
                      </span>
                    </div>
                    <div className="h-2 w-full  rounded-full overflow-hidden border border-white/5 relative">
                      <div
                        className="h-full bg-primary-container transition-all duration-1000"
                        style={{
                          width: `${topProduct.percentage}%`,
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Low Selling Products */}
            <section
              className="bg-secondary-container shadow-lg/30 rounded-lg p-8 reveal-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="font-headline font-black text-white/90 text-2xl uppercase tracking-tighter mb-10 italic">
                Low Selling Products
              </h3>
              <div className="space-y-6">
                {lowProducts.map((lowProducts, index) => (
                  <div key={lowProducts.name} className="space-y-3 group">
                    <div className="flex justify-between text-sm text-white/90 font-black uppercase tracking-widest">
                      <span className="group-hover:scale-105 transition-colors">
                        {lowProducts.name}
                      </span>
                      <span className=" text-primary-container tabular-nums">
                        {lowProducts.units} ORDERS
                      </span>
                    </div>
                    <div className="h-2 w-full  rounded-full overflow-hidden border border-white/5 relative">
                      <div
                        className="h-full bg-red-500 transition-all duration-1000"
                        style={{
                          width: `${lowProducts.percentage}%`,
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Market Share by Brand */}
            <section
              className="bg-secondary-container  rounded-lg p-8 reveal-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="font-headline font-black text-2xl text-white/90 uppercase tracking-tighter mb-10 italic">
                Market Share by Brand
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative w-72 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topBrands}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="units"
                        stroke="black"
                      >
                        {topBrands.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-7xl font-headline font-black text-white/90  tracking-tighter">
                      {topBrands.reduce(
                        (sum, brand) => sum + (brand.units || 0),
                        0,
                      )}
                    </span>
                    <span className="text-xs font-black  text-white/80 uppercase tracking-[0.2em] leading-none mt-2">
                      TOTAL ORDERS
                    </span>
                  </div>
                </div>

                {/* Dynamic Legend List */}
                <div className="flex-1 w-full space-y-4">
                  {topBrands.map((brand, index) => (
                    <BrandLegendItem
                      key={brand.name}
                      color={
                        index === 0
                          ? "#10B981"
                          : BRAND_COLORS[index % BRAND_COLORS.length]
                      }
                      label={brand.name}
                      percentage={`${brand.percentage}%`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Fulfillment Pipeline */}
            <section
              className="bg-secondary-container shadow-lg/30  rounded-lg p-8 reveal-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="font-headline font-black text-2xl text-white/90 uppercase tracking-tighter mb-10 italic">
                Fulfillment Pipeline
              </h3>
              <div className="h-14 w-full flex rounded-lg overflow-hidden mb-10 border border-white/5 p-1 bg-black/40">
                {(() => {
                  const total =
                    pipelineCounts.Pending +
                    pipelineCounts.Approved +
                    pipelineCounts.Declined +
                    pipelineCounts.Cancelled;
                  if (total === 0)
                    return (
                      <PipelineSegment
                        color="bg-white/10"
                        percentage="100%"
                        label="No Data"
                      />
                    );
                  return (
                    <>
                      <PipelineSegment
                        color="bg-blue-500"
                        percentage={`${Math.round((pipelineCounts.Pending / total) * 100)}%`}
                        label={`${Math.round((pipelineCounts.Pending / total) * 100)}%`}
                      />
                      <PipelineSegment
                        color="bg-emerald-500"
                        percentage={`${Math.round((pipelineCounts.Approved / total) * 100)}%`}
                        label={`${Math.round((pipelineCounts.Approved / total) * 100)}%`}
                      />
                      <PipelineSegment
                        color="bg-rose-500"
                        percentage={`${Math.round((pipelineCounts.Declined / total) * 100)}%`}
                        label={`${Math.round((pipelineCounts.Declined / total) * 100)}%`}
                      />
                      <PipelineSegment
                        color="bg-slate-500"
                        percentage={`${Math.round((pipelineCounts.Cancelled / total) * 100)}%`}
                        label={`${Math.round((pipelineCounts.Cancelled / total) * 100)}%`}
                      />
                    </>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <StatusCard
                  border="border-blue-500"
                  label="Pending"
                  count={pipelineCounts.Pending}
                />
                <StatusCard
                  border="border-emerald-500"
                  label="Approved"
                  count={pipelineCounts.Approved}
                />
                <StatusCard
                  border="border-rose-500"
                  label="Declined"
                  count={pipelineCounts.Declined}
                />
                <StatusCard
                  border="border-slate-500"
                  label="Cancelled"
                  count={pipelineCounts.Cancelled}
                />
              </div>
            </section>
            {/* Revenue Channels Comparison */}
            <section
              className="bg-secondary-container shadow-lg/30 rounded-lg p-8 reveal-up"
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="font-headline font-black text-2xl text-white/90 uppercase tracking-tighter mb-10 italic">
                POS and Reservations Revenue Comparison
              </h3>

              {(() => {
                const totalChannelRev = posRevenue + approvedReservationRevenue;
                const posPercent =
                  totalChannelRev > 0
                    ? Math.round((posRevenue / totalChannelRev) * 100)
                    : 0;
                const resPercent =
                  totalChannelRev > 0
                    ? Math.round(
                        (approvedReservationRevenue / totalChannelRev) * 100,
                      )
                    : 0;

                return (
                  <>
                    {/* Split Progress Bar */}
                    <div className="h-14 w-full flex rounded-lg overflow-hidden mb-10 border border-white/5 p-1 bg-black/40">
                      {totalChannelRev === 0 ? (
                        <PipelineSegment
                          color="bg-white/10"
                          percentage="100%"
                          label="No Revenue"
                        />
                      ) : (
                        <>
                          {posPercent > 0 && (
                            <PipelineSegment
                              color="bg-green-400"
                              percentage={`${posPercent}%`}
                              label={`${posPercent}%`}
                            />
                          )}
                          {resPercent > 0 && (
                            <PipelineSegment
                              color="bg-slate-500"
                              percentage={`${resPercent}%`}
                              label={`${resPercent}%`}
                            />
                          )}
                        </>
                      )}
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 bg-white/[0.01] rounded-[2px] border-l-[3px] border-emerald-500 group hover:bg-white/[0.03] transition-all cursor-pointer">
                        <span className="block text-sm font-black text-white/90 uppercase tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">
                          In-Store (POS)
                        </span>
                        <span className="text-[40px]  font-headline font-black text-green-400 italic truncate block">
                          ₱
                          {posRevenue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="p-5 bg-white/[0.01] rounded-[2px] border-l-[3px] border-slate-500 group hover:bg-white/[0.03] transition-all cursor-pointer">
                        <span className="block text-xs font-black text-white/90 uppercase tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">
                          Potential Revenue{" "}
                          <span className="text-green-400">(Approved)</span>
                        </span>
                        <span className="text-[40px]  font-headline font-black text-white/90 italic truncate block">
                          ₱
                          {approvedReservationRevenue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </section>
          </div>
          </>
          )}
        </div>
      </main>
    </div>
  );
}

const LegendItem = ({ dotColor, label, value, valueColor }) => (
  <div className="flex flex-col items-end bg-primary-container/10 p-2 rounded-lg">
    <div className="flex items-center gap-3 mb-2">
      <span
        className={`w-2.5 h-2.5 ${dotColor} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
      ></span>
      <span className="text-xs text-white/90 font-black uppercase tracking-[0.2em] text-on-surface/30">
        {label}
      </span>
    </div>
    <span
      className={`font-headline font-black text-3xl ${valueColor}  italic tracking-tight`}
    >
      {value}
    </span>
  </div>
);

const BrandLegendItem = ({ color, label, percentage }) => (
  <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest group cursor-pointer">
    <div
      className="w-4 h-4 rounded-[2px] shadow-sm transition-transform group-hover:scale-125"
      style={{ backgroundColor: color }}
    ></div>
    <span className="flex-1 text-white/90 text-xl  transition-colors">
      {label}
    </span>
    <span className="font-mono text-primary-container text-xl  tabular-nums transition-colors">
      {percentage}
    </span>
  </div>
);

const PipelineSegment = ({ color, percentage, label }) => (
  <div
    className={`h-full ${color} flex items-center justify-center text-md font-black text-white/90  uppercase tracking-widest transition-all hover:brightness-110 cursor-pointer rounded-md border-r border-black/10`}
    style={{ width: percentage }}
  >
    {label}
  </div>
);

const StatusCard = ({ border, label, count }) => (
  <div
    className={`p-5 bg-white/[0.01] rounded-[2px] border-l-[3px] ${border} group hover:bg-white/[0.03] transition-all cursor-pointer`}
  >
    <span className="block text-[9px] lg:text-sm font-black text-white/90 uppercase tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">
      {label}
    </span>
    <span className="text-[50px] font-headline font-black text-primary-container italic ">
      {count}{" "}
    </span>
    <span className="text-md font-bold text-white/90 group-hover:opacity-40 tabular-nums ml-1 NOT-ITALIC">
      ORDERS
    </span>
  </div>
);
