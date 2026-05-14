"use client";

import { useState, useEffect, useActionState } from "react";
import Toast from "../../components/Toast";
import { createClient } from "../../../lib/supabase/client";
import POSModal from "../../components/POSModal";
import Scanner from "../../components/Scanner";

export default function StorePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(0);
  const [scannedBarCode, setScannedBarCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
                    ? "text-primary-container opacity-100"
                    : "text-font-color opacity-40 hover:opacity-80"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-container animate-scale-in" />
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
                                <img
                                  src={
                                    item.item_image || "/placeholder-car.png"
                                  }
                                  alt={item.item_name}
                                  className="w-full h-40 object-cover group-hover:scale-110 transition-all duration-700"
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
              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  {
                    label: "Top Brand",
                    value: "Hot Wheels",
                    icon: "stars",
                    color: "text-yellow-400",
                  },
                  {
                    label: "Avg. Ticket",
                    value: "₱518",
                    icon: "analytics",
                    color: "text-purple-400",
                  },
                ].map((kpi, i) => (
                  <div
                    key={i}
                    className="bg-secondary-container shadow-lg/30 p-6 rounded-lg border border-white/5 group hover:border-primary-container/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`material-symbols-outlined ${kpi.color} text-3xl`}
                      >
                        {kpi.icon}
                      </span>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                        Live
                      </span>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      {kpi.label}
                    </p>
                    <p className="text-2xl font-headline font-black text-white italic tracking-tighter">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Dummy Chart Placeholder */}
              <div className="bg-secondary-container shadow-lg/30 rounded-lg border border-white/5 p-10 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl text-primary-container animate-pulse">
                    monitoring
                  </span>
                </div>
                <h4 className="text-2xl font-headline font-black text-white uppercase tracking-tighter italic mb-2">
                  Sales Overview Coming Soon
                </h4>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest text-center max-w-md">
                  Detailed transaction analytics and financial forecasting
                  modules are currently under development.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      <POSModal
        isOpen={isOpen}
        isClose={() => setIsOpen(false)}
        selectedItem={selectedItem}
        onPurchase={(formData) => purchaseItems(selectedItem?.id, formData)}
      />

      <Scanner
        scannerOpen={scannerOpen}
        scannerClose={() => setScannerOpen(false)}
        onScan={handelScannedBarCode}
      />
    </div>
  );
}
