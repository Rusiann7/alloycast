import React from "react";

export default function Account() {
  const stats = [
    { label: "Specimens Protected", value: "24", unit: "Items" },
    { label: "Active Reservations", value: "03", unit: "Pending" },
    { label: "Vault Standing", value: "Elite", unit: "Member" }
  ];

  return (
    <div className="bg-background font-body text-on-surface min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col gap-12 lg:gap-20">
        
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-center gap-8 md:gap-12 animate-fade-in pb-12 border-b border-white/5">
          <div className="relative size-32 lg:size-40 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container shadow-[0_0_30px_rgba(200,16,46,0.1)] group">
             <img src="https://lh3.googleusercontent.com/a/default-user" alt="User" />
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-xs font-black uppercase tracking-widest leading-none">
                Update
             </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="font-headline font-black text-4xl lg:text-6xl uppercase italic tracking-tighter leading-[0.9] mb-4">
               Ethan <br /> <span className="text-primary-container">Marcus</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#A8A8A0]">
               <span className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">mail</span> em@collector.vault
               </span>
               <span className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">location_on</span> Olongapo City, PH
               </span>
               <span className="px-2 py-1 bg-secondary-fixed text-on-secondary-fixed italic">Verified Collector</span>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          {stats.map(stat => (
            <div key={stat.label} className="bg-surface-container-high border border-white/5 p-8 rounded-lg relative overflow-hidden group hover:border-primary-container/30 transition-all">
               <div className="absolute -top-10 -right-10 size-32 bg-primary-container/5 blur-3xl group-hover:bg-primary-container/10 transition-colors"></div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#555555] mb-2">{stat.label}</p>
               <div className="flex items-end gap-2">
                  <span className="text-5xl font-headline font-black italic">{stat.value}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary-container mb-2">{stat.unit}</span>
               </div>
            </div>
          ))}
        </section>

        {/* Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
           {/* Recent Reservations */}
           <div className="lg:col-span-2 space-y-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-end justify-between border-b border-white/5 pb-4">
                 <h2 className="font-headline font-black text-2xl uppercase italic tracking-tight">Active Reservoir</h2>
                 <button className="text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] hover:text-white transition-colors">History Log</button>
              </div>
              
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="bg-surface-container-low border border-white/5 p-6 rounded-lg flex items-center gap-6 group hover:bg-surface-container-high transition-colors">
                      <div className="size-16 bg-surface-container-highest rounded flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPlw0ExStzaiUbo687oyOL5bIGdtGkg1UiE0rMlapWcERulmZc4uv4zeNqbvkf57riRKM8G_7EjxcvC48a_pp-W9wsqdEPdbwjW6EDx-9b8f6MLTkjJez3VuzoLO8LpehEwWo81DdmBsCBlZI-LZae5AqfgcSOdvwt3hlfy2kx3-8I8ROZoL05i98K4d4CrxcDttehflqiEZt1uUdNCw9GR24srf4zQnlyHNMU8URRT8G_yc5N8WryMu5aK7FSJr68kBDAJ0rtRRw" alt="Car" className="w-full h-auto object-contain" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-black uppercase tracking-widest text-[#555555] mb-1 leading-none">R34-SKY-34</p>
                         <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-white mb-2 leading-none">Nissan Skyline GT-R</h3>
                         <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                            <span>24 Mar 2026</span>
                            <span className="text-secondary-fixed">Waiting for Drop</span>
                         </div>
                      </div>
                      <button className="material-symbols-outlined text-sm opacity-20 hover:opacity-100 transition-colors">more_vert</button>
                   </div>
                 ))}
              </div>
           </div>

           {/* Security / Sidebar */}
           <div className="space-y-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="flex items-end justify-between border-b border-white/5 pb-4">
                 <h2 className="font-headline font-black text-2xl uppercase italic tracking-tight">Security</h2>
              </div>
              <div className="bg-surface-container-high p-8 rounded-lg space-y-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-primary-container tracking-[0.3em]">Vault Authorization</p>
                    <div className="space-y-4">
                       <button className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white py-2 group">
                          Change Access Key
                          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">key</span>
                       </button>
                       <button className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white py-2 group">
                          Identity Verification
                          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">fingerprint</span>
                       </button>
                       <button className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-red-500 py-2 group border-t border-white/5 mt-4 pt-4">
                          Revoke Access
                          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">logout</span>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
