import React from "react";

export default function Catalog() {
  const categories = ["Hot Wheels", "Matchbox", "Greenlight", "STH Vault", "AutoWorld", "Premium", "M2 Machines"];
  const filters = ["Scale", "Brand", "Era", "Exclusivity"];

  return (
    <div className="bg-background font-body text-on-surface min-h-screen pt-24 pb-12">
      {/* Header (Shared logic placeholder) */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/5 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <div className="size-6 text-primary-container">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="font-headline text-lg font-bold uppercase tracking-tight">Catalog</h2>
        </div>
        <div className="flex items-center bg-surface-container-highest border border-white/5 px-4 h-10 rounded-full w-full max-w-md mx-6">
          <span className="material-symbols-outlined text-sm opacity-40">search</span>
          <input className="bg-transparent border-none text-xs w-full px-2 outline-none uppercase placeholder:opacity-30" placeholder="Search Inventory..." />
        </div>
        <div className="size-10 rounded-full bg-primary-container overflow-hidden group border-2 border-transparent hover:border-white transition-all">
          <img src="https://lh3.googleusercontent.com/a/default-user" alt="User" />
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex flex-col gap-8 flex-shrink-0 animate-slide-in-left">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-primary-container">Categories</h3>
            {categories.map(cat => (
              <button key={cat} className="text-left text-xs font-bold uppercase tracking-widest text-[#A8A8A0] hover:text-white transition-colors py-1 flex items-center justify-between group">
                {cat}
                <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-container">Filters</h3>
            {filters.map(filter => (
              <div key={filter} className="border-b border-white/5 pb-4">
                <button className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-white">
                  {filter}
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 animate-fade-in">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#555555]">Inventory Status: Active</p>
              <h1 className="font-headline text-2xl font-black uppercase italic tracking-tight">Vault Catalog</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A8A8A0]">Sort By</span>
              <button className="bg-surface-container-high text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-white/5 rounded">Latest Release</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6,7,8,9].map(i => (
              <ProductCard key={i} index={i} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <button className="size-10 flex items-center justify-center bg-surface-container-high border border-white/5 text-xs font-black">1</button>
            <button className="size-10 flex items-center justify-center hover:bg-surface-container-high text-xs font-black transition-colors">2</button>
            <button className="size-10 flex items-center justify-center hover:bg-surface-container-high text-xs font-black transition-colors">3</button>
          </div>
        </section>
      </main>
    </div>
  );
}

const ProductCard = ({ index }) => (
  <div className="bg-surface-container-high rounded-[4px] overflow-hidden p-1 group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
    <div className="relative aspect-square bg-surface-container-highest flex items-center justify-center mb-4 overflow-hidden">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPlw0ExStzaiUbo687oyOL5bIGdtGkg1UiE0rMlapWcERulmZc4uv4zeNqbvkf57riRKM8G_7EjxcvC48a_pp-W9wsqdEPdbwjW6EDx-9b8f6MLTkjJez3VuzoLO8LpehEwWo81DdmBsCBlZI-LZae5AqfgcSOdvwt3hlfy2kx3-8I8ROZoL05i98K4d4CrxcDttehflqiEZt1uUdNCw9GR24srf4zQnlyHNMU8URRT8G_yc5N8WryMu5aK7FSJr68kBDAJ0rtRRw" alt="Car" className="w-4/5 h-auto object-contain transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute top-4 left-4">
        <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black uppercase px-2 py-1">Limited</span>
      </div>
    </div>
    <div className="px-4 pb-6">
      <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-[#A8A8A0]">Nissan Skyline Collection</p>
      <h3 className="font-headline font-bold text-xl uppercase mb-2">R34 GT-R White</h3>
      <div className="flex items-center justify-between">
        <span className="font-headline font-black text-lg">$25.00</span>
        <button className="size-10 flex items-center justify-center bg-surface-container-highest border border-white/10 hover:border-primary-container group/btn transition-all">
          <span className="material-symbols-outlined text-[20px] group-hover/btn:text-primary-container transition-colors">shopping_cart</span>
        </button>
      </div>
    </div>
  </div>
);
