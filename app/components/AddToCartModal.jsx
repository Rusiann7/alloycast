"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createClient } from "../../lib/supabase/client";
import dynamic from "next/dynamic";

const DynamicToast = dynamic(() => import("./Toast"));

const supabase = createClient();

export default function AddToCartModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  // Client-side mount check for portal safety
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset quantity when modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  // Strict quantity validation — no negatives, no letters, no exceeding stock
  const handleQuantityChange = (e) => {
    const value = e.target.value;

    // Allow empty input for user to retype
    if (value === "") {
      setQuantity("");
      return;
    }

    const parsed = parseInt(value, 10);

    // Block non-numeric input
    if (isNaN(parsed)) return;

    // Block negatives and zero
    if (parsed < 1) {
      setQuantity(1);
      return;
    }

    // Cap at available stock
    if (parsed > product?.stock) {
      setQuantity(product.stock);
      showToast(`Maximum available stock is ${product.stock}`, "error");
      return;
    }

    setQuantity(parsed);
  };

  // Prevent invalid keyboard input (letters, minus, decimal, e)
  const handleKeyDown = (e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Dynamic total price
  const unitPrice = product?.price || 0;
  const totalPrice = quantity === "" ? 0 : unitPrice * quantity;

  // Upsert into Cart table
  const handleConfirm = async () => {
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      showToast("Please enter a valid quantity of at least 1.", "error");
      return;
    }
    if (parsedQuantity > product?.stock) {
      showToast(
        `Cannot add more than the available stock of ${product.stock} units.`,
        "error",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Get the authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        showToast("Please log in to add items to cart.", "error");
        setIsSubmitting(false);
        return;
      }

      // Fetch the Customer table id matching user.id
      const { data: custData, error: custError } = await supabase
        .from("Customer")
        .select(`*`, "Inventory(id, item_name, item_image, stock, price")
        .eq("user_id", user.id)
        .maybeSingle();

      if (custError || !custData) {
        console.error("Error fetching customer profile:", custError?.message);
        showToast(
          "Customer profile not found. Please complete registration.",
          "error",
        );
        setIsSubmitting(false);
        return;
      }

      // Upsert — insert if new, update quantity & price if duplicate
      const { error } = await supabase.from("Cart").upsert(
        {
          customer_id: custData.id,
          inventory_id: product.id,
          item_name: product.item_name,
          item_image: product.item_image || "",
          quantity: parsedQuantity,
          price: unitPrice * parsedQuantity,
        },
        {
          onConflict: "customer_id,inventory_id",
        },
      );

      if (error) {
        console.error("Cart upsert error:", error.message);
        showToast("Failed to add item to cart.", "error");
      } else {
        showToast("Item added to cart!", "success");
        if (onSuccess) onSuccess();
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  if (!isOpen || !product) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-modal-background rounded-xl w-full max-w-md shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h3 className="text-xl font-black text-white tracking-tight">
            Add to Cart
          </h3>
          <button
            onClick={handleClose}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5 border-b border-white/10">
          {/* Product Image */}
          <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-black/20">
            <img
              src={product.item_image || "/placeholder-car.png"}
              alt={product.item_name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-white">
              {product.item_name}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
                Unit Price
              </span>
              <span className="text-white font-bold text-sm">
                ₱{unitPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
                Available Stock
              </span>
              <span
                className={`font-bold text-sm ${
                  product.stock <= 3
                    ? "text-red-400 animate-pulse"
                    : "text-white"
                }`}
              >
                {product.stock} {product.stock <= 3 ? "— Low Stock!" : ""}
              </span>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              {/* Decrement Button */}
              <button
                onClick={() =>
                  setQuantity((prev) => Math.max(1, (prev || 1) - 1))
                }
                disabled={quantity <= 1}
                className="size-10 flex items-center justify-center rounded-lg bg-input-field text-white/80 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">
                  remove
                </span>
              </button>

              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-input-field border border-white/10 rounded-lg px-4 py-3 text-white text-sm text-center font-bold outline-none focus:border-primary-container/60 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              {/* Increment Button */}
              <button
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(product.stock, (prev || 0) + 1),
                  )
                }
                disabled={quantity >= product.stock}
                className="size-10 flex items-center justify-center rounded-lg bg-input-field text-white/80 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>

          {/* Dynamic Total Price */}
          <div className="flex items-center justify-between bg-input-field/50 rounded-lg px-4 py-3 border border-white/10">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
              Total Price
            </span>
            <span className="text-primary-container font-black text-lg">
              ₱{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="grid grid-cols-2">
          <button
            onClick={handleClose}
            className="py-4 text-xs font-black uppercase tracking-[0.2em] text-white/70 bg-secondary-container hover:bg-white/5 transition-colors border-r border-white/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || quantity === "" || quantity < 1}
            className="py-4 text-xs font-black uppercase tracking-[0.2em] text-black/90 bg-primary-container hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
                Adding...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">
                  add_shopping_cart
                </span>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
