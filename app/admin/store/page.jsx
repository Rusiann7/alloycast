"use client";

import { useState, useEffect } from "react";
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
  const [scannedBarCode, setScannedBarCode] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchInventoryProduct();
  }, []);

  const totalProductStock = inventory.reduce(
    (sum, item) => sum + (Number(item.stock) || 0),
    0,
  );
  const totalProducts = inventory.length;

  const fetchInventoryProduct = async () => {
    try {
      let { data, error } = await supabase
        .from("Inventory")
        .select("*")
        .order("created_at");

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

      showToast("Confirms", "success");
      fetchInventoryProduct();
    } catch (error) {
      console.log(error);
    }
  };

  const purchaseItems = async (id) => {
    try {
      const { error } = await supabase
        .from("Inventory")
        .update({ stock: selectedItem.stock - 1 }) // minus 1
        .eq("id", selectedItem.id);

      if (error) throw error;

      setIsOpen(false);

      fetchInventoryProduct();
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
                placeholder="FILTER BY BRAND, SCALE, OR SKU..."
                className="bg-transparent border-none outline-none text-md font-headline font-bold tracking-[0.1em] w-full placeholder:opacity-10 text-white"
              />

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
                {inventory.map((item) => (
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
                ))}
              </tbody>
            </table>
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
