"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import dynamic from "next/dynamic";
import Image from "next/image";

// for lazy loading components

const DynamicNavbar = dynamic(() => import("./components/LandingPageNavbar"));

const DynamicHowItWorksModal = dynamic(
  () => import("./components/HowItWorksModal"),
  {
    ssr: false,
  },
);

const DynamicProductCards = dynamic(() => import("./components/ProductCard"), {
  ssr: false,
});

const DynamicFooter = dynamic(() => import("./components/CustomerFooter"), {
  ssr: false,
});
export default function LandingPage() {
  const [inventory, setInventory] = useState([]);
  const [howItWorksModal, setHowItWorksModal] = useState(false);
  const supabase = createClient();

  const router = useRouter();

  const loadInventoryProduct = async () => {
    try {
      let { data, error } = await supabase
        .from("Inventory")
        .select("*")
        .order("created_at", { ascending: false });

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
      <DynamicNavbar />
      <DynamicHowItWorksModal
        isOpen={howItWorksModal}
        onClose={() => setHowItWorksModal(false)}
      />
      {/* Main Hero Section */}
      <main className="relative h-screen min-h-[700px] sm:min-h-[800px] w-full mt-10 overflow-hidden radial-brand flex flex-col justify-center custom-cursor-area">
        {/* Background Asset: Nissan Skyline PNG - Optimized positioning */}
        <div className="absolute inset-0 z-0 flex items-center justify-start pointer-events-none overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center lg:justify-start lg:ml-[45%]">
            <Image
              alt="Nissan Skyline GT-R R34"
              className="w-[100%] sm:w-[110%] lg:w-[85%] h-auto object-contain 
             filter drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] 
             dark:grayscale-75 dark:brightness-90 dark:contrast-[1.1] dark:drop-shadow-none
             opacity-0 animate-drive-in-stop max-w-none lg:max-w-full 
             dark:[-webkit-box-reflect:below_-225px_linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4))] 
             -translate-y-[20%] lg:translate-y-0"
              src="/011.png"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 85vw"
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
              <span className="block text-font-color">Hunt</span>
              <span className="block text-secondary-container dark:text-primary-container drop-shadow-lg/50">
                Reserve
              </span>
              <span className="block  text-font-color ">Collect</span>
            </h1>
          </div>
          {/* Subheadline */}
          <p
            className="text-lg sm:text-lg font-light lg:bg-transparent bg-black/60 text-white lg:text-font-color max-w-[440px] mb-10  p-2 leading-relaxed reveal-up rounded-lg"
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
            <button className="w-full sm:min-w-[220px] h-[52px] drop-shadow-lg/50 bg-primary-container text-black/60  font-black uppercase tracking-widest text-sm rounded-lg btn-premium">
              <Link href="/customer/product">Browse Products</Link>
            </button>
            <button
              onClick={() => setHowItWorksModal(true)}
              className="w-full sm:min-w-[220px] h-[52px]  bg-secondary-container text-white  font-black uppercase tracking-widest text-sm rounded-lg btn-premium drop-shadow-lg/50"
            >
              How It Works
            </button>
          </div>

          {/* Ticker Section */}
          <div className="mt-16 w-full lg:max-w-[600px] overflow-hidden">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <span className="text-sm uppercase tracking-[0.3em] font-black text-font-color">
                THE PRODUCTS WE SELL
              </span>
            </div>
            <div className="relative overflow-hidden w-full">
              <div className="marquee flex items-center text-[11px] sm:text-[13px] font-bold  uppercase py-2">
                {[1].map((i) => (
                  <span
                    key={i}
                    className="flex items-center gap-4 px-4 whitespace-nowrap text-font-color font-black"
                  >
                    Hot Wheels{" "}
                    <span className="material-symbols-outlined text-[14px] ">
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
      <section className="bg-background py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-headline font-black text-4xl uppercase italic tracking-tight mb-2 text-font-color">
                Top Selling Products
              </h2>
            </div>
            <button
              onClick={() => router.push("/customer/product")}
              className="group flex items-center gap-2 text-md font-black uppercase tracking-widest text-font-color"
            >
              View More
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {inventory.slice(0, 4).map((product) => (
              <DynamicProductCards
                key={product.id}
                product={product}
                featured
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="bg-surface-container-low py-12">
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
                className="flex flex-col items-center justify-center gap-3 rounded-lg drop-shadow-lg/50 bg-primary-container p-6 hover:scale-105 transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-secondary-container   transition-transform group-hover:scale-110">
                  flare
                </span>
                <h4 className="text-[10px]  font-black uppercase tracking-widest text-black text-center">
                  {brand}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <DynamicFooter />
    </div>
  );
}
