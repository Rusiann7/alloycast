"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const DynamicToast = dynamic(() => import("./Toast"));

export default function POSModal({
  isOpen,
  isClose,
  selectedItem,
  onPurchase,
}) {
  const [userName, setUserName] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
    } else {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        if (parsed > selectedItem?.stock) {
          setQuantity(selectedItem.stock);
          showToast(
            `Quantity capped at maximum available stock (${selectedItem.stock})`,
            "error",
          );
        } else if (parsed < 1) {
          setQuantity(1);
        } else {
          setQuantity(parsed);
        }
      }
    }
  };

  const handleConfirm = () => {
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      showToast("Please enter a valid quantity of at least 1.", "error");
      return;
    }
    if (parsedQuantity > selectedItem?.stock) {
      showToast(
        `Cannot purchase more than the available stock of ${selectedItem.stock} units.`,
        "error",
      );
      return;
    }

    onPurchase({ userName, emailAddr, quantity: parsedQuantity });
    setUserName("");
    setEmailAddr("");
    setQuantity(1);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80"
      onClick={isClose}
    >
      <div
        className="bg-modal-background shadow-lg/30  rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black font-headline uppercase tracking-tight text-font-color">
            {selectedItem?.item_name}
          </h1>
          <div className="flex flex-col gap-1">
            <div>
              <p className="text-lg font-bold text-font-color">
                Price:{" "}
                <span className="text-font-color">₱{selectedItem?.price}</span>
              </p>
            </div>
            <div className="flex justify-between">
              <label htmlFor="">Quantity: </label>
              <input
                type="number"
                placeholder="1"
                className="w-15 bg-input-field text-white/90 p-2 rounded-lg text-center"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            <div>
              <label htmlFor="">Available Stocks: </label>
              <span className="text-font-color">{selectedItem?.stock}</span>
            </div>

            <div>
              <label className="text-font-color text-lg mt-2">
                Customer Name (Optional):
              </label>
              <input
                type="text"
                placeholder="John Doe..."
                className="w-full bg-input-field text-white/90 p-2 rounded-lg"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-font-color text-lg mt-2">
                Customer Email (Optional):
              </label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full bg-input-field text-white/90 p-2 rounded-lg"
                value={emailAddr}
                onChange={(e) => setEmailAddr(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={isClose}
              className="flex-1 py-2 shadow-lg/30 bg-secondary-container rounded-lg text-white text-md font-bold hover:scale-105 active:scale-105 active:bg-input-field transition-all"
            >
              Cancel
            </button>

            <button
              className="flex-1 py-2 shadow-lg/30 bg-primary-container rounded-lg text-black text-md font-bold hover:scale-105 active:scale-105 active:bg-secondary-container transition-all"
              onClick={handleConfirm}
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </div>
  );
}
