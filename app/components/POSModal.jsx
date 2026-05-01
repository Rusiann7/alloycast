export default function POSModal({
  isOpen,
  isClose,
  selectedItem,
  onPurchase,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={isClose}
    >
      <div
        className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-black font-headline uppercase tracking-tight text-white">
            {selectedItem?.item_name}
          </h1>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-white/60">
              Price: <span className="text-white">₱{selectedItem?.price}</span>
            </p>
            <p className="text-sm font-bold text-white/60">
              Stock: <span className="text-white">{selectedItem?.stock}</span>
            </p>

            <label htmlFor="">Name (Optional):</label>
            <input type="text" placeholder="Name" />

            <label htmlFor="">Email (Optional):</label>
            <input type="email" placeholder="Email" />
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={isClose}
              className="flex-1 py-2 border border-white/20 rounded-lg text-white text-sm font-bold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2 bg-primary-container rounded-lg text-black text-sm font-bold hover:bg-primary-container/80 transition-all"
              onClick={onPurchase}
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
