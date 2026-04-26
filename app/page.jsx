"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LandingPageNavbar from "./components/LandingPageNavbar";
import ProductCard from "./components/ProductCard";
import HowItWorksModal from "./components/HowItWorksModal";
import CustomerFooter from "./components/CustomerFooter";
import { createClient } from "../lib/supabase/client";

export default function LandingPage() {
  const [inventory, setInventory] = useState([]);
  const [howItWorksModal, setHowItWorksModal] = useState(false);
  const supabase = createClient();

  const loadInventoryProduct = async () => {
    try {
      let { data, error } = await supabase
        .from("Inventory")
        .select("*")
        .order("created_at");

      if (error) throw error;
      setInventory(data || []); // ilagay sa inventory state ung nafetch na product
      console.log("Product loaded successfully");
    } catch (error) {
      showToast("Error loading products from Inventory");
      console.error(error.message);
    }
  };

  useEffect(() => {
    loadInventoryProduct();
  }, []);

  return (
    <div className="bg-background font-body text-on-surface min-h-screen">
      <LandingPageNavbar />
      <HowItWorksModal
        isOpen={howItWorksModal}
        onClose={() => setHowItWorksModal(false)}
      />
      {/* Main Hero Section */}
      <main className="relative h-screen min-h-[700px] sm:min-h-[800px] w-full overflow-hidden radial-brand flex flex-col justify-center custom-cursor-area">
        {/* Background Asset: Nissan Skyline PNG - Optimized positioning */}
        <div className="absolute  inset-0 z-0 flex items-center justify-start pointer-events-none overflow-hidden">
          <div className="relative  w-full h-full flex items-center justify-center lg:justify-start lg:ml-[45%] ">
            <img
              alt="Nissan Skyline GT-R R34"
              className="w-[140%] sm:w-[110%] lg:w-[85%] h-auto object-contain filter grayscale brightness-80 contrast-[1.1] opacity-0 animate-drive-in-stop max-w-none lg:max-w-full"
              src="/nissan skyline.png"
            />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Headline Group */}
          <div
            className="flex flex-col mb-6 reveal-up"
            style={{ animationDelay: "0.4s" }}
          >
            <h1 className="font-headline font-black uppercase italic leading-[0.92] text-[clamp(44px,12vw,96px)] tracking-tighter">
              <span className="block">Hunt</span>
              <span className="block text-primary-container">Reserve</span>
              <span className="block">Collect</span>
            </h1>
          </div>
          {/* Subheadline */}
          <p
            className="text-[16px] sm:text-[18px] font-light text-white/90 max-w-[440px] mb-10 leading-relaxed reveal-up"
            style={{ animationDelay: "0.6s" }}
          >
            Your Source For Premium Hot Wheels, Tomica, and other Diecast
            brands. Exclusive for Elite Collectors.
          </p>
          {/* CTA Row */}
          <div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto reveal-up"
            style={{ animationDelay: "0.8s" }}
          >
            <button className="w-full sm:min-w-[220px] h-[52px] bg-primary-container text-black/60 font-headline font-black uppercase tracking-widest text-sm rounded-[4px] btn-premium">
              <Link href="/customer/product">Browse Products</Link>
            </button>
            <button
              onClick={() => setHowItWorksModal(true)}
              className="w-full sm:min-w-[220px] h-[52px] border border-primary-container text-primary-container font-headline font-black uppercase tracking-widest text-sm rounded-[4px] btn-premium hover:bg-primary-container hover:text-black/60"
            >
              How It Works
            </button>
          </div>

          {/* Ticker Section */}
          <div className="mt-16 w-full lg:max-w-[600px] overflow-hidden">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-white/90">
                THE PRODUCTS WE SELL
              </span>
            </div>
            <div className="relative overflow-hidden w-full">
              <div className="marquee flex items-center text-[11px] sm:text-[13px] font-bold text-[#333333] uppercase py-2">
                {[1].map((i) => (
                  <span
                    key={i}
                    className="flex items-center gap-4 px-4 whitespace-nowrap text-primary-container"
                  >
                    Hot Wheels{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      flare
                    </span>
                    Tomica{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      flare
                    </span>
                    Majorette{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      flare
                    </span>
                    Auto World{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      flare
                    </span>
                    Mini GT{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      flare
                    </span>
                    Bburago{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      flare
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Top Products */}
      <section className="bg-surface py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-headline font-black text-4xl uppercase italic tracking-tight mb-2 text-white">
                Top Products
              </h2>
            </div>
            <button className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-container">
              View More
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventory.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="bg-surface-container-low py-12 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              "Hot Wheels",
              "Tomica",
              "Majorette",
              "Auto World",
              "Mini GT",
              "Bburago",
              "Maisto",
            ].map((brand) => (
              <div
                key={brand}
                className="flex flex-col items-center justify-center gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-highest p-6 hover:bg-surface-container-high transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-primary-container transition-transform group-hover:scale-110">
                  flare
                </span>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface text-center">
                  {brand}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <CustomerFooter />
    </div>
  );
}
