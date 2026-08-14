"use client";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { createClient } from "../../lib/supabase/client";
import dynamic from "next/dynamic";

const DynamicToast = dynamic(() => import("./Toast"));
const DynamicDeliveryAddressMapModal = dynamic(
  () => import("./DeliveryAddressMapModal"),
  { ssr: false }
);

const supabase = createClient();

export default function CartViewModal({ isOpen, onClose, user }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Checkout and Modal States
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const [orderType, setOrderType] = useState("Pickup");
  const [deliveryType, setDeliveryType] = useState("DoorToDoor");
  const [paymentType, setPaymentType] = useState("Cash");

  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  // Fetch cart items for the logged-in user and lookup customer profile
  const fetchCartItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get the Customer details
      const { data: custData, error: custError } = await supabase
        .from("Customer")
        .select("id, firstname, lastname")
        .eq("user_id", user.id)
        .maybeSingle();

      if (custError || !custData) {
        console.error("Error fetching customer profile:", custError?.message);
        setCartItems([]);
        setLoading(false);
        return;
      }

      // Fetch user phone number
      const { data: userData } = await supabase
        .from("Users")
        .select("phone_number")
        .eq("id", user.id)
        .maybeSingle();

      const fullName = `${custData.firstname || ""} ${custData.lastname || ""}`.trim();
      const phoneNumber = userData?.phone_number ? String(userData.phone_number) : "";
      setCustomerDetails({ fullName, phoneNumber });

      // Fetch cart items
      const { data, error } = await supabase
        .from("Cart")
        .select("*")
        .eq("customer_id", custData.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cart:", error.message);
        showToast("Failed to load cart items.", "error");
      } else {
        setCartItems(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Client-side mount check
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch when modal opens
  useEffect(() => {
    if (isOpen && user) {
      fetchCartItems();
    }
  }, [isOpen, user, fetchCartItems]);

  // Option Handlers matching exact rules
  const handleOrderTypeChange = (e) => {
    const val = e.target.value;
    setOrderType(val);
    if (val === "Delivery") {
      // Delivery defaults to Door-to-Door (Online)
      setDeliveryType("DoorToDoor");
      setPaymentType("Online");
    } else {
      // Pickup defaults to Cash
      setDeliveryType("DoorToDoor");
      setPaymentType("Cash");
    }
  };

  const handleDeliveryTypeChange = (e) => {
    const val = e.target.value;
    setDeliveryType(val);
    if (val === "LbcBranch") {
      // LBC Local Branch is always Cash
      setPaymentType("Cash");
    } else {
      // Door to Door is always Online
      setPaymentType("Online");
    }
  };

  const handlePaymentTypeChange = (e) => {
    const val = e.target.value;
    if (orderType === "Delivery" && deliveryType === "LbcBranch") {
      // Locked to Cash
      return;
    }
    if (orderType === "Delivery" && val === "Cash") {
      showToast("Cash on Pickup is not applicable for Delivery orders.", "error");
      setPaymentType("Online");
      return;
    }
    setPaymentType(val);
  };

  // Delete a cart item
  const handleDelete = async (cartId, itemName) => {
    setDeletingId(cartId);
    try {
      const { error } = await supabase
        .from("Cart")
        .delete()
        .eq("id", cartId);

      if (error) {
        console.error("Delete error:", error.message);
        showToast("Failed to remove item.", "error");
      } else {
        setCartItems((prev) => prev.filter((item) => item.id !== cartId));
        showToast(`${itemName} removed from cart.`, "success");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Confirm order click
  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;
    if (orderType === "Delivery") {
      setIsConfirmModalOpen(false);
      setIsAddressModalOpen(true);
    } else {
      executeCheckout();
    }
  };

  // Address modal confirmation
  const handleAddressConfirm = (addressData) => {
    setIsAddressModalOpen(false);
    executeCheckout(addressData);
  };

  // Complete checkout process
  const executeCheckout = async (addressData = null) => {
    setIsSubmittingOrder(true);
    try {
      // Fetch details again to make sure they are fresh
      const { data: custData } = await supabase
        .from("Customer")
        .select("firstname, lastname")
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: userData } = await supabase
        .from("Users")
        .select("email, phone_number")
        .eq("id", user.id)
        .maybeSingle();

      const customerFullName = addressData?.customerName ||
        (custData ? `${custData.firstname || ""} ${custData.lastname || ""}`.trim() : "Valued Customer");
      const customerEmail = userData?.email || user.email || "";
      const contactNumber = addressData?.contactNumber ||
        (userData?.phone_number ? String(userData.phone_number) : "");

      // 1. Insert reservations for each cart item
      const insertedReservations = [];
      for (const item of cartItems) {
        const { data: inserted, error: dbError } = await supabase
          .from("Reservation")
          .insert([
            {
              user_id: user.id,
              inventory_id: item.inventory_id,
              quantity: item.quantity,
              discount: 0,
              status: "Pending",
              order_type: orderType,
              payment_mode: paymentType,
              payment_status: "Pending Payment",
              fulfillment_status: orderType === "Delivery" ? "Pending Shipping" : "Pending Pickup",
              shipping_address: addressData?.shippingAddress || null,
              district: addressData?.district || null,
              zip_code: addressData?.zipCode ? parseInt(addressData.zipCode, 10) : null,
              latitude: addressData?.latitude || null,
              longtitude: addressData?.longtitude || null,
            },
          ])
          .select()
          .single();

        if (dbError) throw dbError;
        insertedReservations.push(inserted);
      }

      // 2. Clear the cart
      const { error: clearCartError } = await supabase
        .from("Cart")
        .delete()
        .eq("customer_id", cartItems[0].customer_id);

      if (clearCartError) throw clearCartError;

      // 3. Process fulfillment flows
      if (orderType === "Pickup") {
        if (paymentType === "Cash") {
          for (const res of insertedReservations) {
            const itemDetails = cartItems.find((i) => i.inventory_id === res.inventory_id);
            await fetch("/api/notifications/send-pickup-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reservationId: res.id,
                customerName: customerFullName,
                customerEmail,
                contactNumber,
                productName: itemDetails?.item_name || "Diecast Product",
                quantity: res.quantity,
                totalPrice: res.price,
                orderType: "Pickup",
                paymentMode: "Cash",
                createdAt: res.created_at,
              }),
            });
          }
          showToast(
            "Pickup Reservation Placed! Please pay in-store upon pickup. A confirmation email has been sent.",
            "success"
          );
          setTimeout(() => {
            setIsConfirmModalOpen(false);
            onClose();
            window.location.reload();
          }, 2500);
        } else {
          // Online Checkout session for all items
          const allReservationIds = insertedReservations.map((r) => r.id).join(",");
          const response = await fetch("/api/paymongo/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: grandTotal,
              item_name: "Cart Checkout (" + cartItems.length + " items)",
              quantity: 1,
              reservation_id: allReservationIds,
              customer_name: customerFullName,
              customer_email: customerEmail,
              contact_number: contactNumber,
            }),
          });

          const resData = await response.json();
          if (!response.ok || !resData.success) {
            throw new Error(resData.error || "Failed to initiate online checkout.");
          }

          showToast("Redirecting to PayMongo for online payment...", "success");
          setTimeout(() => {
            window.location.href = resData.checkout_url;
          }, 1500);
        }
      } else {
        // Delivery
        if (paymentType === "Cash") {
          // LBC Local Branch Pickup (Cash)
          for (const res of insertedReservations) {
            const itemDetails = cartItems.find((i) => i.inventory_id === res.inventory_id);
            await fetch("/api/notifications/send-lbc-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reservationId: res.id,
                customerName: customerFullName,
                customerEmail,
                contactNumber,
                productName: itemDetails?.item_name || "Diecast Product",
                quantity: res.quantity,
                totalPrice: res.price,
                shippingAddress: addressData.shippingAddress,
                district: addressData.district,
                zipCode: addressData.zipCode,
                createdAt: res.created_at,
              }),
            });
          }
          showToast(
            "Order placed! Our team will process your LBC shipment and email you details.",
            "success"
          );
          setTimeout(() => {
            setIsConfirmModalOpen(false);
            onClose();
            window.location.reload();
          }, 2500);
        } else {
          // Door to Door Delivery (Online Payment)
          const allReservationIds = insertedReservations.map((r) => r.id).join(",");
          const response = await fetch("/api/paymongo/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: grandTotal,
              item_name: "Cart Checkout (" + cartItems.length + " items)",
              quantity: 1,
              reservation_id: allReservationIds,
              customer_name: customerFullName,
              customer_email: customerEmail,
              contact_number: contactNumber,
              shipping_address: addressData.shippingAddress,
              district: addressData.district,
              zip_code: addressData.zipCode,
            }),
          });

          const resData = await response.json();
          if (!response.ok || !resData.success) {
            throw new Error(resData.error || "Failed to initiate online checkout.");
          }

          showToast("Redirecting to PayMongo GCash Checkout...", "success");
          setTimeout(() => {
            window.location.href = resData.checkout_url;
          }, 1500);
        }
      }
    } catch (err) {
      console.error("Checkout execution error:", err);
      showToast(err.message || "Something went wrong during checkout.", "error");
      setIsSubmittingOrder(false);
    }
  };

  // Grand total of all items in cart
  const grandTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  if (!isOpen) return null;

  const modalContent = (
    <>
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-modal-background rounded-xl w-full max-w-lg shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-scale-in overflow-hidden flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-2xl">
                shopping_cart
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                My Cart
              </h3>
              {cartItems.length > 0 && (
                <span className="bg-primary-container text-black/90 text-[10px] font-black rounded-full px-2 py-0.5">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Body — Scrollable cart items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
            {loading ? (
              // Loading skeleton
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-input-field/50 rounded-lg p-4 animate-pulse"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
                  remove_shopping_cart
                </span>
                <h4 className="text-lg font-black uppercase tracking-tight text-white/40 mb-1">
                  Your cart is empty
                </h4>
                <p className="text-sm text-white/30">
                  Browse products and add items to your cart.
                </p>
              </div>
            ) : (
              // Cart items list
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-input-field/30 border border-white/5 rounded-lg p-4 hover:border-white/15 transition-colors group"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20 shrink-0">
                      <img
                        src={item.item_image || "/placeholder-car.png"}
                        alt={item.item_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-black uppercase tracking-tight text-white truncate">
                        {item.item_name}
                      </h5>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-[10px] text-white/30">•</span>
                        <span className="text-sm font-black text-primary-container">
                          ₱{item.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => handleDelete(item.id, item.item_name)}
                        disabled={deletingId === item.id}
                        className="size-8 flex items-center justify-center rounded-lg bg-error-container/20 text-red-400 hover:bg-error-container/40 transition-colors cursor-pointer disabled:opacity-50"
                        title="Remove from cart"
                      >
                        <span className="material-symbols-outlined text-base">
                          {deletingId === item.id ? "progress_activity" : "delete"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer — Grand Total & Buy */}
          {cartItems.length > 0 && (
            <div className="shrink-0 border-t border-white/10">
              {/* Grand total row */}
              <div className="flex items-center justify-between px-6 py-4 bg-input-field/20">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
                  Grand Total
                </span>
                <span className="text-primary-container font-black text-xl">
                  ₱{grandTotal.toLocaleString()}
                </span>
              </div>

              {/* Buy button */}
              <div className="grid grid-cols-2">
                <button
                  onClick={onClose}
                  className="py-4 text-xs font-black uppercase tracking-[0.2em] text-white/70 bg-secondary-container hover:bg-white/5 transition-colors border-r border-white/10 cursor-pointer"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="py-4 text-xs font-black uppercase tracking-[0.2em] text-black/90 bg-primary-container hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">
                    shopping_bag
                  </span>
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-modal-background border border-white/10 rounded-lg p-5 sm:p-6 text-font-color shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-headline font-black uppercase italic leading-tight flex-1 pr-4 text-white">
                Order Confirmation
              </h2>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="material-symbols-outlined flex-shrink-0 bg-on-primary text-white/90 rounded-full p-1.5 transition-colors cursor-pointer"
                aria-label="Close confirmation modal"
              >
                close
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-4 sm:mb-5 flex flex-col">
              <div>
                <label htmlFor="orderType" className="block text-sm font-bold text-white/70 mb-1.5">
                  Order Type
                </label>
                <select
                  name="orderType"
                  id="orderType"
                  className="w-full bg-input-field border border-white/[0.03] rounded-lg p-2.5 text-md font-headline font-bold tracking-widest focus:border-primary-container outline-none transition-all text-white"
                  value={orderType}
                  onChange={handleOrderTypeChange}
                >
                  <option value="Pickup">Pickup</option>
                  <option value="Delivery">Delivery (Outside Olongapo Only)</option>
                </select>
              </div>

              {/* Delivery Type — only shown for Delivery orders */}
              {orderType === "Delivery" && (
                <div>
                  <label htmlFor="deliveryType" className="block text-sm font-bold text-white/70 mb-1.5">
                    Delivery Type:
                  </label>
                  <select
                    name="deliveryType"
                    id="deliveryType"
                    className="w-full bg-input-field border border-white/[0.03] rounded-lg p-2.5 text-md font-headline font-bold tracking-widest focus:border-primary-container outline-none transition-all text-white"
                    value={deliveryType}
                    onChange={handleDeliveryTypeChange}
                  >
                    <option value="DoorToDoor">Door to Door Delivery (Online Payment)</option>
                    <option value="LbcBranch">LBC Local Branch Pickup (Cash)</option>
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="paymentType" className="block text-sm font-bold text-white/70 mb-1.5">
                  Mode of Payment:
                </label>
                <select
                  name="paymentType"
                  id="paymentType"
                  className={`w-full bg-input-field border border-white/[0.03] rounded-lg p-2.5 text-md font-headline font-bold tracking-widest focus:border-primary-container outline-none transition-all text-white ${
                    orderType === "Delivery" ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  value={paymentType}
                  onChange={handlePaymentTypeChange}
                  disabled={orderType === "Delivery"}
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            {/* Summary Section */}
            <div className="border border-primary-container bg-input-field rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
              <p className="text-center text-md uppercase tracking-wider text-primary-container font-headline mb-2 border-b border-white/10 pb-1">
                Order Summary
              </p>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex flex-col">
                  <span className="text-primary-container text-[11px] font-black uppercase tracking-wider">
                    Products:
                  </span>
                  <div className="max-h-24 overflow-y-auto space-y-1.5 custom-scrollbar pr-1 mt-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-white/95">
                        <span className="truncate max-w-[75%] text-xs font-semibold uppercase">
                          {item.item_name}
                        </span>
                        <span className="text-xs font-bold text-white/70">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-2">
                  <span className="text-primary-container text-[11px] font-black uppercase tracking-wider">
                    Order Type:
                  </span>
                  <span className="font-bold text-white/90 text-xs sm:text-sm">{orderType}</span>
                </div>
                {orderType === "Delivery" && (
                  <div className="flex justify-between items-center">
                    <span className="text-primary-container text-[11px] font-black uppercase tracking-wider">
                      Delivery Type:
                    </span>
                    <span className="font-bold text-white/90 text-xs sm:text-sm">
                      {deliveryType === "DoorToDoor" ? "Door-to-Door" : "LBC Branch"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-primary-container text-[11px] font-black uppercase tracking-wider">
                    Mode of Payment:
                  </span>
                  <span className="font-bold text-white/90 text-xs sm:text-sm">{paymentType}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                  <span className="text-primary-container text-xs sm:text-sm font-black uppercase tracking-wider">
                    Total Price:
                  </span>
                  <span className="font-black text-[#d4af37] text-base sm:text-lg">
                    ₱{grandTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                disabled={isSubmittingOrder}
                className="w-full py-3 bg-primary-container text-black/90 font-headline font-black uppercase tracking-widest text-xs sm:text-sm hover:scale-[1.02] transition-all rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleConfirmOrder}
              >
                {isSubmittingOrder ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">
                      progress_activity
                    </span>
                    Placing Order...
                  </>
                ) : (
                  "Confirm Order"
                )}
              </button>
              <button
                disabled={isSubmittingOrder}
                className="w-full py-2.5 bg-secondary-container border border-white/10 font-headline font-bold uppercase tracking-wider text-xs sm:text-sm text-white/90 hover:bg-white/5 transition-all rounded-lg cursor-pointer"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Address Modal */}
      {isAddressModalOpen && (
        <DynamicDeliveryAddressMapModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onConfirmAddress={handleAddressConfirm}
          defaultCustomerName={customerDetails.fullName}
          defaultPhoneNumber={customerDetails.phoneNumber}
          isSubmitting={isSubmittingOrder}
        />
      )}

      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
