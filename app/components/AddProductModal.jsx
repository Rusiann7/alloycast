import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const AddProductModal = ({ isOpen, onClose, showToast, onSuccess }) => {
  const [addFormData, setAddFormData] = useState({
    item_name: "",
    item_brand: "",
    category: "",
    price: 0,
    stock: 0,
    item_image: "",
  });
  const [preview, setPreview] = useState(null);
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = React.useRef(null); // pang kuha ng image file
  if (!isOpen) return null;

  const getInputValue = (e) => {
    const { name, value, type, files } = e.target;
    // For file inputs, we need to take files[0], not value
    const finalValue = type === "file" ? files[0] : value;
    setAddFormData((prevAddFormData) => ({
      ...prevAddFormData,
      [name]: finalValue,
    }));

    // Handle preview for images
    if (type === "file" && files[0]) {
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  // function para mag-add product sa Inventory Table
  const addProduct = async (e) => {
    e.preventDefault();
    let imageUrl = ""; // para sa image string url

    //upload muna ung image sa Supabase Storage
    if (addFormData.item_image) {
      const file = addFormData.item_image; // mula sa addFormData state
      const fileExt = file.name.split(".").pop(); // pang extract ng file extension
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`; // allows duplication of image with unique each
      const filePath = `product-images/${fileName}`; // storage path

      const { data: uploadData, error: uploadError } = await supabase.storage //insert sa Supabase Storage Bucket
        .from("Inventory") // Inventory Table
        .upload(filePath, file); // img

      if (uploadError) {
        showToast("Error uploading image: " + uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("Inventory")
        .getPublicUrl(filePath, file, { upsert: true });

      imageUrl = publicUrl;
    }
    const { data, error } = await supabase.from("Inventory").insert([
      //upload ung inventory sa Inventory Table
      {
        item_name: addFormData.item_name,
        brand: addFormData.item_brand,
        category: addFormData.category,
        price: addFormData.price,
        stock: addFormData.stock,
        item_image: imageUrl,
      },
    ]);

    if (error) {
      showToast("Error adding product to Inventory");
    } else {
      showToast("Product successfully added to Inventory", "success");
      if (onSuccess) onSuccess(); // refresh agad
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <form
        onSubmit={addProduct}
        className="relative w-full max-w-3xl bg-[#0F0F0F] border border-white/[0.05] shadow-[0_0_100px_rgba(0,0,0,1)] rounded-[2px] animate-slide-in-up flex flex-col max-h-[90vh]"
      >
        <header className="p-8 lg:p-10 border-b border-white/[0.03] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C8102E]/10 border border-[#C8102E]/20 flex items-center justify-center rounded-[2px]">
              <span className="material-symbols-outlined text-[#C8102E] text-2xl">
                add_box
              </span>
            </div>
            <div>
              <h4 className="text-3xl font-black font-headline uppercase tracking-tighter italic leading-none">
                ADD PRODUCT
              </h4>
              <p className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-white/40 mt-1">
                NEW INVENTORY ENTRY
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center border border-white/5 hover:bg-white/5 transition-colors rounded-[2px] group"
          >
            <span className="material-symbols-outlined  group-hover:opacity-100 group-hover:rotate-90 transition-all text-xl font-light">
              close
            </span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 custom-scrollbar">
          {/* Name */}
          <div className="space-y-3">
            <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-[#C8102E] pl-2">
              ITEM NAME
            </label>
            <input
              name="item_name"
              type="text"
              value={addFormData.item_name}
              required
              placeholder="e.g. Ferrari F40"
              className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold  tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
              onChange={getInputValue}
            />
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-[#C8102E] pl-2">
                BRAND
              </label>
              <select
                id="item_brand"
                name="item_brand"
                type="text"
                value={addFormData.item_brand}
                required
                className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold  tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
                onChange={getInputValue}
              >
                <option value="" disabled hidden>
                  Brand
                </option>
                <option value="Hot Wheels">Hot Wheels</option>
                <option value="Tomica">Tomica</option>
                <option value="Majorette">Majorette</option>
                <option value="Bburago">Bburago</option>
                <option value="Mini GT">Mini GT</option>
                <option value="Others">Others...</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-[#C8102E] pl-2">
                CATEGORY
              </label>
              <select
                id="category"
                name="category"
                type="text"
                value={addFormData.category}
                required
                className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold  tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
                onChange={getInputValue}
              >
                <option value="" disabled hidden>
                  Series
                </option>
                <option value="Mainline">Mainline Series</option>
                <option value="Special">Special Series</option>
                <option value="Premium">Premium Series</option>
                <option value="Chase">Chase Series</option>
                <option value="Others">Others...</option>
              </select>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-[#C8102E] pl-2">
                PRICE (₱)
              </label>
              <input
                name="price"
                type="number"
                value={addFormData.price}
                step="0.01"
                required
                placeholder="0.00"
                className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold  tracking-widest outline-none focus:border-primary-container transition-all text-white placeholder:text-white/10"
                onChange={getInputValue}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-[#C8102E] pl-2">
                STOCK
              </label>
              <input
                name="stock"
                type="number"
                required
                placeholder="0"
                className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold  tracking-widest outline-none focus:border-primary-container transition-all text-white placeholder:text-white/10"
                onChange={getInputValue}
              />
            </div>
          </div>

          {/* Item Image */}
          <div className="space-y-3">
            <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-[#C8102E] pl-2">
              ITEM IMAGE
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-48 bg-black/40 border border-dashed border-white/10 flex flex-col items-center justify-center group cursor-pointer hover:border-primary-container transition-all duration-500 rounded-[2px] relative overflow-hidden"
            >
              <input
                type="file"
                name="item_image"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={getInputValue}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                />
              ) : (
                <div className="relative z-10 flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl font-light opacity-20 mb-4 group-hover:text-primary-container group-hover:opacity-100 transition-all duration-500">
                    add_photo_alternate
                  </span>
                  <p className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]">
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
              )}
            </div>
          </div>
        </div>

        <footer className="p-8 border-t border-white/[0.03] flex justify-end gap-4 bg-black rounded-b-[2px] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-8 h-12 border border-white/5 rounded-[2px] text-[10px] font-black font-headline uppercase tracking-[0.3em] hover:bg-white/[0.03] transition-all  hover:opacity-100"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="px-8 h-12 bg-[#C8102E] rounded-[2px] text-[10px] font-black font-headline uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-[#C8102E]/20"
          >
            ADD PRODUCT
          </button>
        </footer>
      </form>
    </div>
  );
};

export default AddProductModal;
