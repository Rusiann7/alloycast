"use client";

import { useState, useEffect } from "react";
import AddProductModal from "../../components/AddProductModal";
import Toast from "../../components/Toast";
import { createClient } from "../../../lib/supabase/client";

export default function AdminInventory() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null); // holds the id of EACH product
  const [editProductForm, setEditProductForm] = useState({}); // holds the temporary form data from editing fields
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const supabase = createClient();

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

  // calculate total stock and inventory count and show in Header
  const totalProductStock = inventory.reduce(
    (sum, item) => sum + (Number(item.stock) || 0),
    0,
  );
  const totalProducts = inventory.length;

  // start edit function
  const startEditProduct = (item) => {
    setEditingProductId(item.id); // sets the current row selected to edit
    setEditProductForm({ ...item }); // prefill the inputs with current data (original data)
  };

  // edit function
  const editProduct = (e) => {
    const { name, value, type, files } = e.target;

    // For file inputs, we need to take files[0], not value
    if (type === "file" && files[0]) {
      const file = files[0];
      setEditProductForm((prev) => ({
        ...prev,
        [name]: file,
        preview: URL.createObjectURL(file), // create local preview URL
      }));
    } else {
      setEditProductForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // save edit function
  const saveEditProduct = async () => {
    try {
      let imageUrl = editProductForm.item_image;

      // 1. If item_image is a File object, it means a new image was selected
      if (editProductForm.item_image instanceof File) {
        const file = editProductForm.item_image;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("Inventory")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("Inventory").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // 2. Perform the update
      const { error } = await supabase
        .from("Inventory")
        .update({
          item_name: editProductForm.item_name,
          brand: editProductForm.brand,
          category: editProductForm.category,
          price: editProductForm.price,
          stock: editProductForm.stock,
          item_image: imageUrl,
        })
        .eq("id", editingProductId);

      if (error) throw error;
      showToast("Updated successfully!", "success");
      setEditingProductId(null);
      fetchInventoryProduct();
    } catch (error) {
      showToast("Update failed: " + error.message);
    }
  };

  // delete product
  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to remove this item?")) return;

    try {
      const { error } = await supabase.from("Inventory").delete().eq("id", id); // .eq delete only the selected product
      if (error) throw error;
      showToast("Product removed!", "success");
      fetchInventoryProduct(); // reload the page to display updated products
    } catch (error) {
      showToast("Failed to remove product");
      console.error(error.message);
    }
  };
  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-hidden select-none">
      {/* --- Main Content --- */}
      <main className="lg:ml-64 pt-28 lg:pt-10 min-h-screen ">
        <div className="px-10 pb-40">
          {/* Section Header */}
          <div className="mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl text-primary-container font-black font-headline tracking-tighter uppercase italic leading-none">
              INVENTORY
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
            <div className="flex-1 flex items-center gap-5  border border-white/[0.1] px-6 h-14 rounded-lg">
              <span className="material-symbols-outlined  text-xl font-light">
                search
              </span>
              <input
                type="text"
                placeholder="FILTER BY BRAND, SCALE, OR SKU..."
                className="bg-transparent border-none outline-none text-md font-headline font-bold tracking-[0.1em] w-full placeholder:opacity-10 text-white"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-14 px-8 bg-primary-container rounded-lg text-md text-black/90 font-black font-headline uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-[#C8102E]/20 hidden sm:block"
            >
              ADD PRODUCT
            </button>
          </div>

          {/* Inventory Table */}
          <div
            className="bg-[#111111]/40 border border-white/[0.03] rounded-lg overflow-hidden reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            <table className="w-full  text-left border-collapse ">
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
                {/* TO REVIEW */}
                {inventory.map((item) => (
                  <tr
                    key={item.id}
                    className={`group hover:bg-white/[0.01] transition-all duration-300 ${
                      editingProductId === item.id ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    {/* IMAGE */}
                    <td className="px-8 py-5">
                      <div
                        onClick={() =>
                          editingProductId === item.id &&
                          document.getElementById(`file-${item.id}`).click()
                        }
                        className={`w-full h-40 bg-black/40 rounded-[1px] overflow-hidden border border-white/5 group-hover:border-primary-container/30 transition-all duration-500 relative ${
                          editingProductId === item.id ? "cursor-pointer" : ""
                        }`}
                      >
                        {editingProductId === item.id && (
                          <input
                            id={`file-${item.id}`}
                            type="file"
                            name="item_image"
                            className="hidden"
                            accept="image/*"
                            onChange={editProduct}
                          />
                        )}
                        <img
                          src={
                            editingProductId === item.id &&
                            editProductForm.preview
                              ? editProductForm.preview
                              : item.item_image || "/placeholder-car.png"
                          }
                          alt={item.item_name}
                          className={`w-full h-40 object-cover group-hover:scale-110 transition-all duration-700 ${
                            editingProductId === item.id ? "opacity-40" : ""
                          }`}
                        />
                        {editingProductId === item.id && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                            <span className="material-symbols-outlined text-white text-2xl mb-2">
                              add_a_photo
                            </span>
                            <span className="text-[8px] font-headline font-bold uppercase tracking-widest text-white/60">
                              CHANGE
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="px-8 py-5 text-center">
                      {editingProductId === item.id ? (
                        <input
                          name="item_name"
                          value={editProductForm.item_name}
                          onChange={editProduct}
                          className="w-full bg-black/60 border border-primary-container/30 p-2 text-xs font-headline uppercase outline-none focus:border-primary-container text-white"
                        />
                      ) : (
                        <p className="text-lg text-white font-bold font-headline uppercase tracking-tight group-hover:text-primary-container transition-colors duration-300">
                          {item.item_name}
                        </p>
                      )}
                    </td>

                    {/* Brand */}
                    <td className="px-8 py-5 text-center">
                      {editingProductId === item.id ? (
                        <select
                          name="brand"
                          value={editProductForm.brand}
                          onChange={editProduct}
                          className="w-full bg-black/60 border border-primary-container rounded/30 p-2 text-xs font-headline uppercase outline-none focus:border-primary-container text-white"
                        >
                          <option value="Hot Wheels">Hot Wheels</option>
                          <option value="Tomica">Tomica</option>
                          <option value="Majorette">Majorette</option>
                          <option value="Auto World">Auto World</option>
                          <option value="Mini GT">Mini GT</option>
                          <option value="Bburago">Bburago</option>
                          <option value="Maisto">Maisto</option>
                          <option value="Others">Others...</option>
                        </select>
                      ) : (
                        <span className="bg-white/5  border border-white/10 rounded-lg text-primary-color px-2.5 py-1 rounded-[1px] text-sm font-black tracking-[0.1em]">
                          {item.brand}
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-8 py-5 text-center">
                      {editingProductId === item.id ? (
                        <select
                          name="category"
                          value={editProductForm.category}
                          onChange={editProduct}
                          className="w-full bg-black/60 border border-primary-container/30 p-2 text-xs font-headline uppercase outline-none focus:border-primary-container text-white"
                        >
                          <option value="Mainline">Mainline Series</option>
                          <option value="Special">Special Series</option>
                          <option value="Premium">Premium Series</option>
                          <option value="Chase">Chase Series</option>
                        </select>
                      ) : (
                        <p className="text-md text-white  font-headline uppercase tracking-[0.2em]">
                          {item.category}
                        </p>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-8 py-5 text-center">
                      {editingProductId === item.id ? (
                        <input
                          name="price"
                          type="number"
                          value={editProductForm.price}
                          onChange={editProduct}
                          className="w-full bg-black/60 border border-primary-container/30 p-2 text-xs font-headline uppercase outline-none focus:border-primary-container text-white"
                        />
                      ) : (
                        <p className="text-md font-headline font-bold text-primary-container">
                          ₱{item.price}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-8 py-5 text-center">
                      {editingProductId === item.id ? (
                        <input
                          name="stock"
                          type="number"
                          value={editProductForm.stock}
                          onChange={editProduct}
                          className="w-full bg-black/60 border border-primary-container/30 p-2 text-xs font-headline uppercase outline-none focus:border-primary-container text-white"
                        />
                      ) : (
                        <p className="text-md text-white font-headline font-bold">
                          {item.stock}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-3">
                        {editingProductId === item.id ? (
                          <>
                            <button
                              onClick={saveEditProduct}
                              className="w-8 h-8 flex items-center justify-center bg-green-600/20 text-green-500 hover:bg-green-600/40 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">
                                check
                              </span>
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="w-8 h-8 flex items-center justify-center bg-white/5 text-white/40 hover:bg-white/10 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">
                                close
                              </span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditProduct(item)}
                              className="w-8 h-8 flex items-center justify-center bg-primary-container rounded-lg text-black hover:bg-secondary-container/80 hover:text-white/80 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => deleteProduct(item.id)}
                              className="w-8 h-8 flex items-center justify-center bg-error-container rounded-lg text-white hover:bg-error-container/40 hover:text-white/90 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">
                                delete
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

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
