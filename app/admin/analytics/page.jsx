"use client";
import React, { useState, useEffect } from "react";
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

const DynamicToast = dynamic(() => import("../../components/Toast"));

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [criticalStock, setCriticalStock] = useState([]);
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
    Rejected: 0,
    Cancelled: 0,
  });

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 4000);
  };

  // for market share by brands
  const BRAND_COLORS = [
    "#10B981", // Green/Emerald (Graph Segment)
    "#3B82F6", // Blue
    "#A78BFA", // Violet
    "#F472B6", // Pink
    "#06B6D4", // Cyan
  ];

  const supabase = createClient();

  // --- Master Analytics Fetcher ---
  useEffect(() => {
    const fetchAllAnalytics = async () => {
      // 1. Calculate Date Bounds based on filter button
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
        case "Annual":
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // 2. Fetch Data from Supabase matching the date range
      const { data, error } = await supabase
        .from("Reservation")
        .select(
          "quantity, created_at, status, Inventory(item_name, brand, price)",
        )
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error || !data) {
        console.error("Error fetching analytics:", error);
        return;
      }

      // Fetch POS
      const { data: posData, error: posError } = await supabase
        .from("POS")
        .select("quantity, created_at, Inventory(price)")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (posError) {
        showToast("Error fetching POS data:", posError);
      }

      // calculate POS revenue
      let totalPosRevenue = 0;
      if (posData) {
        posData.forEach((item) => {
          if (item.Inventory?.price) {
            totalPosRevenue += item.quantity * item.Inventory.price;
          }
        });
      }
      setPosRevenue(totalPosRevenue);

      // calculate approved reservation revenue
      let totalApprovedRvenue = 0;
      data.forEach((res) => {
        if (res.Inventory?.price && res.status === "Approved") {
          totalApprovedRvenue += res.quantity * res.Inventory?.price;
        }
      });
      setApprovedReservationRevenue(totalApprovedRvenue);

      // 3. Process Revenue
      const aggregatedRevenue = {};
      let sumRev = 0;
      if (posData) {
        posData.forEach((res) => {
          if (res.Inventory?.price) {
            const rev = res.quantity * res.Inventory.price;
            sumRev += rev;

            let groupKey;
            if (dateRange === "Annual") {
              // Group by month (YYYY-MM)
              const dateObj = new Date(res.created_at);
              groupKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
            } else {
              // Group by day (YYYY-MM-DD)
              groupKey = res.created_at.split("T")[0];
            }
            aggregatedRevenue[groupKey] =
              (aggregatedRevenue[groupKey] || 0) + rev;
          }
        });
      }
      setTotalRevenue(sumRev);

      const chartData = Object.keys(aggregatedRevenue)
        .sort((a, b) => new Date(a) - new Date(b))
        .map((key) => {
          if (dateRange === "Annual") {
            const [year, month] = key.split("-");
            return {
              name: new Date(year, month - 1).toLocaleDateString("en-US", {
                month: "short",
              }),
              revenue: aggregatedRevenue[key],
            };
          } else {
            return {
              name: new Date(key).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              }),
              revenue: aggregatedRevenue[key],
            };
          }
        });

      // For Annual, ensure all 12 months exist so the graph spans Jan-Dec
      if (dateRange === "Annual") {
        const fullYearData = [];
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 12; i++) {
          const monthName = new Date(currentYear, i).toLocaleDateString(
            "en-US",
            {
              month: "short",
            },
          );
          const existing = chartData.find((d) => d.name === monthName);
          fullYearData.push(existing || { name: monthName, revenue: 0 });
        }
        setRevenueData(fullYearData);
      } else {
        setRevenueData(chartData);
      }

      // 4. Process Top and Low Products
      const productCounts = {};
      let totalReserved = 0;
      data.forEach((res) => {
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

      setTopProducts(sortedProducts.slice(0, 6)); // Highest 6
      setLowProducts([...sortedProducts].reverse().slice(0, 6)); // Lowest 6

      // 5. Process Market Share by Brand
      const brandCounts = {};
      let brandTotal = 0;
      data.forEach((res) => {
        const brand = res.Inventory?.brand;
        if (brand) {
          brandCounts[brand] = (brandCounts[brand] || 0) + res.quantity;
          brandTotal += res.quantity;
        }
      });
      const sortedBrands = Object.keys(brandCounts)
        .map((brand, index) => ({
          name: brand,
          units: brandCounts[brand],
          percentage:
            brandTotal > 0
              ? Math.round((brandCounts[brand] / brandTotal) * 100)
              : 0,
          color: BRAND_COLORS[index % BRAND_COLORS.length],
        }))
        .sort((a, b) => b.units - a.units);

      const statusCounts = {
        Pending: 0,
        Approved: 0,
        Rejected: 0,
        Cancelled: 0,
      };
      data.forEach((res) => {
        const status = res.status || "Pending";
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status] += 1;
        }
      });
      setPipelineCounts(statusCounts);
      setTopBrands(sortedBrands);
    };

    fetchAllAnalytics();
  }, [dateRange]);

  const ExportTotalAnnualRevenue = async () => {
    try {
      const currentYear = new Date().getFullYear(); // Current Year
      const startDate = new Date(currentYear, 0, 1).toISOString(); // January
      const endDate = new Date(currentYear, 11, 31, 23, 59, 59).toISOString(); // December

      // fetch approved reservations for current year
      const { data, error } = await supabase
        .from("Reservation")
        .select("quantity, created_at, status, Inventory(price)")
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .eq("status", "Approved");

      if (error) throw error;

      // creates array for each month, total of 12 months, 0 = January
      const monthlyRevenue = Array(12).fill(0);
      let annualTotal = 0;

      // revenue per month calculation
      data.forEach((res) => {
        if (res.Inventory?.price) {
          const revenue = res.quantity * res.Inventory.price;
          const monthIndex = new Date(res.created_at).getMonth();
          monthlyRevenue[monthIndex] += revenue; // adds result to specific MONTH
          annualTotal += revenue; // adds same revenue grand total for YEAR
        }
      });

      // format to data Excel
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // build tabular data string
      let csvContent = "Month, Total Revenue (PHP)\n"; // header row for excel file
      monthNames.forEach((month, index) => {
        csvContent += `${month},${monthlyRevenue[index]}\n`; // Appends a new row for each month
      });

      // grand total for year
      csvContent += `\nTOTAL ANNUAL REVENUE,${annualTotal}\n`;

      // file download trigger
      // converts to physical excel file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      // to download file
      link.setAttribute("download", `Annual_Revenue_Report_${currentYear}.csv`);
      document.body.appendChild(link);
      link.click(); // clicks the button
      document.body.removeChild(link); //cleans up link
    } catch (err) {
      showToast("Failed to export data. Try again later");
      console.error("Failed to export data:", err);
    }
  };

  return (
    <div className="bg-background text-font-color min-h-screen font-body relative overflow-x-hidden selection:bg-primary-container selection:text-white">
      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      {/* --- Main Content --- */}
      <main className="lg:ml-64 pt-28 lg:pt-10 min-h-screen ">
        <div className="space-y-4 px-10 flex flex-col md:flex-row md:justify-between md:items-end">
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
              onClick={ExportTotalAnnualRevenue}
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
        <div className="sticky mt-5 z-30 bg-secondary-container backdrop-blur-xl border-b border-white/5 px-10 py-5 flex flex-wrap items-center justify-center gap-6 reveal-up shadow-lg/30">
          <div className="flex items-center  p-1 rounded-lg border border-primary-container">
            {["Last 7 Days", "This Month", "Last Month", "Annual"].map(
              (label) => (
                <button
                  key={label}
                  onClick={() => setDateRange(label)}
                  className={`px-4 py-2 text-sm font-headline font-black uppercase tracking-widest transition-all rounded-md ${
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

        <div className="p-10 space-y-8 max-w-[1600px] mx-auto">
          {/* Revenue Analysis */}
          <section className="bg-input-field  rounded-lg shadow-lg/30 p-4 reveal-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-6">
              <h3 className="font-headline font-black text-3xl  text-white/90 uppercase tracking-tighter italic">
                Revenue Analysis Graph
              </h3>
              <div className="flex gap-10">
                <LegendItem
                  dotColor="bg-secondary-container"
                  label="TOTAL REVENUE"
                  value={`₱${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  valueColor="text-green-500"
                />
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
                    pipelineCounts.Rejected +
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
                        percentage={`${Math.round((pipelineCounts.Rejected / total) * 100)}%`}
                        label={`${Math.round((pipelineCounts.Rejected / total) * 100)}%`}
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
                  label="Rejected"
                  count={pipelineCounts.Rejected}
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
                        <span className="text-[40px] sm:text-[50px] font-headline font-black text-green-400 italic truncate block">
                          ₱
                          {posRevenue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="p-5 bg-white/[0.01] rounded-[2px] border-l-[3px] border-slate-500 group hover:bg-white/[0.03] transition-all cursor-pointer">
                        <span className="block text-xs font-black text-white/90 uppercase tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">
                          Potential Revenue (Approved)
                        </span>
                        <span className="text-[40px] sm:text-[50px] font-headline font-black text-white/90 italic truncate block">
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
    className={`h-full ${color} flex items-center justify-center text-md font-black text-white/90 uppercase tracking-widest transition-all hover:brightness-110 cursor-pointer rounded-md border-r border-black/10`}
    style={{ width: percentage }}
  >
    {label}
  </div>
);

const StatusCard = ({ border, label, count }) => (
  <div
    className={`p-5 bg-white/[0.01] rounded-[2px] border-l-[3px] ${border} group hover:bg-white/[0.03] transition-all cursor-pointer`}
  >
    <span className="block text-xs font-black text-white/90 uppercase tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">
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

const HeatBox = ({ opacity }) => (
  <div
    className="w-2.5 h-2.5 bg-primary-container rounded-sm shadow-sm"
    style={{ opacity }}
  ></div>
);
