"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import Scanner from "./Scanner";

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
  const [scannerOpen, setScannerOpen] = useState(false);
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

  // Input sanitization
  const sanitizeInput = (text) => {
    if (typeof text !== "string") return text;
    return text
      .trim()
      .replace(/<[^>]*>?/gm, "")
      .substring(0, 100);
  };

  // function para mag-add product sa Inventory Table
  const addProduct = async (e) => {
    e.preventDefault();
    let imageUrl = ""; // para sa image string url

    //upload muna ung image sa Supabase Storage
    if (addFormData.item_image) {
      const file = addFormData.item_image; // mula sa addFormData state
      const fileExt = file.name.split(".").pop(); // pang extract ng file extension

      // image input sanitization
      const sanitizeImage = (file) => {
        const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        const maxSize = 2 * 1024 * 1024; // 2MB
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (
          !allowedExtensions.includes(fileExtension) ||
          !allowedMimeTypes.includes(file.type)
        ) {
          throw new Error(
            "Invalid file type. Only JPG, PNG, and WEBP are allowed.",
          );
        }
        if (file.size > maxSize) {
          throw new Error("File is too large. Maximum size is 2MB.");
        }
        const safeName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();

        return safeName;
      };
      if (file) {
        try {
          const safeFileName = sanitizeImage(file);
          const filePath = `${Date.now()}_${safeFileName}`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage //insert sa Supabase Storage Bucket
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
        } catch (err) {
          showToast(err.message, "error");
          return;
        }
      }
    }

    const sanitizedInput = {
      item_name: sanitizeInput(addFormData.item_name),
      brand: addFormData.item_brand, // These come from <select>, so they are safer
      category: addFormData.category,
      price: Math.abs(parseFloat(addFormData.price)) || 0, // Ensure price is positive
      stock: Math.abs(parseInt(addFormData.stock)) || 0, // Ensure stock is positive
    };

    const { data, error } = await supabase.from("Inventory").insert([
      //upload ung inventory sa Inventory Table
      {
        item_name: sanitizedInput.item_name,
        brand: sanitizedInput.brand,
        category: sanitizedInput.category,
        price: sanitizedInput.price,
        stock: sanitizedInput.stock,
        item_image: imageUrl,
      },
    ]);

    if (error) {
      alert("SUPABASE ERROR:", error.message);
      showToast("Error adding product to Inventory");
    } else {
      showToast("Product successfully added to Inventory", "success");
      if (onSuccess) onSuccess(); // refresh agad
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
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
            <div className="w-12 h-12 bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-center rounded-[2px]">
              <span className="material-symbols-outlined text-primary-container text-2xl">
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
            className="w-10 h-10 flex items-center justify-center border border-white/5 hover:bg-white/5 rounded-lg transition-colors rounded-[2px] group"
          >
            <span className="material-symbols-outlined  group-hover:opacity-100 group-hover:rotate-90 transition-all text-xl font-light">
              close
            </span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 custom-scrollbar">
          {/* Name */}
          <div className="space-y-3">
            <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-primary-container pl-2">
              ITEM NAME
            </label>
            <input
              name="item_name"
              type="text"
              value={addFormData.item_name}
              required
              placeholder="e.g. Ferrari F40"
              className="w-full bg-black/40 border border-white/[0.03] rounded-lg h-14 px-6 text-sm font-headline font-bold  tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
              onChange={getInputValue}
            />
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-primary-container pl-2">
                BRAND
              </label>
              <select
                id="item_brand"
                name="item_brand"
                type="text"
                value={addFormData.item_brand}
                required
                className="w-full bg-black/40 border border-white/[0.03] rounded-lg h-14 px-6 text-sm font-headline font-bold  tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
                onChange={getInputValue}
              >
                <option value="" disabled hidden>
                  Brand
                </option>
                <option value="Hot Wheels">Hot Wheels</option>
                <option value="Tomica">Tomica</option>
                <option value="Majorette">Majorette</option>
                <option value="Auto World">Auto World</option>
                <option value="Mini GT">Mini GT</option>
                <option value="Bburago">Bburago</option>
                <option value="Maisto">Maisto</option>
                <option value="Others">Others...</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-primary-container pl-2">
                CATEGORY
              </label>
              <select
                id="category"
                name="category"
                type="text"
                value={addFormData.category}
                required
                className="w-full bg-black/40 border border-white/[0.03] rounded-lg h-14 px-6 text-sm font-headline font-bold  tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
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
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-primary-container pl-2">
                PRICE (₱)
              </label>
              <input
                name="price"
                type="number"
                value={addFormData.price}
                step="0.01"
                required
                placeholder="0.00"
                className="w-full bg-black/40 border border-white/[0.03] rounded-lg h-14 px-6 text-sm font-headline font-bold  tracking-widest outline-none focus:border-primary-container transition-all text-white placeholder:text-white/10"
                onChange={getInputValue}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-primary-container pl-2">
                STOCK
              </label>
              <input
                name="stock"
                type="number"
                required
                placeholder="0"
                className="w-full bg-black/40 border border-white/[0.03] rounded-lg h-14 px-6 text-sm font-headline font-bold  tracking-widest outline-none focus:border-primary-container transition-all text-white placeholder:text-white/10"
                onChange={getInputValue}
              />
            </div>
          </div>

          {/* Item Image */}
          <div className="space-y-3">
            <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em]  inline-block border-l-2 border-primary-container pl-2">
              ITEM IMAGE
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-48 bg-black/40 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center group cursor-pointer hover:border-primary-container transition-all duration-500 rounded-[2px] relative overflow-hidden"
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
                  <p className="text-[12px] font-headline font-bold uppercase tracking-[0.3em]">
                    <span className="opacity-20 group-hover:opacity-40 transition-opacity">
                      DRAG & DROP OR
                    </span>{" "}
                    <span className="text-primary-container group-hover:text-primary-container transition-colors">
                      BROWSE
                    </span>
                  </p>
                  <p className="text-[8px] text-white/90 mt-3 uppercase tracking-[0.1em]">
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
            className="px-8 h-12 border border-white/5 rounded-lg text-[10px] font-black font-headline uppercase tracking-[0.3em] hover:bg-white/[0.03] transition-all  hover:opacity-100"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="px-8 h-12 border border-white/5 rounded-lg text-[10px] font-black font-headline uppercase tracking-[0.3em] hover:bg-white/[0.03] transition-all  hover:opacity-100"
          >
            SCAN PRODUCT
          </button>
          <button
            type="submit"
            className="px-8 h-12 bg-primary-container rounded-lg text-[10px] text-black/80 font-black font-headline uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-[#C8102E]/20"
          >
            ADD PRODUCT
          </button>
        </footer>
      </form>

      <Scanner
        scannerOpen={scannerOpen}
        scannerClose={() => setScannerOpen(false)}
      />
    </div>
  );
};

export default AddProductModal;
