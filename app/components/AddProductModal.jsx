import { useState } from "react";

export default function AddProductModal() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsAddModalOpen(false)}
      />
      <div className="relative w-full max-w-3xl bg-[#0F0F0F] border border-white/[0.05] shadow-[0_0_100px_rgba(0,0,0,1)] rounded-[2px] animate-slide-in-up flex flex-col max-h-[90vh]">
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
            onClick={() => setIsAddModalOpen(false)}
            className="w-10 h-10 flex items-center justify-center border border-white/5 hover:bg-white/5 transition-colors rounded-[2px] group"
          >
            <span className="material-symbols-outlined opacity-40 group-hover:opacity-100 group-hover:rotate-90 transition-all text-xl font-light">
              close
            </span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 custom-scrollbar">
          {/* Name */}
          <div className="space-y-3">
            <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
              ITEM NAME
            </label>
            <input
              type="text"
              placeholder="e.g. Ferrari F40"
              className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
            />
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                BRAND
              </label>
              <input
                type="text"
                placeholder="e.g. Bburago"
                className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                CATEGORY
              </label>
              <input
                type="text"
                placeholder="e.g. Diecast Cars"
                className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                PRICE (₱)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest outline-none focus:border-primary-container transition-all text-white placeholder:text-white/10"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
                STOCK
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-black/40 border border-white/[0.03] h-14 px-6 text-sm font-headline font-bold uppercase tracking-widest outline-none focus:border-primary-container transition-all text-white placeholder:text-white/10"
              />
            </div>
          </div>

          {/* Item Image */}
          <div className="space-y-3">
            <label className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] opacity-40 inline-block border-l-2 border-[#C8102E] pl-2">
              ITEM IMAGE
            </label>
            <div className="w-full h-48 bg-black/40 border border-dashed border-white/10 flex flex-col items-center justify-center group cursor-pointer hover:border-primary-container transition-all duration-500 rounded-[2px] relative overflow-hidden">
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
            </div>
          </div>
        </div>

        <footer className="p-8 border-t border-white/[0.03] flex justify-end gap-4 bg-black rounded-b-[2px] shrink-0">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="px-8 h-12 border border-white/5 rounded-[2px] text-[10px] font-black font-headline uppercase tracking-[0.3em] hover:bg-white/[0.03] transition-all opacity-40 hover:opacity-100"
          >
            CANCEL
          </button>
          <button className="px-8 h-12 bg-[#C8102E] rounded-[2px] text-[10px] font-black font-headline uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-[#C8102E]/20">
            ADD PRODUCT
          </button>
        </footer>
      </div>
    </div>
  );
}
