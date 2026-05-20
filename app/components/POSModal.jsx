"use client";

import { useState } from "react";

export default function POSModal({
  isOpen,
  isClose,
  selectedItem,
  onPurchase,
}) {
  const [userName, setUserName] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    onPurchase({ userName, emailAddr, quantity });
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
        className="bg-background shadow-lg/30  rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black font-headline uppercase tracking-tight text-font-color">
            {selectedItem?.item_name}
          </h1>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold text-font-color">
              Price:{" "}
              <span className="text-font-color">₱{selectedItem?.price}</span>
            </p>
            <p className="text-lg font-bold text-font-color">
              <label htmlFor="">Quantity: </label>
              <input
                type="number"
                placeholder="Enter Quantity"
                className="bg-input-field text-white/90 p-2 rounded-lg"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <label htmlFor="">Available Stocks: </label>
              <span className="text-font-color">{selectedItem?.stock}</span>
            </p>

            <label className="text-font-color text-lg">
              Customer Name (Optional):
            </label>
            <input
              type="text"
              placeholder="John Doe..."
              className="bg-input-field text-white/90 p-2 rounded-lg"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <label className="text-font-color text-lg">
              Customer Email (Optional):
            </label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              className="bg-input-field text-white/90 p-2 rounded-lg"
              value={emailAddr}
              onChange={(e) => setEmailAddr(e.target.value)}
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={isClose}
              className="flex-1 py-2 shadow-lg/30 bg-secondary-container rounded-lg text-white text-md font-bold hover:scale-105 transition-all"
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2 shadow-lg/30 bg-primary-container rounded-lg text-black text-md font-bold hover:scale-105 transition-all"
              onClick={handleConfirm}
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
