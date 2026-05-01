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

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [criticalStock, setCriticalStock] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [lowProducts, setLowProducts] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [pipelineCounts, setPipelineCounts] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0,
    Cancelled: 0,
  });

  // for market share by brands
  const BRAND_COLORS = [
    "#C8102E",
    "#1446A0",
    "#2D6A4F",
    "#6B21A8",
    "#92400E",
    "#333333",
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
        case "Last 30 Days":
          startDate.setDate(now.getDate() - 30);
          break;
        case "This Month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "Last Month":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
          break;
        case "All Time":
          startDate = new Date(0); // Year 1970
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

      // 3. Process Revenue
      const dailyRevenue = {};
      let sumRev = 0;
      data.forEach((res) => {
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

  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-x-hidden selection:bg-primary-container selection:text-white">
      {/* --- Main Content --- */}
      <main className="lg:ml-64 pt-28 lg:pt-10 min-h-screen ">
        <div className="space-y-4 px-10 flex flex-col md:flex-row md:justify-between md:items-end">
          <div>
            <h3 className="text-4xl sm:text-6xl text-primary-container font-black font-headline tracking-tighter uppercase italic leading-none">
              ANALYTICS
            </h3>
            <div className="flex items-center gap-3">
              <span className="bg-surface-container-high/60 text-white/90 px-3 py-1 text-[13px] font-mono font-bold border border-white/5 uppercase tracking-widest">
                ANALYSIS REPORT
              </span>
            </div>
          </div>
          {/* --- Google Analytics External Button --- */}
          <a
            href="https://analytics.google.com/analytics/web/?authuser=2#/a392602547p534661399/reports/intelligenthome?params=_u..nav%3Dmaui"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary-container p-3 border rounded-lg font-bold text-sm text-black/90 uppercase tracking-widest  hover:bg-secondary-container   transition-all  group relative overflow-hidden mt-6 md:mt-0"
          >
            <span className="material-symbols-outlined text-lg  group-hover:text-primary-container group-hover:opacity-100 transition-all">
              monitoring
            </span>
            <span className="hover:text-white/90 text-xs">
              Open Google Analytics
            </span>
          </a>
        </div>

        {/* Sticky Date Range Control */}
        <div className="sticky mt-5 z-30 bg-[#131313]/90 backdrop-blur-xl border-b border-white/5 px-10 py-5 flex flex-wrap items-center justify-center gap-6 reveal-up">
          <div className="flex items-center bg-surface-container-high/20 p-1 rounded-[2px] border border-white/5">
            {[
              "Last 7 Days",
              "Last 30 Days",
              "This Month",
              "Last Month",
              "All Time",
            ].map((label) => (
              <button
                key={label}
                onClick={() => setDateRange(label)}
                className={`px-4 py-2 text-sm font-headline font-black uppercase tracking-widest transition-all rounded-[1px] ${
                  dateRange === label
                    ? "bg-primary-container text-black/90 shadow-lg"
                    : "text-on-surface/30 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-10 space-y-8 max-w-[1600px] mx-auto">
          {/* Revenue Analysis */}
          <section className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <h3 className="font-headline font-black text-3xl uppercase tracking-tighter italic">
                  Revenue Analysis
                </h3>
              </div>
              <div className="flex gap-10">
                <LegendItem
                  dotColor="bg-green-500"
                  label="TOTAL REVENUE"
                  value={`₱${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  valueColor="text-green-500"
                />
              </div>
            </div>

            <div className="h-[350px] w-full relative mt-8 ">
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
                    fontSize={10}
                    tickMargin={10}
                  />
                  <YAxis
                    stroke="#ffffff"
                    fontSize={10}
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
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Reserved Products */}
            <section
              className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-10 italic">
                Top Selling Products
              </h3>
              <div className="space-y-6">
                {topProducts.map((topProduct, index) => (
                  <div key={topProduct.name} className="space-y-3 group">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="group-hover:text-primary-container transition-colors">
                        {topProduct.name}
                      </span>
                      <span className="font-mono text-primary-container tabular-nums">
                        {topProduct.units} ORDERS
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/5 relative">
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
              className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-10 italic">
                Low Selling Products
              </h3>
              <div className="space-y-6">
                {lowProducts.map((lowProducts, index) => (
                  <div key={lowProducts.name} className="space-y-3 group">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="group-hover:text-primary-container transition-colors">
                        {lowProducts.name}
                      </span>
                      <span className="font-mono text-primary-container tabular-nums">
                        {lowProducts.units} ORDERS
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/5 relative">
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
              className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-10 italic">
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
                        stroke="none"
                      >
                        {topBrands.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#131313",
                          borderColor: "#333",
                          color: "white",
                        }}
                        itemStyle={{ color: "white" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-7xl  font-headline font-black text-white/90 tracking-tighter">
                      {topBrands.reduce(
                        (sum, brand) => sum + (brand.units || 0),
                        0,
                      )}
                    </span>
                    <span className="text-xs font-black  text-white/70 uppercase tracking-[0.2em] leading-none mt-2">
                      TOTAL ORDERS
                    </span>
                  </div>
                </div>

                {/* Dynamic Legend List */}
                <div className="flex-1 w-full space-y-4">
                  {topBrands.map((brand, index) => (
                    <BrandLegendItem
                      key={brand.name}
                      color={BRAND_COLORS[index % BRAND_COLORS.length]}
                      label={brand.name}
                      percentage={`${brand.percentage}%`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Fulfillment Pipeline */}
            <section
              className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-10 italic">
                Fulfillment Pipeline
              </h3>
              <div className="h-14 w-full flex rounded-[2px] overflow-hidden mb-10 border border-white/5 p-1 bg-black/40">
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
                        color="bg-secondary-container"
                        percentage={`${Math.round((pipelineCounts.Pending / total) * 100)}%`}
                        label={`${Math.round((pipelineCounts.Pending / total) * 100)}%`}
                      />
                      <PipelineSegment
                        color="bg-green-600"
                        percentage={`${Math.round((pipelineCounts.Approved / total) * 100)}%`}
                        label={`${Math.round((pipelineCounts.Approved / total) * 100)}%`}
                      />
                      <PipelineSegment
                        color="bg-error-container"
                        percentage={`${Math.round((pipelineCounts.Rejected / total) * 100)}%`}
                        label={`${Math.round((pipelineCounts.Rejected / total) * 100)}%`}
                      />
                      {/* <PipelineSegment
                        color="bg-white/20"
                        percentage={`${Math.round((pipelineCounts.Cancelled / total) * 100)}%`}
                        label={`${Math.round((pipelineCounts.Cancelled / total) * 100)}%`}
                      /> */}
                    </>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <StatusCard
                  border="border-secondary-container"
                  label="Pending"
                  count={pipelineCounts.Pending}
                />
                <StatusCard
                  border="border-green-600"
                  label="Approved"
                  count={pipelineCounts.Approved}
                />
                <StatusCard
                  border="border-error-container"
                  label="Rejected"
                  count={pipelineCounts.Rejected}
                />
                {/* <StatusCard
                  border="border-white/10"
                  label="Cancelled"
                  count={pipelineCounts.Cancelled}
                /> */}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

const LegendItem = ({ dotColor, label, value, valueColor }) => (
  <div className="flex flex-col items-end">
    <div className="flex items-center gap-3 mb-2">
      <span
        className={`w-2.5 h-2.5 ${dotColor} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
      ></span>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/30">
        {label}
      </span>
    </div>
    <span
      className={`font-headline font-black text-2xl ${valueColor} italic tracking-tight`}
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
    <span className="flex-1 text-on-surface/40 group-hover:text-white transition-colors">
      {label}
    </span>
    <span className="font-mono text-on-surface/60 group-hover:text-primary-container tabular-nums transition-colors">
      {percentage}
    </span>
  </div>
);

const PipelineSegment = ({ color, percentage, label }) => (
  <div
    className={`h-full ${color} flex items-center justify-center text-md font-black text-white/90 uppercase tracking-widest transition-all hover:brightness-110 cursor-pointer border-r border-black/10`}
    style={{ width: percentage }}
  >
    {label}
  </div>
);

const StatusCard = ({ border, label, count }) => (
  <div
    className={`p-5 bg-white/[0.01] rounded-[2px] border-l-[3px] ${border} group hover:bg-white/[0.03] transition-all cursor-pointer`}
  >
    <span className="block text-[9px] font-black text-on-surface/20 uppercase tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">
      {label}
    </span>
    <span className="text-3xl font-headline font-black text-white italic tracking-tighter">
      {count}{" "}
      <span className="text-md  group-hover:opacity-40 tabular-nums ml-1 NOT-ITALIC">
        UNITS
      </span>
    </span>
  </div>
);

const HeatBox = ({ opacity }) => (
  <div
    className="w-2.5 h-2.5 bg-primary-container rounded-sm shadow-sm"
    style={{ opacity }}
  ></div>
);
