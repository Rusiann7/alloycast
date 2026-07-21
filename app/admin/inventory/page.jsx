"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase/client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { TableSkeleton } from "../../components/Skeleton";

const DynamicAddProductModal = dynamic(
  () => import("../../components/AddProductModal"),
  {
    ssr: false,
  },
);

const DynamicToast = dynamic(() => import("../../components/Toast"), {
  ssr: false,
});

const DynamicDeleteConfirmationModal = dynamic(
  () => import("../../components/DeleteConfirmationModal"),
  { ssr: false },
);

const supabase = createClient();

export default function AdminInventory() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null); // holds the id of EACH product
  const [editProductForm, setEditProductForm] = useState({}); // holds the temporary form data from editing fields
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null); // for checking auth users
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const itemsPerPage = 5;

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  // for checking if user is currently logged
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Supabase Auth User:", user);
      setUser(user); // if user is authenticated
    };
    checkUser(); // calls the checkUser function
  }, []);

  // kunin mga product sa loob ng Inventory Table
  const fetchInventoryProduct = useCallback(async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from("Inventory")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setInventory(data || []); // ilagay sa inventory state ung nafetch na product
      console.log(data);
      console.log("Product Fetched successfully");
    } catch (error) {
      showToast("Error fetching products from Inventory");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // load products mula sa inventory kada refresh ng page ONCE
  useEffect(() => {
    const intializeFunction = async () => {
      fetchInventoryProduct();
    };
    intializeFunction();
  }, [fetchInventoryProduct]);

  // // calculate total stock and inventory count and show in Header
  const totalProductStock = inventory.reduce(
    (sum, item) => sum + (Number(item.stock) || 0),
    0,
  );
  // const totalProducts = inventory.length;
  const searchedInventory = inventory.filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalProducts = searchedInventory.length;

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

      const oldRow = inventory.find((item) => item.id === editingProductId);
      if (!oldRow) throw new Error("Original product not found in local state");

      // 2. Perform the update
      const { error: updateError } = await supabase
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

      if (updateError) throw updateError;

      const { error: historyError } = await supabase.from("History").insert({
        product_id: editingProductId,
        item_name: oldRow.item_name,
        brand: oldRow.brand,
        category: oldRow.category,
        price: oldRow.price,
        stock: oldRow.stock,
        item_image: oldRow.item_image,
        user_id: user.id,
        comment: "Updated",
      });

      if (historyError) throw historyError;

      showToast("Product Details Successfully Updated!", "success");
      setEditingProductId(null);
      fetchInventoryProduct();
    } catch (error) {
      showToast("Update failed: " + error.message);
    }
  };

  // delete product
  const confirmDeleteProduct = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const oldRow = inventory.find((item) => item.id === itemToDelete.id);
      if (!oldRow) throw new Error("Original product not found in local state");

      const { error: historyError } = await supabase.from("History").insert({
        product_id: editingProductId,
        item_name: oldRow.item_name,
        brand: oldRow.brand,
        category: oldRow.category,
        price: oldRow.price,
        stock: oldRow.stock,
        item_image: oldRow.item_image,
        user_id: user.id,
        comment: "Deleted",
      });

      if (historyError) throw historyError;

      const { error } = await supabase
        .from("Inventory")
        .delete()
        .eq("id", itemToDelete.id); // .eq delete only the selected product
      if (error) throw error;
      showToast("Product removed!", "success");
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchInventoryProduct(); // reload the page to display updated products
    } catch (error) {
      showToast("Failed to remove product");
      console.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="text-white/90 min-h-screen font-body relative overflow-hidden select-none">
      {/* --- Main Content --- */}
      <main className="pl-0 lg:pl-[var(--sidebar-width)] ml-5 pt-24 lg:pt-5 px-6 lg:px-8 pb-12 min-h-screen transition-all duration-300">
        <div className="px-4 sm:px-10 pb-40">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl text-font-color font-black font-headline tracking-tighter uppercase italic leading-none mb-4 sm:mb-0">
              INVENTORY
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-font-color">
                TOTAL STOCKS:{" "}
                <span className="text-font-color font-bold">
                  {totalProductStock.toLocaleString()}
                </span>{" "}
              </p>
              <div className="hidden sm:block w-1 h-1 bg-secondary-container rounded-full" />
              <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-font-color">
                TOTAL ITEMS:{" "}
                <span className="text-font-color">{totalProducts}</span>
              </p>
            </div>
          </div>
          {/* Search/Filter Bar */}
          <div
            className="bg-secondary-container shadow-lg/30 p-4 sm:p-5 rounded-lg mb-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 reveal-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-full sm:flex-1 flex items-center gap-4 sm:gap-5 border border-primary-container px-4 sm:px-6 h-14 rounded-lg bg-input-field">
              <span className="material-symbols-outlined text-xl font-light opacity-80">
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
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto h-14 px-8 bg-primary-container rounded-lg text-sm text-black font-black font-headline uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary-container/20 flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined text-lg sm:hidden">
                add
              </span>
              ADD PRODUCT
            </button>
          </div>

          {/* Inventory Table */}
          {loading ? (
            <div className="mt-8">
              <TableSkeleton columns={7} rows={5} />
            </div>
          ) : (
            <div
              className="bg-secondary-container shadow-lg/30 rounded-lg overflow-x-auto reveal-up scrollbar-hide"
              style={{ animationDelay: "0.2s" }}
            >
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="border-b border-primary-container">
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
                  {/* TO REVIEW */}
                  {searchedInventory.length > 0 ? (
                    searchedInventory
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage,
                      )
                      .map((item) => (
                        <tr
                          key={item.id}
                          className={`group hover:bg-white/[0.01] transition-all duration-300 border-b border-primary-container ${
                            editingProductId === item.id
                              ? "bg-white/[0.03]"
                              : ""
                          }`}
                        >
                          {/* IMAGE */}
                          <td className="px-8 py-5">
                            <div
                              onClick={() =>
                                editingProductId === item.id &&
                                document
                                  .getElementById(`file-${item.id}`)
                                  .click()
                              }
                              className={`w-full h-40 bg-black/40 rounded-[1px] overflow-hidden border border-white/5 group-hover:border-primary-container/30 transition-all duration-500 relative ${
                                editingProductId === item.id
                                  ? "cursor-pointer"
                                  : ""
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
                              <Image
                                fill
                                src={
                                  editingProductId === item.id &&
                                  editProductForm.preview
                                    ? editProductForm.preview
                                    : item.item_image || "/placeholder-car.png"
                                }
                                alt={item.item_name}
                                className={`w-full h-40 object-cover group-hover:scale-110 transition-all duration-700   ${
                                  editingProductId === item.id
                                    ? "opacity-40"
                                    : ""
                                }`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                loading="lazy"
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
                                type="text"
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
                              <span className="text-center text-primary-color  text-md font-black">
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
                                <option value="Mainline">
                                  Mainline Series
                                </option>
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
                                value={editProductForm.stock || 0}
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
                                    onClick={() => {
                                      setItemToDelete(item);
                                      setDeleteModalOpen(true);
                                    }}
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
                      ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-80">
                          <span className="material-symbols-outlined text-6xl">
                            inventory_2
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
          )}
        </div>
      </main>

      {/* --- Add Product Modal --- */}
      <DynamicAddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        showToast={showToast}
        onSuccess={fetchInventoryProduct} // refresh kaagad once na may bagong added na product
      />

      <DynamicDeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteProduct}
        itemName={itemToDelete?.item_name}
        itemType="Product"
        isDeleting={isDeleting}
      />

      <DynamicToast
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
