"use client";

import { useState, useEffect, useActionState } from "react";
import Toast from "../../components/Toast";
import { createClient } from "../../../lib/supabase/client";
import dynamic from "next/dynamic";
import Image from "next/image";

const DynamicToast = dynamic(() => import("../../components/Toast"));
const DynamicPOSModal = dynamic(() => import("../../components/POSModal"));
const DynamicScanner = dynamic(() => import("../../components/Scanner"));

export default function StorePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [posDB, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(0);
  const [scannedBarCode, setScannedBarCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });
  const [activeTab, setActiveTab] = useState("Point of Sales");

  const supabase = createClient();

  const itemsPerPage = 5;

  useEffect(() => {
    fetchInventoryProduct();
  }, []);

  const totalProductStock = inventory.reduce(
    (sum, item) => sum + (Number(item.stock) || 0),
    0,
  );

  const searchedInventory = inventory.filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalProducts = searchedInventory.length;

  const fetchInventoryProduct = async () => {
    try {
      let { data, error } = await supabase
        .from("Inventory")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInventory(data || []);
      console.log("Product Fetched successfully");
    } catch (error) {
      showToast("Error fetching products from Inventory");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPOSData = async (dateRange) => {
    try {
      const now = new Date();
      let startDate = new Date();
      let endDate = new Date();

      switch (dateRange) {
        case "Today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "Yesterday":
          startDate.setDate(now.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "This Week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "This Month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "All Time":
          startDate = new Date(0); // Year 1970
          endDate = new Date();
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }
      const { data, error } = await supabase
        .from("POS")
        .select(
          `
          id,
          product_id,
          quantity,
          created_at, 
          name,
          email,
          Inventory!product_id (
          id,
          item_name,
          brand,
          item_image,
          price,
          category)`,
        )
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error) throw error;
      setPos(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPOSData("All Time");
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const scannerModal = () => {
    setScannerOpen(true);
  };

  const confirmItems = (item) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const handelScannedBarCode = (decodedText) => {
    setScannedBarCode(decodedText);
    setScannerOpen(false);
    console.log("Scanned Items: ", decodedText);
    purchaseBarCode(decodedText);
  };

  //sa barcode ito
  const purchaseBarCode = async (scannedBarCode) => {
    try {
      const matchedItem = inventory.find(
        (item) => item.barcode === parseInt(scannedBarCode),
      );

      setSelectedItem(matchedItem);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  //para ma punta sa reservation
  const addSales = async (id, formData) => {
    try {
      const { error } = await supabase.from("POS").insert({
        product_id: id,
        quantity: 1,
        name: formData.userName || null,
        email: formData.emailAddr || null,
      });

      if (error) throw error;

      showToast("OK", "success");
      fetchInventoryProduct();
    } catch (error) {
      console.log(error);
    }
  };

  //sa button ito
  const purchaseItems = async (id, formData) => {
    try {
      const { error } = await supabase
        .from("Inventory")
        .update({ stock: selectedItem.stock - 1 }) // minus 1
        .eq("id", selectedItem.id);

      if (error) throw error;

      setId(selectedItem.id);

      addSales(selectedItem.id, formData);
      setIsOpen(false);
      showToast("Confirms", "success");

      console.log("It works");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-background text-font-color min-h-screen font-body relative overflow-hidden select-none">
      <main className="lg:ml-64 pt-28 lg:pt-10 min-h-screen">
        <div className="px-4 sm:px-10 pb-40">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl text-font-color font-black font-headline tracking-tighter uppercase italic leading-none mb-4 sm:mb-0">
              POINT OF SALES
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-font-color">
                TOTAL STOCKS:{" "}
                <span className="text-font-color font-bold">
                  {totalProductStock.toLocaleString()}
                </span>{" "}
              </p>
              <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full" />
              <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-font-color">
                TOTAL ITEMS:{" "}
                <span className="text-font-color">{totalProducts}</span>
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-10 mb-10 overflow-x-auto scrollbar-hide reveal-up border-b border-white/5"
            style={{ animationDelay: "0.1s" }}
          >
            {["Point of Sales", "Reports"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`pb-5 text-md font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative ${
                  activeTab === tab
                    ? "text-secondary-container opacity-100"
                    : "text-font-color opacity-40 hover:opacity-80"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary-container animate-scale-in" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "Point of Sales" ? (
            <>
              {/* Search/Filter Bar */}
              <div
                className="bg-secondary-container shadow-lg/30 p-4 sm:p-5 rounded-lg mb-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 reveal-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="w-full sm:flex-1 flex items-center gap-4 sm:gap-5 border border-primary-container px-4 sm:px-6 h-14 rounded-lg bg-white/5 sm:bg-transparent">
                  <span className="material-symbols-outlined text-xl font-light opacity-40">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                    placeholder="FILTER BY BRAND, SCALE, OR SKU..."
                    className="flex-1 bg-transparent border-none outline-none text-sm sm:text-md font-headline font-bold tracking-[0.1em] placeholder:opacity-80 text-white/90"
                  />
                </div>
                <button
                  className="w-full sm:w-auto h-14 px-8 bg-primary-container rounded-lg text-sm text-black font-black font-headline uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary-container/20 flex items-center justify-center gap-3"
                  onClick={() => scannerModal()}
                >
                  <span className="material-symbols-outlined text-xl">
                    barcode_scanner
                  </span>
                  SCAN
                </button>
              </div>

              {/* Product Table */}
              <div
                className="bg-secondary-container shadow-lg/30 rounded-lg overflow-x-auto reveal-up scrollbar-hide"
                style={{ animationDelay: "0.2s" }}
              >
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className=" bg-input-field">
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        PRODUCT IMAGE
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        PRODUCT NAME
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        BRAND
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        CATEGORY/SERIES
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        PRICE
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        STOCK
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {searchedInventory.length > 0 ? (
                      searchedInventory
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage,
                        )
                        .map((item) => (
                          <tr
                            key={item.id}
                            className="group hover:bg-white/[0.01] transition-all duration-300"
                          >
                            {/* IMAGE */}
                            <td className="px-8 py-5">
                              <div className="w-full h-40 bg-black/40 rounded-[1px] overflow-hidden border border-white/5 group-hover:border-primary-container/30 transition-all duration-500 relative">
                                <Image
                                  src={
                                    item.item_image || "/placeholder-car.png"
                                  }
                                  alt={item.item_name}
                                  className="w-full h-40 object-cover group-hover:scale-110 transition-all duration-700"
                                  width={100}
                                  height={100}
                                  loading="lazy"
                                />
                              </div>
                            </td>

                            {/* Product Name */}
                            <td className="px-8 py-5 text-center">
                              <p className="text-lg text-white font-bold font-headline uppercase tracking-tight group-hover:text-primary-container transition-colors duration-300">
                                {item.item_name}
                              </p>
                            </td>

                            {/* Brand */}
                            <td className="px-8 py-5 text-center">
                              <span className="bg-white/5 border border-white/10 rounded-lg text-white/90 px-2.5 py-1 rounded-lg text-sm font-black tracking-[0.1em]">
                                {item.brand}
                              </span>
                            </td>

                            {/* Category */}
                            <td className="px-8 py-5 text-center">
                              <p className="text-md text-white font-headline uppercase tracking-[0.2em]">
                                {item.category}
                              </p>
                            </td>

                            {/* Price */}
                            <td className="px-8 py-5 text-center">
                              <p className="text-md font-headline font-bold text-primary-container">
                                ₱{item.price}
                              </p>
                            </td>

                            {/* Stock */}
                            <td className="px-8 py-5 text-center">
                              <p className="text-md text-white font-headline font-bold">
                                {item.stock}
                              </p>
                            </td>

                            {/* Actions */}
                            <td className="px-8 py-5">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  className="w-10 h-10 flex items-center justify-center bg-primary-container rounded-lg text-black hover:bg-secondary-container/80 hover:text-white/80 transition-all"
                                  title="Purchase"
                                  onClick={() => confirmItems(item)}
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    shopping_cart
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-80">
                            <span className="material-symbols-outlined text-6xl">
                              search_off
                            </span>
                            <p className="text-xl text-white/90 font-headline font-black uppercase tracking-[0.2em]">
                              Product not available
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="flex items-center justify-center p-8 bg-[#131313]/50 border-t border-white/[0.03]">
                  <div className="flex items-center gap-3">
                    {/* Previous */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-white/90 hover:bg-white/50 transition-colors disabled:opacity-20"
                    >
                      <span className="material-symbols-outlined text-md">
                        chevron_left
                      </span>
                    </button>

                    {/* Current Page Indicator */}
                    <button className="w-8 h-8 flex items-center justify-center bg-primary-container text-black  font-black text-md rounded-lg">
                      {currentPage}
                    </button>

                    {/* Next */}
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(
                            p + 1,
                            Math.ceil(inventory.length / itemsPerPage),
                          ),
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(inventory.length / itemsPerPage)
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-white/90 hover:bg-white/50 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-md">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* DUMMY REPORTS VIEW */

            <div className="space-y-10 reveal-up">
              {/* Sticky Date Range Control */}
              <div className="sticky mt-5 z-30 rounded-lg bg-secondary-container backdrop-blur-xl border-b border-white/5 px-4 sm:px-10 py-5 flex flex-wrap items-center justify-center gap-6 reveal-up shadow-lg/30">
                <div className="grid grid-cols-2 md:flex items-center p-1 rounded-lg border border-primary-container bg-input-field gap-1 md:gap-0 w-full md:w-auto">
                  {[
                    "Today",
                    "Yesterday",
                    "This Week",
                    "This Month",
                    "All Time",
                  ].map((label, index) => (
                    <button
                      key={label}
                      onClick={() => {
                        setDateRange(label);
                        fetchPOSData(label);
                      }}
                      className={`px-4 py-3 md:py-2 text-xs sm:text-sm font-headline font-black uppercase tracking-widest transition-all rounded-lg ${
                        index === 4 ? "col-span-2 md:col-span-1" : ""
                      } ${
                        dateRange === label
                          ? "bg-primary-container text-black/90 shadow-lg"
                          : "text-white/90 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
                {[
                  {
                    label: "Today's Sales",
                    value: "₱12,450",
                    icon: "payments",
                    color: "text-green-400",
                  },
                  {
                    label: "Transactions",
                    value: "24",
                    icon: "receipt_long",
                    color: "text-blue-400",
                  },
                ].map((kpi, i) => (
                  <div
                    key={i}
                    className="bg-secondary-container shadow-lg/30 p-6 rounded-lg border border-white/5 group hover:scale-105 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`material-symbols-outlined ${kpi.color} text-4xl`}
                      >
                        {kpi.icon}
                      </span>
                    </div>
                    <p className="text-white/60 text-[12px] font-black uppercase tracking-[0.2em] mb-1">
                      {kpi.label}
                    </p>
                    <p className="text-4xl font-headline font-black text-primary-container italic tracking-tighter">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reports Table */}
              <div className="bg-secondary-container shadow-lg/30 rounded-lg overflow-x-auto reveal-up scrollbar-hide border border-white/5">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-input-field">
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        Product Image
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        Product Name
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        Brand
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        Category/Series
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        Price
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        Quantity
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        Customer Details
                      </th>
                      <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                        Date Purchase
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {posDB.map((pos) => (
                      <tr
                        key={pos.id}
                        className="group hover:bg-white/[0.01] transition-all duration-300"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-center">
                            <div className="w-32 h-20 bg-black/40 rounded-lg overflow-hidden border border-white/5 relative group-hover:border-primary-container/30 transition-all duration-500">
                              <Image
                                src={
                                  pos.Inventory?.item_image ||
                                  "/placeholder-car.png"
                                }
                                alt={pos.Inventory?.item_name || "Image"}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover filter group-hover:scale-110 transition-all duration-700"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <p className="font-bold text-md tracking-tight uppercase text-primary-container transition-colors">
                            {pos.Inventory?.item_name}
                          </p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 text-sm font-black tracking-[0.1em] text-white/90 rounded-lg uppercase">
                            {pos.Inventory?.brand}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <p className="text-md text-white font-bold uppercase tracking-[0.2em]">
                            {pos.Inventory?.category}
                          </p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <p className="text-2xl  text-primary-container">
                            ₱{pos.Inventory?.price * pos.quantity}{" "}
                            <span className="text-sm text-white/80 italic block">
                              (₱{pos.Inventory?.price} each)
                            </span>
                          </p>
                        </td>
                        <td className="px-8 py-5 text-center font-black text-md tabular-nums text-white">
                          {pos.quantity}
                        </td>
                        <td className="px-8 py-5 text-center">
                          <p className="font-black text-md text-primary-container tracking-tight uppercase transition-colors">
                            {pos.name || "Name not provided"}
                          </p>
                          <p className="font-body text-sm text-white/80 mt-1 tabular-nums italic">
                            {pos.email || "Email not provided"}
                          </p>
                        </td>
                        <td className="px-8 py-5 text-center text-sm font-black text-white/80 uppercase tracking-widest transition-colors">
                          {new Date(pos.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      <DynamicPOSModal
        isOpen={isOpen}
        isClose={() => setIsOpen(false)}
        selectedItem={selectedItem}
        onPurchase={(formData) => purchaseItems(selectedItem?.id, formData)}
      />

      <DynamicScanner
        scannerOpen={scannerOpen}
        scannerClose={() => setScannerOpen(false)}
        onScan={handelScannedBarCode}
      />
    </div>
  );
}
