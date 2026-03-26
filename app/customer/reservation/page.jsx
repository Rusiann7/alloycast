import React from "react";

export default function ReservationSuccess() {
  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center p-6 radial-brand overflow-hidden">
       {/* Background Animation Element */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary-container/10 blur-[150px] animate-pulse rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-xl w-full text-center animate-fade-in">
        <div className="size-20 rounded-full bg-primary-container mx-auto mb-8 flex items-center justify-center border-4 border-white/5 shadow-[0_0_50px_rgba(200,16,46,0.3)] animate-scale-in">
          <span className="material-symbols-outlined text-4xl text-white">verified</span>
        </div>

        <div className="inline-block px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          Reservation Logged
        </div>

        <h1 className="font-headline font-black text-4xl lg:text-6xl uppercase italic tracking-tighter leading-[0.9] mb-4 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
           Specimen <br /> <span className="text-primary-container">Secured</span>
        </h1>

        <p className="text-sm font-light text-[#A8A8A0] max-w-md mx-auto mb-12 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
          Your R34 Skyline GTR reservation has been successfully confirmed. Check your account for collection details.
        </p>

        <div className="grid grid-cols-2 gap-4 animate-slide-in-up" style={{ animationDelay: '500ms' }}>
           <div className="bg-surface-container-high border border-white/5 p-6 rounded-lg text-left">
              <p className="text-[10px] font-black uppercase text-[#555555] mb-2 tracking-widest leading-none">Status</p>
              <p className="text-xs font-black uppercase text-white">Pending Approval</p>
           </div>
           <div className="bg-surface-container-high border border-white/5 p-6 rounded-lg text-left">
              <p className="text-[10px] font-black uppercase text-[#555555] mb-2 tracking-widest leading-none">Vault ID</p>
              <p className="text-xs font-black uppercase text-white">#842-SKY-34</p>
           </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
           <button className="text-xs font-black uppercase tracking-widest text-primary-container hover:text-white transition-colors flex items-center gap-2 group">
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Return to Catalog
           </button>
           <button className="bg-surface-container-highest text-white px-8 py-3 text-xs font-black uppercase tracking-widest border border-white/10 hover:border-primary-container transition-all">
              Manage Collection
           </button>
        </div>
      </div>
    </div>
  );
}
