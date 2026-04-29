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

  // revenue chart
  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data: reservation } = await supabase
        .from("Reservation")
        .select("*, Inventory(price)"); // joins Reservation and Inventory Table

      if (reservation) {
        let sum = 0; // total revenue calculation
        const dailyRevenue = {}; // objet to group by date
        reservation.forEach((eachReservation) => {
          if (eachReservation.Inventory?.price) {
            // products sold x price per product
            const rev =
              eachReservation.quantity * eachReservation.Inventory.price;
            sum += rev; // add to overall total

            // extracts date
            const dateStr = eachReservation.created_at.split("T")[0];

            dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + rev;
          }
        });

        setTotalRevenue(sum); // total revenue
        const chartData = Object.keys(dailyRevenue)
          .sort((a, b) => new Date(a) - new Date(b))
          .map((dateStr) => {
            const dateObj = new Date(dateStr);
            return {
              // convert to mm dd format
              name: dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              }),
              revenue: dailyRevenue[dateStr],
            };
          });
        setRevenueData(chartData);
      }
    };
    fetchAnalytics();
  }, []);

  // top products
  useEffect(() => {
    const getTopProducts = async () => {
      const { data, error } = await supabase
        .from("Reservation")
        .select("quantity, Inventory(item_name) ");

      if (data) {
        const productCounts = {};
        let totalReserved = 0;

        // merges all same reserved products into a single row
        data.forEach((res) => {
          const name = res.Inventory?.item_name;
          if (name) {
            productCounts[name] = (productCounts[name] || 0) + 1;
            totalReserved += 1;
          }
        });

        const sortedProducts = Object.keys(productCounts)
          .map((name) => ({
            name: name,
            units: productCounts[name],
            percentage: Math.round((productCounts[name] / totalReserved) * 100),
          }))
          .sort((a, b) => b.units - a.units) // sort highest to lowest
          .slice(0, 6); // only display top 6
        setTopProducts(sortedProducts);
      } else {
        console.error(error.message);
      }
    };

    getTopProducts();
  }, []);

  // low selling products
  useEffect(() => {
    const getLowProducts = async () => {
      const { data, error } = await supabase
        .from("Reservation")
        .select("quantity, Inventory(item_name) ");

      if (data) {
        const productCounts = {};
        let totalReserved = 0;

        // merges all same reserved products into a single row
        data.forEach((res) => {
          const name = res.Inventory?.item_name;
          if (name) {
            productCounts[name] = (productCounts[name] || 0) + 1;
            totalReserved += 1;
          }
        });

        const sortedProducts = Object.keys(productCounts)
          .map((name) => ({
            name: name,
            units: productCounts[name],
            percentage: Math.round((productCounts[name] / totalReserved) * 100),
          }))
          .sort((a, b) => a.units - b.units) // sort lowest to highest
          .slice(0, 6); // only display top 6
        setLowProducts(sortedProducts);
      } else {
        console.error(error.message);
      }
    };

    getLowProducts();
  }, []);

  // for market share by brands
  useEffect(() => {
    const getTopProductsforBrand = async () => {
      const { data, error } = await supabase
        .from("Reservation")
        .select("quantity, Inventory(item_name, brand)");

      if (data) {
        const productCounts = {};
        const brandCounts = {};

        let totalReserved = 0;
        data.forEach((res) => {
          const name = res.Inventory?.item_name;
          const brand = res.Inventory?.brand;

          if (name) {
            productCounts[name] = (productCounts[name] || 0) + 1;
            totalReserved += 1;
          }

          if (brand) {
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
          }
        });

        const sortedProducts = Object.keys(productCounts)
          .map((name) => ({
            name: name,
            units: productCounts[name],
            percentage: Math.round((productCounts[name] / totalReserved) * 100),
          }))
          .sort((a, b) => b.units - a.units)
          .slice(0, 6);

        setTopProducts(sortedProducts);

        const sortedBrands = Object.keys(brandCounts)
          .map((brand) => ({
            name: brand,
            value: brandCounts[brand],
            percentage: Math.round((brandCounts[brand] / totalReserved) * 100),
          }))
          .sort((a, b) => b.value - a.value);
        setTopBrands(sortedBrands);
      } else {
        console.error(error.message);
      }
    };
    getTopProductsforBrand();
  }, []);

  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-x-hidden selection:bg-primary-container selection:text-white">
      {/* --- Main Content --- */}
      <main className="lg:ml-64 pt-28 lg:pt-10 min-h-screen ">
        <div className="space-y-4 px-10 flex flex-col">
          <h2 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
            ANALYTICS
          </h2>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-primary-container shadow-[0_0_10px_rgba(200,16,46,0.3)]"></span>
            <span className="bg-surface-container-high/60 text-primary-container px-3 py-1 text-[10px] font-mono font-bold border border-white/5 uppercase tracking-widest">
              AI ANALYSIS REPORT
            </span>
          </div>
        </div>
        {/* Sticky Date Range Control */}
        <div className="sticky top-18 lg:top-0 z-30 bg-[#131313]/90 backdrop-blur-xl border-b border-white/5 px-10 py-5 flex flex-wrap items-center justify-between gap-6 reveal-up">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-lg">
              calendar_today
            </span>
          </div>

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
                className={`px-4 py-2 text-[9px] font-headline font-black uppercase tracking-widest transition-all rounded-[1px] ${
                  dateRange === label
                    ? "bg-primary-container text-white shadow-lg"
                    : "text-on-surface/30 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <DateInput label="FROM" value="2026-03-01" />
            <DateInput label="TO" value="2026-03-23" />
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
                        dataKey="value"
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
                    <span className="text-7xl  font-headline font-black text-white tracking-tighter">
                      {topBrands.reduce((sum, brand) => sum + brand.value, 0)}
                    </span>
                    <span className="text-xs font-black text-on-surface/20 uppercase tracking-[0.2em] leading-none mt-2">
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
                <PipelineSegment
                  color="bg-amber-500"
                  percentage="30%"
                  label="30%"
                />
                <PipelineSegment
                  color="bg-blue-500"
                  percentage="45%"
                  label="45%"
                />
                <PipelineSegment
                  color="bg-green-600"
                  percentage="20%"
                  label="20%"
                />
                <PipelineSegment
                  color="bg-white/10"
                  percentage="5%"
                  label="5%"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <StatusCard
                  border="border-amber-500"
                  label="Pending"
                  count="124"
                />
                <StatusCard
                  border="border-blue-500"
                  label="Confirmed"
                  count="185"
                />
                <StatusCard
                  border="border-green-600"
                  label="Ready"
                  count="82"
                />
                <StatusCard
                  border="border-white/10"
                  label="Cancelled"
                  count="21"
                />
              </div>
            </section>

            {/* Activity Heatmap */}
            <section
              className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] p-10 reveal-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter italic">
                  Activity Heatmap
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-on-surface/20 uppercase tracking-widest">
                  <span>Low</span>
                  <HeatBox opacity="0.1" />
                  <HeatBox opacity="0.4" />
                  <HeatBox opacity="0.7" />
                  <HeatBox opacity="1" />
                  <span>High</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2.5 h-[200px]">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-primary-container rounded-[2px] hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-primary-container/0 hover:shadow-primary-container/20"
                    style={{ opacity: 0.5501490565683387 }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-7 mt-5 text-[10px] font-black text-on-surface/20 uppercase text-center tracking-widest">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
            </section>
          </div>

          {/* Critical Stock Urgency */}
          <section
            className="bg-surface-container-low/40 border border-white/[0.03] rounded-[2px] overflow-hidden reveal-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="p-10 border-b border-white/[0.03] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="font-headline font-black text-3xl uppercase tracking-tighter italic">
                  Critical Stock Urgency
                </h3>
                <p className="text-[10px] font-black text-primary-container uppercase tracking-widest mt-2 underline decoration-2 underline-offset-8 cursor-pointer">
                  View All Inventory
                </p>
              </div>
              <button className="bg-primary-container text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all rounded-[1px]">
                STOCK REPORT
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#131313] text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                  <tr>
                    <th className="px-10 py-6">Product Model / SKU</th>
                    <th className="px-10 py-6 text-center">Base Stock</th>
                    <th className="px-10 py-6 text-center">Current</th>
                    <th className="px-10 py-6 text-center">Reserved</th>
                    <th className="px-10 py-6">Urgency</th>
                    <th className="px-10 py-6 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {criticalStock.map((item) => (
                    <tr
                      key={item.sku}
                      className="hover:bg-white/[0.01] transition-all group cursor-pointer"
                    >
                      <td className="px-10 py-6">
                        <p className="font-headline font-black text-sm tracking-tight uppercase group-hover:text-primary-container transition-colors italic">
                          {item.name}
                        </p>
                        <p className="text-[9px] font-mono uppercase text-on-surface/20 mt-1 tabular-nums">
                          SKU: {item.sku}
                        </p>
                      </td>
                      <td className="px-10 py-6 font-mono text-center text-xs opacity-40 tabular-nums">
                        {item.base}
                      </td>
                      <td
                        className={`px-10 py-6 font-mono text-center text-xs font-black tabular-nums ${
                          item.urgency === "High"
                            ? "text-primary-container"
                            : item.urgency === "Medium"
                              ? "text-amber-500"
                              : "text-blue-400"
                        }`}
                      >
                        {item.current}
                      </td>
                      <td className="px-10 py-6 font-mono text-center text-xs opacity-60 tabular-nums">
                        {item.reserved}
                      </td>
                      <td className="px-10 py-6">
                        <span
                          className={`px-3 py-1.5 rounded-[1px] text-[9px] font-black uppercase border tracking-widest ${
                            item.urgency === "High"
                              ? "bg-primary-container/10 text-primary-container border-primary-container/20"
                              : item.urgency === "Medium"
                                ? "bg-amber-900/30 text-amber-500 border-amber-900/50"
                                : "bg-blue-900/30 text-blue-500 border-blue-900/20"
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button className="px-6 py-2.5 bg-white/5 hover:bg-primary-container hover:text-white transition-all text-[9px] font-black uppercase rounded-[1px] border border-white/5 hover:border-transparent tracking-widest active:scale-95 duration-100">
                          Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer Decoration */}
        <footer className="mt-20 px-10 pb-20 opacity-10 pointer-events-none">
          <div className="flex items-center gap-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/30"></div>
            <p className="font-headline font-black text-5xl uppercase tracking-tighter italic">
              ETHAN MARCUS DIECAST ADMIN
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/30"></div>
          </div>
        </footer>
      </main>
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

const NavIcon = ({ icon, badge }) => (
  <button className="relative hover:text-primary-container transition-colors group">
    <span className="material-symbols-outlined font-light text-2xl group-hover:rotate-6 transition-transform">
      {icon}
    </span>
    {badge && (
      <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary-container rounded-full ring-2 ring-[#131313]"></span>
    )}
  </button>
);

const DateInput = ({ label, value }) => (
  <div className="flex items-center bg-black/40 border border-white/[0.05] px-4 py-2.5 rounded-[2px] group focus-within:border-primary-container/40 transition-all">
    <span className="text-[9px] font-black text-on-surface/20 mr-4 tracking-widest">
      {label}
    </span>
    <input
      className="bg-transparent border-none p-0 text-[10px] font-mono uppercase focus:ring-0 w-28 text-white tabular-nums outline-none"
      type="text"
      defaultValue={value}
    />
    <span className="material-symbols-outlined text-sm opacity-10 group-hover:opacity-40 transition-opacity ml-2">
      edit
    </span>
  </div>
);

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
    className={`h-full ${color} flex items-center justify-center text-[9px] font-black text-black/60 uppercase tracking-widest transition-all hover:brightness-110 cursor-pointer border-r border-black/10`}
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
      <span className="text-[10px] opacity-20 group-hover:opacity-40 tabular-nums ml-1 NOT-ITALIC">
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
