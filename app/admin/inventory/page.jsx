"use client";

import { useState, useEffect } from "react";
import AddProductModal from "../../components/AddProductModal";
import Toast from "../../components/Toast";
import { createClient } from "../../../lib/supabase/client";

export default function AdminInventory() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const supabase = createClient();
  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  // load products mula sa inventory kada refresh ng page ONCE
  useEffect(() => {
    fetchInventoryProduct();
  }, []);

  // kunin mga product sa loob ng Inventory Table
  const fetchInventoryProduct = async () => {
    try {
      let { data, error } = await supabase
        .from("Inventory")
        .select("*")
        .order("created_at");

      if (error) throw error;
      setInventory(data || []); // ilagay sa inventory state ung nafetch na product
      console.log(data);
      return showToast("Ok lahat!");
    } catch (error) {
      showToast("Error fetching products from Inventory");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-hidden select-none">
      {/* --- Main Content --- */}
      <main className="lg:ml-64 pt-28 lg:pt-10 min-h-screen ">
        <div className="px-10 pb-40">
          {/* Section Header */}
          <div className="mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
              INVENTORY
            </h3>
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-headline font-bold uppercase tracking-[0.25em] text-white/40">
                TOTAL STOCK: <span className="text-white">1,248</span> UNITS
              </p>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <p className="text-[11px] font-headline font-bold uppercase tracking-[0.25em] text-white/40">
                ACTIVE LISTINGS:{" "}
                <span className="text-primary-container">84</span>
              </p>
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div
            className="bg-[#111111] border border-white/[0.03] p-5 rounded-[2px] mb-10 flex items-center gap-5 reveal-up shadow-xl"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex-1 flex items-center gap-5 bg-black/40 border border-white/[0.02] px-6 h-14 rounded-[2px]">
              <span className="material-symbols-outlined text-on-surface/20 text-xl font-light">
                search
              </span>
              <input
                type="text"
                placeholder="FILTER BY BRAND, SCALE, OR SKU..."
                className="bg-transparent border-none outline-none text-xs font-headline font-bold uppercase tracking-[0.1em] w-full placeholder:opacity-10 text-white"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-14 px-8 bg-[#C8102E] rounded-[2px] text-[12px] font-black font-headline uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-[#C8102E]/20 hidden sm:block"
            >
              ADD PRODUCT
            </button>
          </div>

          {/* Inventory Table */}
          <div
            className="bg-[#111111]/40 border border-white/[0.03] rounded-[2px] overflow-hidden reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            <table className="w-full  text-left border-collapse ">
              <thead>
                <tr className="border-b border-white/[0.03] bg-[#131313]">
                  <th className="px-8 py-5 text-center text-[12px] font-black font-headline uppercase tracking-[0.3em] text-white">
                    PRODUCT IMAGE
                  </th>
                  <th className="px-8 py-5 text-center text-[12px] font-black font-headline uppercase tracking-[0.3em] text-white">
                    PRODUCT NAME
                  </th>
                  <th className="px-8 py-5 text-center text-[12px] font-black font-headline uppercase tracking-[0.3em] text-white">
                    BRAND
                  </th>
                  <th className="px-8 py-5 text-center text-[12px] font-black font-headline uppercase tracking-[0.3em] text-white">
                    CATEGORY/SERIES
                  </th>
                  <th className="px-8 py-5 text-center text-[12px] font-black font-headline uppercase tracking-[0.3em] text-white">
                    PRICE
                  </th>
                  <th className="px-8 py-5 text-center text-[12px] font-black font-headline uppercase tracking-[0.3em] text-white">
                    STOCK
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {inventory.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-white/[0.01] transition-all duration-300 cursor-pointer"
                    onClick={() => handleEditClick(item)}
                  >
                    {/* IMAGE */}
                    <td className="px-8 py-5 ">
                      <div className="w-full h-40 bg-black/40 rounded-[2px] overflow-hidden border border-white/5 group-hover:border-[#C8102E]/30 transition-all duration-500">
                        <img
                          src={item.item_image || "/placeholder-car.png"}
                          alt={item.item_name}
                          className="w-full h-40 object-cover  group-hover:scale-110 transition-all duration-700"
                        />
                      </div>
                    </td>

                    {/* Product Name Column */}
                    <td className="px-8 py-5 text-center">
                      <p className="text-[13px] text-white font-bold font-headline uppercase tracking-tight group-hover:text-[#C8102E] transition-colors duration-300">
                        {item.item_name}
                      </p>
                      <p className="text-[13px] text-whitefont-mono uppercase  mt-1 tabular-nums">
                        ID: {item.id}
                      </p>
                    </td>

                    {/* Brand Column */}
                    <td className="px-8 py-5 text-center">
                      <span className="bg-surface-container-highest/20 text-white border border-white/10 px-2.5 py-1 rounded-[1px] text-[12px] font-black  tracking-[0.1em]">
                        {item.brand}
                      </span>
                    </td>

                    {/* Category / Series Column */}
                    <td className="px-8 py-5 text-center">
                      <p className="text-[12px] text-white font-headline font-bold uppercase tracking-[0.2em]  group-hover:opacity-60 transition-opacity">
                        {item.category}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[12px] font-headline font-bold uppercase tracking-[0.2em] opacity-30 group-hover:opacity-60 transition-opacity">
                        ₱{item.price}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[12px] font-headline font-bold uppercase tracking-[0.2em] opacity-30 group-hover:opacity-60 transition-opacity">
                        {item.stock}
                      </p>
                    </td>

                    {/* Action / Edit Button */}
                    <td className="px-10 py-5 text-center hidden">
                      <button className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 group-hover:text-[#C8102E] transition-all">
                        edit_note
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- Edit Model Drawer --- */}
      {isEditDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] animate-fade-in"
            onClick={() => setIsEditDrawerOpen(false)}
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#0F0F0F] z-[100] border-l border-white/[0.05] shadow-[0_0_100px_rgba(0,0,0,1)] animate-slide-in-right flex flex-col">
            <header className="p-10 border-b border-white/[0.03] flex items-center justify-between">
              <h4 className="text-3xl font-black font-headline uppercase tracking-tighter italic leading-none">
                EDIT MODEL
              </h4>
              <button
                onClick={() => setIsEditDrawerOpen(false)}
                className="w-10 h-10 flex items-center justify-center border border-white/5 hover:bg-white/5 transition-colors rounded-[2px] group"
              >
                <span className="material-symbols-outlined opacity-40 group-hover:opacity-100 group-hover:rotate-90 transition-all text-xl font-light">
                  close
                </span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="space-y-3">
                <label className="text-[12px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                  PRODUCT NAME
                </label>
                <input
                  type="text"
                  defaultValue={activeItem?.name}
                  className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[12px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                    BRAND
                  </label>
                  <div className="relative">
                    <select className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest appearance-none outline-none focus:border-primary-container transition-all text-white">
                      <option>{activeItem?.brand}</option>
                      <option>Bburago</option>
                      <option>Maisto</option>
                      <option>AutoArt</option>
                      <option>GT Spirit</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-xl font-light">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                    SCALE
                  </label>
                  <div className="relative">
                    <select className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest appearance-none outline-none focus:border-primary-container transition-all text-white">
                      <option>{activeItem?.scale}</option>
                      <option>1:18</option>
                      <option>1:24</option>
                      <option>1:43</option>
                      <option>1:64</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-xl font-light">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[12px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                    PRICE (₱)
                  </label>
                  <input
                    type="text"
                    defaultValue={activeItem?.price}
                    className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest outline-none focus:border-primary-container transition-all text-white tabular-nums"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                    STOCK
                  </label>
                  <input
                    type="text"
                    defaultValue={activeItem?.stock}
                    className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest outline-none focus:border-primary-container transition-all text-white tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[12px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                  MODEL IMAGE
                </label>
                <div className="w-full h-56 bg-black/40 border border-dashed border-white/10 flex flex-col items-center justify-center group cursor-pointer hover:border-primary-container transition-all duration-500 rounded-[2px] relative overflow-hidden">
                  {activeItem?.img && (
                    <img
                      src={activeItem.img}
                      className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl font-light opacity-20 mb-4 group-hover:text-primary-container group-hover:opacity-100 transition-all duration-500">
                      cloud_upload
                    </span>
                    <p className="text-[12px] font-headline font-bold uppercase tracking-[0.3em]">
                      <span className="opacity-20 group-hover:opacity-40 transition-opacity">
                        DRAG & DROP OR
                      </span>{" "}
                      <span className="text-[#C8102E] group-hover:text-primary-container transition-colors">
                        BROWSE
                      </span>
                    </p>
                    <p className="text-[8px] text-white/10 mt-3 uppercase tracking-[0.1em]">
                      High-res PNG/JPG preferred.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/[0.03] flex items-center justify-between">
                <div className="flex flex-col">
                  <label className="text-[12px] font-headline font-bold uppercase tracking-[0.3em] text-white/60">
                    ACTIVE LISTING
                  </label>
                  <p className="text-[8px] text-white/10 uppercase tracking-[0.1em] mt-1 italic">
                    Visible to all potential clients
                  </p>
                </div>
                <button
                  className="w-16 h-8 bg-black border border-white/10 rounded-full relative p-1.5 transition-all hover:border-[#C8102E]/40"
                  onClick={(e) => {
                    e.currentTarget.classList.toggle("bg-[#C8102E]");
                    e.currentTarget.firstChild.classList.toggle(
                      "translate-x-8",
                    );
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full transition-transform duration-300 pointer-events-none" />
                </button>
              </div>
            </div>

            <footer className="p-10 border-t border-white/[0.03] grid grid-cols-2 gap-6 bg-black">
              <button
                onClick={() => setIsEditDrawerOpen(false)}
                className="h-16 border border-white/5 rounded-[2px] text-[12px] font-black font-headline uppercase tracking-[0.3em] hover:bg-white/[0.03] transition-all opacity-40 hover:opacity-100"
              >
                DISCARD CHANGES
              </button>
              <button className="h-16 bg-[#C8102E] rounded-[2px] text-[12px] font-black font-headline uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-[#C8102E]/20">
                SAVE PRODUCT
              </button>
            </footer>
          </aside>
        </>
      )}

      {/* --- Add Product Modal --- */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        showToast={showToast}
        onSuccess={fetchInventoryProduct} // refresh kaagad once na may bagong added na product
      />

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(200, 16, 46, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(200, 16, 46, 0.5);
        }
      `}</style>
    </div>
  );
}
