"use client";

export default function OrderStatusConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  status,
  customerName,
  productName,
}) {
  if (!isOpen) return null;

  const isApprove = status === "Approved";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center  bg-black/70 backdrop-blur-sm">
      <div className=" bg-[#131313] border border-white/10 rounded-lg p-10 max-w-md w-full mx-4 shadow-2xl">
        {/* Title */}
        <h3 className="font-black text-2xl text-primary-container uppercase tracking-tighter  mb-2">
          {isApprove ? "Approve Reservation?" : "Reject Reservation?"}
        </h3>

        {/* Details */}
        <p className="text-white/40 text-sm font-medium mb-1">
          Customer:{" "}
          <span className="text-white font-black uppercase">
            {customerName}
          </span>
        </p>
        <p className="text-white/40 text-sm font-medium mb-8">
          Product:{" "}
          <span className="text-white font-black uppercase">{productName}</span>
        </p>

        <p className="text-white/70 text-xs uppercase tracking-widest font-black border-l-2 border-white/10 pl-3 mb-8">
          An email notification will be sent to the customer automatically.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-white/10 text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all rounded-[1px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 text-sm font-black uppercase tracking-widest transition-all rounded-[1px] ${
              isApprove
                ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            }`}
          >
            {isApprove ? "Yes, Approve" : "Yes, Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
