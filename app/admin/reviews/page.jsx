"use client";

import { useState, useEffect } from "react";
import Toast from "../../components/Toast";
import { createClient } from "../../../lib/supabase/client";

export default function FeedbackPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(0);
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

  const searchedInventory = inventory.filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-hidden select-none">
      <main className="lg:ml-64 pt-28 lg:pt-10 min-h-screen">
        <div className="px-4 sm:px-10 pb-40">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl text-primary-container font-black font-headline tracking-tighter uppercase italic leading-none mb-4 sm:mb-0">
              REVIEWS
            </h3>
          </div>

          {/* Search/Filter Bar */}
          <div
            className="bg-[#111111] border border-white/[0.03] p-4 sm:p-5 rounded-lg mb-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 reveal-up shadow-xl"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-full sm:flex-1 flex items-center gap-4 sm:gap-5 border border-white/[0.1] px-4 sm:px-6 h-14 rounded-lg bg-white/5 sm:bg-transparent">
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
                className="flex-1 bg-transparent border-none outline-none text-[12px] sm:text-md font-headline font-bold tracking-[0.1em] placeholder:opacity-40 text-white"
              />
            </div>
          </div>

          {/* Review Table */}
          <div
            className="bg-[#111111]/40 border border-white/[0.03] rounded-lg overflow-x-auto reveal-up scrollbar-hide"
            style={{ animationDelay: "0.2s" }}
          >
            <table className="w-full text-left border-collapse min-w-[1000px]">
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
                    CUSTOMER
                  </th>
                  <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                    REVIEW
                  </th>
                  <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                    RATING
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
                            Name
                          </p>
                        </td>

                        {/* Price */}
                        <td className="px-8 py-5 text-center">
                          <p className="text-md font-headline font-bold text-primary-container">
                            I like this
                          </p>
                        </td>

                        {/* Stock */}
                        <td className="px-8 py-5 text-center">
                          <p className="text-md text-white font-headline font-bold">
                            5
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              // onClick={() => deleteProduct(item.id)}
                              className="w-8 h-8 flex items-center justify-center bg-error-container rounded-lg text-white hover:bg-error-container/40 hover:text-white/90 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">
                                delete
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
    </div>
  );
}
