"use client";

import { useState } from "react";

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  product,
  quantity,
  setQuantity,
  orderType = null,
  setOrderType,
  deliveryType = null,
  setDeliveryType,
  paymentType = null,
  setPaymentType,
  isDiscountActive = false,
  onConfirm,
  showToast,
  onOrderTypeChange,
  onDeliveryTypeChange,
  onPaymentTypeChange,
}) {
  // "selection" (buttons + quantity picker) or "summary" (only order summary)
  const [userStep, setUserStep] = useState("selection");

  if (!isOpen || !product) return null;

  const handleClose = () => {
    setUserStep("selection");
    onClose?.();
  };

  const handleSelectOrderType = (type) => {
    setOrderType?.(type);
    onOrderTypeChange?.(type);

    if (type === "Pickup") {
      setDeliveryType?.("DoorToDoor");
      onDeliveryTypeChange?.("DoorToDoor");
      // Reset payment mode so user chooses Cash or Online via buttons
      setPaymentType?.(null);
      onPaymentTypeChange?.(null);
    } else {
      // Delivery: reset deliveryType and paymentType so user chooses DoorToDoor or LbcBranch
      setDeliveryType?.(null);
      onDeliveryTypeChange?.(null);
      setPaymentType?.(null);
      onPaymentTypeChange?.(null);
    }
  };

  const handleSelectPayment = (mode) => {
    setPaymentType?.(mode);
    onPaymentTypeChange?.(mode);
  };

  const handleSelectDeliveryType = (delType) => {
    setDeliveryType?.(delType);
    onDeliveryTypeChange?.(delType);
    const mode = delType === "LbcBranch" ? "Cash" : "Online";
    setPaymentType?.(mode);
    onPaymentTypeChange?.(mode);
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setQuantity?.("");
      return;
    }
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      setQuantity?.("");
    } else if (parsed > product.stock) {
      setQuantity?.(product.stock);
      if (showToast) {
        showToast(
          `Quantity capped at maximum available stock (${product.stock})`,
          "error",
        );
      }
    } else if (parsed < 1) {
      setQuantity?.(1);
    } else {
      setQuantity?.(parsed);
    }
  };

  const handleDecreaseQuantity = () => {
    const current = parseInt(quantity, 10) || 1;
    if (current > 1) {
      setQuantity?.(current - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    const current = parseInt(quantity, 10) || 1;
    if (current < product.stock) {
      setQuantity?.(current + 1);
    } else if (showToast) {
      showToast(
        `Quantity capped at maximum available stock (${product.stock})`,
        "error",
      );
    }
  };

  const isSelectionReady =
    (orderType === "Pickup" && Boolean(paymentType)) ||
    (orderType === "Delivery" && Boolean(deliveryType));

  // If selection is complete and user has advanced, display summary view; otherwise selection view
  const currentStep = isSelectionReady && userStep === "summary" ? "summary" : "selection";

  const unitPrice = isDiscountActive
    ? Number(product.price) - Number(product.discount)
    : Number(product.price);
  const parsedQty = parseInt(quantity, 10) || 1;
  const totalPrice = unitPrice * parsedQty;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative my-auto w-full max-w-md bg-modal-background border border-white/10 rounded-xl p-5 sm:p-6 text-font-color shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-5">
          <h2 className="text-xl sm:text-2xl font-headline font-black uppercase italic leading-tight flex-1 pr-4">
            Order Confirmation
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="material-symbols-outlined flex-shrink-0 bg-on-primary text-white/90 rounded-full p-1.5 transition-colors cursor-pointer hover:bg-white/20"
            aria-label="Close reservation modal"
          >
            close
          </button>
        </div>

        {/* STEP 1: SELECTION SCREEN (Buttons + Quantity Picker) */}
        {currentStep === "selection" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Order Type Buttons */}
            <div>
              <label className="block text-xs font-headline font-bold uppercase tracking-wider text-white/70 mb-2">
                Order Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Pickup Option */}
                <button
                  type="button"
                  id="pickup-option-btn"
                  onClick={() => handleSelectOrderType("Pickup")}
                  className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${orderType === "Pickup"
                      ? "border-primary-container bg-primary-container/15 text-primary-container shadow-md ring-1 ring-primary-container font-black"
                      : "border-white/10 bg-input-field/50 text-white/70 hover:border-white/30 hover:text-white hover:bg-input-field/80"
                    }`}
                >
                  <span className="material-symbols-outlined text-3xl sm:text-4xl mb-1.5 transition-transform">
                    storefront
                  </span>
                  <span className="font-headline font-bold text-sm sm:text-base uppercase tracking-wider">
                    Pickup
                  </span>
                  <span className="text-[10px] text-white/50 tracking-wider font-sans mt-0.5">
                    In-Store Claim
                  </span>
                </button>

                {/* Delivery Option */}
                <button
                  type="button"
                  id="delivery-option-btn"
                  onClick={() => handleSelectOrderType("Delivery")}
                  className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${orderType === "Delivery"
                      ? "border-primary-container bg-primary-container/15 text-primary-container shadow-md ring-1 ring-primary-container font-black"
                      : "border-white/10 bg-input-field/50 text-white/70 hover:border-white/30 hover:text-white hover:bg-input-field/80"
                    }`}
                >
                  <span className="material-symbols-outlined text-3xl sm:text-4xl mb-1.5 transition-transform">
                    local_shipping
                  </span>
                  <span className="font-headline font-bold text-sm sm:text-base uppercase tracking-wider">
                    Delivery
                  </span>
                  <span className="text-[10px] text-white/50 tracking-wider font-sans mt-0.5">
                    Outside the City
                  </span>
                </button>
              </div>
            </div>

            {/* Mode of Payment Buttons (if Pickup) */}
            {orderType === "Pickup" && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-headline font-bold uppercase tracking-wider text-white/70 mb-2">
                  Mode of Payment
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="pickup-cash-btn"
                    onClick={() => handleSelectPayment("Cash")}
                    className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${paymentType === "Cash"
                        ? "border-primary-container bg-primary-container/15 text-primary-container shadow-md ring-1 ring-primary-container font-black"
                        : "border-white/10 bg-input-field/50 text-white/70 hover:border-white/30 hover:text-white hover:bg-input-field/80"
                      }`}
                  >
                    <span className="material-symbols-outlined text-3xl sm:text-4xl mb-1.5 transition-transform">
                      payments
                    </span>
                    <span className="font-headline font-bold text-sm sm:text-base uppercase tracking-wider">
                      Cash
                    </span>
                    <span className="text-[10px] text-white/50 tracking-wider font-sans mt-0.5">
                      Pay Upon Pickup
                    </span>
                  </button>

                  <button
                    type="button"
                    id="pickup-online-btn"
                    onClick={() => handleSelectPayment("Online")}
                    className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${paymentType === "Online"
                        ? "border-primary-container bg-primary-container/15 text-primary-container shadow-md ring-1 ring-primary-container font-black"
                        : "border-white/10 bg-input-field/50 text-white/70 hover:border-white/30 hover:text-white hover:bg-input-field/80"
                      }`}
                  >
                    <span className="material-symbols-outlined text-3xl sm:text-4xl mb-1.5 transition-transform">
                      qr_code_2
                    </span>
                    <span className="font-headline font-bold text-sm sm:text-base uppercase tracking-wider">
                      Online
                    </span>
                    <span className="text-[10px] text-white/50 tracking-wider font-sans mt-0.5">
                      GCash / PayMongo
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Type Buttons (if Delivery) */}
            {orderType === "Delivery" && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-headline font-bold uppercase tracking-wider text-white/70 mb-2">
                  Delivery Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="delivery-doortodoor-btn"
                    onClick={() => handleSelectDeliveryType("DoorToDoor")}
                    className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${deliveryType === "DoorToDoor"
                        ? "border-primary-container bg-primary-container/15 text-primary-container shadow-md ring-1 ring-primary-container font-black"
                        : "border-white/10 bg-input-field/50 text-white/70 hover:border-white/30 hover:text-white hover:bg-input-field/80"
                      }`}
                  >
                    <span className="material-symbols-outlined text-3xl sm:text-4xl mb-1.5 transition-transform">
                      home
                    </span>
                    <span className="font-headline font-bold text-sm sm:text-base uppercase tracking-wider text-center leading-tight">
                      Door to Door
                    </span>
                    <span className="text-[10px] text-white/50 tracking-wider font-sans mt-0.5 text-center">
                      Online Payment
                    </span>
                  </button>

                  <button
                    type="button"
                    id="delivery-lbcbranch-btn"
                    onClick={() => handleSelectDeliveryType("LbcBranch")}
                    className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${deliveryType === "LbcBranch"
                        ? "border-primary-container bg-primary-container/15 text-primary-container shadow-md ring-1 ring-primary-container font-black"
                        : "border-white/10 bg-input-field/50 text-white/70 hover:border-white/30 hover:text-white hover:bg-input-field/80"
                      }`}
                  >
                    <span className="material-symbols-outlined text-3xl sm:text-4xl mb-1.5 transition-transform">
                      store
                    </span>
                    <span className="font-headline font-bold text-sm sm:text-base uppercase tracking-wider text-center leading-tight">
                      LBC Branch
                    </span>
                    <span className="text-[10px] text-white/50 tracking-wider font-sans mt-0.5 text-center">
                      Cash on Pickup
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Reserve Quantity Picker included with the buttons */}
            <div className="flex justify-between items-center bg-input-field/40 p-3 sm:p-3.5 rounded-lg border border-white/5">
              <div>
                <label
                  htmlFor="quantity-input"
                  className="text-xs sm:text-sm font-headline font-bold uppercase tracking-wider text-white block"
                >
                  Reserve Quantity
                </label>
                <p className="text-xs text-white/50">
                  Available stock:{" "}
                  <span className="text-white/80 font-bold">
                    {product.stock}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={(parseInt(quantity, 10) || 1) <= 1}
                  className="w-8 h-8 rounded-lg bg-input-field border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  id="quantity-input"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  max={product.stock}
                  min="1"
                  className="w-14 sm:w-16 bg-input-field border border-white/10 rounded-lg p-2 text-center text-white font-headline text-base focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  placeholder="1"
                />
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  disabled={(parseInt(quantity, 10) || 1) >= product.stock}
                  className="w-8 h-8 rounded-lg bg-input-field border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* If selection is already ready, offer explicit continue button */}
            {isSelectionReady && (
              <button
                type="button"
                onClick={() => setUserStep("summary")}
                className="w-full py-2.5 sm:py-3 bg-primary-container text-black/90 font-headline font-black uppercase tracking-widest text-xs sm:text-sm hover:scale-[1.02] transition-all rounded-lg shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                Proceed to Order Summary
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            )}

            {/* Cancel Button */}
            <div className="pt-2 border-t border-white/5">
              <button
                type="button"
                className="w-full py-2 sm:py-2.5 bg-surface-container border border-secondary-container font-headline font-bold uppercase tracking-wider text-xs sm:text-sm text-on-surface hover:bg-secondary-container hover:text-white/90 transition-all rounded-lg cursor-pointer"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ORDER SUMMARY MODAL (Buttons & Quantity Picker are completely removed!) */}
        {currentStep === "summary" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Pure Order Summary Card */}
            <div className="border border-primary-container bg-input-field rounded-xl p-4 sm:p-5 shadow-lg">
              <p className="text-center text-sm sm:text-base uppercase tracking-widest text-primary-container font-headline font-black mb-3 pb-2 border-b border-white/10">
                Order Summary
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col">
                  <span className="text-primary-container text-[11px] font-bold uppercase tracking-wider">
                    Product:
                  </span>
                  <p className="text-white/90 truncate max-w-full font-medium text-sm sm:text-base">
                    {product.item_name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-container font-medium">
                    Quantity:
                  </span>
                  <span className="font-bold text-white/90">
                    {quantity || 1} {quantity > 1 ? "units" : "unit"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-container font-medium">
                    Order Type:
                  </span>
                  <span className="font-bold text-white/90 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">
                      {orderType === "Pickup"
                        ? "storefront"
                        : "local_shipping"}
                    </span>
                    {orderType}
                  </span>
                </div>
                {orderType === "Delivery" && (
                  <div className="flex justify-between items-center">
                    <span className="text-primary-container font-medium">
                      Delivery Type:
                    </span>
                    <span className="font-bold text-white/90">
                      {deliveryType === "DoorToDoor"
                        ? "Door to Door"
                        : "LBC Branch Pickup"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-primary-container font-medium">
                    Mode of Payment:
                  </span>
                  <span className="font-bold text-white/90 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">
                      {paymentType === "Cash" ? "payments" : "qr_code_2"}
                    </span>
                    {paymentType}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-2">
                  <span className="text-primary-container font-bold text-sm sm:text-base">
                    Total Price:
                  </span>
                  <span className="font-black text-[#d4af37] text-lg sm:text-xl">
                    ₱
                    {totalPrice.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Confirm, Change Options, Cancel */}
            <div className="space-y-2">
              <button
                type="button"
                className="w-full py-3 bg-primary-container text-black/90 font-headline font-black uppercase tracking-widest text-xs sm:text-sm hover:scale-[1.02] transition-all rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
                onClick={onConfirm}
              >
                Confirm Order
              </button>
              <button
                type="button"
                className="w-full py-2 sm:py-2.5 bg-surface-container border border-secondary-container font-headline font-bold uppercase tracking-wider text-xs sm:text-sm text-on-surface hover:bg-secondary-container hover:text-white/90 transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                onClick={() => setUserStep("selection")}
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                Change Options
              </button>
              <button
                type="button"
                className="w-full py-2 text-white/50 hover:text-white text-xs font-headline font-bold uppercase tracking-wider transition-colors cursor-pointer"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
