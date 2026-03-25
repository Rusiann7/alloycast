import React from "react";

export default function ProductDetail() {
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBPlw0ExStzaiUbo687oyOL5bIGdtGkg1UiE0rMlapWcERulmZc4uv4zeNqbvkf57riRKM8G_7EjxcvC48a_pp-W9wsqdEPdbwjW6EDx-9b8f6MLTkjJez3VuzoLO8LpehEwWo81DdmBsCBlZI-LZae5AqfgcSOdvwt3hlfy2kx3-8I8ROZoL05i98K4d4CrxcDttehflqiEZt1uUdNCw9GR24srf4zQnlyHNMU8URRT8G_yc5N8WryMu5aK7FSJr68kBDAJ0rtRRw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDhDZ0QZV5glkncgbQTEH-B_TzdxQSAmneBZuxk40MdH6LilzZd-0G2QzAh2HeCmWo01O3e80RtnF3Z5Tpv4yUaVHuGMTcZbXCTJAaFTY4vrpA83JjGZo5oRO9SiSpi6dtPwfk9xeWFInoQkR04SfNHjmUyWxATeRMb_wsnHBFxodWYgX537eYMb1boBx1TX1yABXTQY3lYcFa2Ux1PKnHsZ-mwpJ1w71eOIxUElF87M7XVVxFK6flDx2rsF2B4F68Q_bYC7vZGBw4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCgnSVC6pF1RqFJSOiNDvjlis5dQPNnxCd4dhF0HWjGUAE0-ohV6BvydL7aIWWgbfCWi13rcAibe753a6UbUkzUQsdaG6HMneQbatVsPq04v8oTTGGXgG8y6SZO2OuDCOkqweCbwwPNAtJSuLoQPp4-65gRcrfGo32zE9tbgcbMDlAhuRgqkv0QhEZWs-v2z5yMHLVFCbJunWO66rIkEHHd16tTmlEsYkWZYd3j8PCdaxQxj61Uaf_5i_CHGgWPb5LyoXDDQ_gpwv0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDwm6G0lhOpkeWmfYMd87v37gpK_3zQeCoiGnJsZtxwfaAUDeEI1W8cLsTEjkzQaW6WYX77PPSdu-EUGaAebx6SDIU5Cw4_gOd4TZbgxUVX7T9cHki5PABDD7Ov9UGJepkQXQCMzTCY3Wc4D7snbowqKtxFwo2lwbTsXrfiIA_Wxqpu3GOyOim7Zrw7hGZ7q9iGIrWUCpzgn1APVWCNYrkt_9ap0CP7p6J9zndLygVCsLEfh45-lOMyBd_k6JmL-189JMGKP1dOe4Y"
  ];
  const specs = [
    { label: "Edition", value: "Super Treasure Hunt" },
    { label: "Scale", value: "1:64" },
    { label: "Material", value: "Diecast Metal" },
    { label: "Year", value: "2023" },
    { label: "Base", value: "Metal" },
    { label: "Wheels", value: "Real Riders" }
  ];

  return (
    <div className="bg-background font-body text-on-surface min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Gallery Section */}
          <div className="flex-1 space-y-6 animate-fade-in">
            <div className="relative aspect-video bg-surface-container-high rounded-lg overflow-hidden flex items-center justify-center p-12 border border-white/5">
              <img src={images[0]} alt="R34 skyline" className="w-[80%] h-auto object-contain hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="bg-primary-container text-white text-[10px] font-black uppercase px-2 py-1 italic">Exclusive</span>
                <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black uppercase px-2 py-1">Limited Release</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="aspect-square bg-surface-container-high rounded border border-transparent hover:border-primary-container p-4 cursor-pointer transition-all opacity-60 hover:opacity-100 flex items-center justify-center overflow-hidden">
                  <img src={img} alt="Thumbnail" className="w-full h-auto object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-[450px] flex flex-col justify-center animate-slide-in-right">
            <div className="mb-6 flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A8A8A0]">In Stock • Vault Exclusive</p>
            </div>

            <h1 className="font-headline font-black text-4xl lg:text-5xl uppercase italic tracking-tighter leading-none mb-4">
              R34 Skyline <br /> <span className="text-primary-container text-4xl lg:text-5xl">GTR Silver Edition</span>
            </h1>

            <p className="text-sm font-light leading-relaxed text-[#A8A8A0] mb-8">
              A high-precision recreation of the legendary R34. Featuring a polished metal base, rubber tires, and meticulously detailed tampos.
            </p>

            <div className="mb-10 p-6 bg-surface-container-high border border-white/5 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#555555] mb-1">MSRP</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-headline font-black">$35.00</span>
                  <span className="text-[10px] text-primary-container font-black uppercase tracking-widest bg-primary-container/10 px-2 py-1">Vault Price</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#555555] mb-1">Condition</p>
                <span className="text-xs font-black uppercase text-white">Mint / Near Mint</span>
              </div>
            </div>

            <button className="w-full bg-primary-container text-white py-5 font-headline font-black uppercase tracking-widest rounded transition-all hover:bg-secondary-fixed hover:text-on-secondary-fixed flex items-center justify-center gap-3 active:scale-95 group">
              <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">bolt</span>
              Reserve Specimen
            </button>

            {/* Specifications Grid */}
            <div className="mt-12 grid grid-cols-2 gap-y-6 gap-x-12 border-t border-white/5 pt-8">
              {specs.map(spec => (
                <div key={spec.label}>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555555] mb-1">{spec.label}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
