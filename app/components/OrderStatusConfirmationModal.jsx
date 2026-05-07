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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 sm:p-10 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-in">
        {/* Icon & Title */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-lg ${isApprove ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}
          >
            <span
              className={`material-symbols-outlined ${isApprove ? "text-green-500" : "text-red-500"}`}
            >
              {isApprove ? "check_circle" : "cancel"}
            </span>
          </div>
          <h3 className="font-black text-xl sm:text-2xl text-primary-container uppercase tracking-tighter leading-tight italic">
            {isApprove ? "Approve Reservation?" : "Reject Reservation?"}
          </h3>
        </div>

        {/* Details Card */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-5 mb-8 space-y-4">
          <div>
            <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">
              Customer
            </p>
            <p className="text-white font-black uppercase text-base leading-none">
              {customerName}
            </p>
          </div>
          <div className="pt-4 border-t border-white/5">
            <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">
              Product
            </p>
            <p className="text-white font-black uppercase text-base leading-none italic">
              {productName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-primary-container/5 p-4 rounded-lg border border-primary-container/10 mb-10">
          <span className="material-symbols-outlined text-primary-container text-sm mt-0.5">
            info
          </span>
          <p className="text-white/60 text-[11px] uppercase tracking-wider font-bold leading-relaxed">
            An email notification will be sent to the customer automatically.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:flex-1 px-6 h-14 border border-white/10 text-white/40 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all rounded-lg"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:flex-1 px-6 h-14 bg-primary-container text-black/90 text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all rounded-lg shadow-lg shadow-primary-container/20"
          >
            {isApprove ? "Confirm Approval" : "Confirm Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}
