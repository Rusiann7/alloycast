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

      const { error } = await supabase
        .from("Inventory")
        .update({ stock: matchedItem.stock - 1 })
        .eq("barcode", parseInt(scannedBarCode));

      if (error) throw error;

      addSales(matchedItem.id);
    } catch (error) {
      console.log(error);
    }
  };

  //para ma punta sa reservation
  const addSales = async (id) => {
    try {
      const { error } = await supabase.from("Reservation").insert({
        user_id: "becbb0d6-f436-45c7-9ffb-7e7b81774437",
        inventory_id: id,
        quantity: 1,
        discount: 0,
        status: "Approved",
      });

      if (error) throw error;

      showToast("OK", "success");
      fetchInventoryProduct();
    } catch (error) {
      console.log(error);
    }
  };

  //sa button ito
  const purchaseItems = async (id) => {
    try {
      const { error } = await supabase
        .from("Inventory")
        .update({ stock: selectedItem.stock - 1 }) // minus 1
        .eq("id", selectedItem.id);

      if (error) throw error;

      setId(selectedItem.id);

      addSales(selectedItem.id);
      setIsOpen(false);
      showToast("Confirms", "success");

      console.log("It works");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-hidden select-none">
      <main className="lg:ml-64 pt-28 lg:pt-10 min-h-screen">
        <div className="px-10 pb-40">
          {/* Section Header */}
          <div className="mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl text-primary-container font-black font-headline tracking-tighter uppercase italic leading-none">
              POINT OF SALES
            </h3>
            <div className="flex items-center gap-4">
              <p className="text-[13px] font-headline font-bold uppercase tracking-[0.25em] text-white/40">
                TOTAL PRODUCTS STOCKS:{" "}
                <span className="text-white">
                  {totalProductStock.toLocaleString()}
                </span>{" "}
              </p>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <p className="text-[13px] font-headline font-bold uppercase tracking-[0.25em] text-white/40">
                TOTAL PRODUCTS LIST:{" "}
                <span className="text-primary-container">{totalProducts}</span>
              </p>
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div
            className="bg-[#111111] border border-white/[0.03] p-5 rounded-lg mb-10 flex items-center gap-5 reveal-up shadow-xl"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex-1 flex items-center gap-5 border border-white/[0.1] px-6 h-14 rounded-lg">
              <span className="material-symbols-outlined text-xl font-light">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="FILTER BY BRAND, SCALE, OR SKU..."
                className="bg-transparent border-none outline-none text-md font-headline font-bold tracking-[0.1em] w-md placeholder:opacity-80 text-white"
              />
            </div>
            <button
              className="h-14 px-8 bg-primary-container rounded-lg text-md text-black/90 font-black font-headline uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-xl hover:shadow-primary-container/20 hidden sm:flex items-center gap-3"
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
            className="bg-[#111111]/40 border border-white/[0.03] rounded-lg overflow-hidden reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.03] bg-[#131313]">
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
                              src={item.item_image || "/placeholder-car.png"}
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
                          <span className="bg-white/5 border border-white/10 rounded-lg text-primary-color px-2.5 py-1 rounded-[1px] text-sm font-black tracking-[0.1em]">
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
                      <div className="flex flex-col items-center gap-4 opacity-20">
                        <span className="material-symbols-outlined text-6xl">
                          search_off
                        </span>
                        <p className="text-xl font-headline font-black uppercase tracking-[0.2em]">
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
                  className="w-8 h-8 flex items-center justify-center border border-white/5 text-white/90 hover:bg-white/50 transition-colors disabled:opacity-20"
                >
                  <span className="material-symbols-outlined text-md">
                    chevron_left
                  </span>
                </button>

                {/* Current Page Indicator */}
                <button className="w-8 h-8 flex items-center justify-center bg-primary-container text-black  font-black text-md">
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
                    currentPage >= Math.ceil(inventory.length / itemsPerPage)
                  }
                  className="w-8 h-8 flex items-center justify-center border border-white/5 text-white/90 hover:bg-white/50 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-md">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
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
        onPurchase={() => purchaseItems(selectedItem?.id)}
      />

      <Scanner
        scannerOpen={scannerOpen}
        scannerClose={() => setScannerOpen(false)}
        onScan={handelScannedBarCode}
      />
    </div>
  );
}
