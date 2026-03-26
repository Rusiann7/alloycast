import React from "react";

export default function Platform() {
  const experiences = [
    { title: "Industrial Design Excellence", desc: "A curated platform for the world's most elite collectors." },
    { title: "Machined Precision", desc: "Every model in our vault is authenticated by diecast engineers." },
    { title: "Vault-Grade Security", desc: "Your collection is protected by the highest digital and physical security standards." }
  ];

  return (
    <div className="bg-[#0F0F0F] font-body text-on-surface min-h-screen overflow-hidden radial-brand p-12 lg:p-24 flex flex-col justify-center">
      <div className="container mx-auto max-w-7xl h-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
         
         {/* Center Piece: Large Silhouette */}
         <div className="relative w-full lg:w-1/2 aspect-square flex items-center justify-center animate-fade-in">
           <div className="absolute inset-0 bg-primary-container/5 blur-3xl animate-pulse rounded-full pointer-events-none"></div>
           <img 
             alt="Nissan Skyline GT-R R34 Silhouette" 
             className="w-full h-auto object-contain filter grayscale brightness-50 contrast-125 opacity-20 lg:opacity-100 group-hover:scale-105 transition-transform duration-700 pointer-events-none" 
             src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL-AWm0406EG-1UZke8iuF1oZxcY65Vq6dc_9-A1GnFbAoiFAWnkMBVZgKMgaVRrrRUJYiw4nqzaDQd1xGgpwmcWvsEgj79XUUyMY5S2nZYlyPKfUOAWjiQ526D-dlyERFA5g4vM428anIhTgnebUse3SrzDJ-KFXe1uL4dTXtd2m6zn7W9gdZTxRKoEkXLyJSbUtC_04soQqG8Y9gtrtxozmtOzC2Dn_cxQRGR3D-A3F6oSplCvPXJHKZHEGE26GEuAPJ9owfaUc"
           />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center animate-pulse duration-[3000ms]">
              <span className="material-symbols-outlined text-[120px] lg:text-[200px] text-primary-container/10">flare</span>
           </div>
         </div>

         {/* Content Area */}
         <div className="w-full lg:w-1/2 space-y-12 animate-slide-in-right">
           <div className="space-y-4">
             <div className="inline-block px-4 py-1.5 bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] font-black uppercase tracking-[0.5em] italic">Established 2024</div>
             <h1 className="font-headline font-black text-5xl lg:text-7xl uppercase italic tracking-tighter leading-[0.85] mb-4">
                Ethan <br /> <span className="text-primary-container">Marcus</span> <br /> Diecast Vault
             </h1>
             <p className="text-sm font-light text-[#A8A8A0] max-w-lg leading-relaxed uppercase tracking-widest italic opacity-70">
                A digital ecosystem built for the preservation and authentication of elite 1:64 scale diecast models.
             </p>
           </div>

           <div className="space-y-8 max-w-md">
             {experiences.map((exp, i) => (
               <div key={exp.title} className="flex gap-6 group hover:translate-x-2 transition-transform cursor-default">
                  <div className="size-10 border border-white/5 bg-surface-container-high rounded flex items-center justify-center flex-shrink-0 group-hover:border-primary-container/30 transition-colors">
                     <span className="text-xs font-black uppercase italic text-primary-container opacity-40 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white leading-none">{exp.title}</h3>
                     <p className="text-[10px] font-light text-[#555555] uppercase tracking-widest leading-relaxed leading-none">{exp.desc}</p>
                  </div>
               </div>
             ))}
           </div>

           <div className="flex items-center gap-6 pt-8">
              <button className="bg-primary-container text-white px-12 py-5 font-headline font-black uppercase tracking-[0.3em] text-sm hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all active:scale-95 group flex items-center gap-4">
                 <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
                 Enter Archive
              </button>
              <button className="material-symbols-outlined size-16 rounded-full border border-white/5 hover:border-primary-container transition-all flex items-center justify-center opacity-40 hover:opacity-100 group">
                 <span className="group-hover:translate-x-1 transition-transform">play_arrow</span>
              </button>
           </div>
         </div>
      </div>

       {/* Floating UI Elements */}
       <div className="absolute top-12 left-12 flex flex-col gap-2 items-start opacity-20">
          <span className="text-[10px] font-black uppercase tracking-widest">Platform Status</span>
          <span className="h-[1px] w-24 bg-white/20"></span>
       </div>
       <div className="absolute bottom-12 right-12 flex items-center gap-12 opacity-20">
          <span className="text-[10px] font-black uppercase tracking-widest">Diecast_Vault_R34_Skyline</span>
          <span className="text-[10px] font-black uppercase tracking-widest">© 2024 Marcus Platform</span>
       </div>
    </div>
  );
}
