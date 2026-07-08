"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import dynamic from "next/dynamic";
import { Phone } from "lucide-react";

const DynamicNavbar = dynamic(() => import("./components/LandingPageNavbar"));

// for lazy loading components

const DynamicHowItWorksModal = dynamic(
  () => import("./components/HowItWorksModal"),
  { ssr: false },
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

  // pinaloob ko lng ung loadInventoryProduct function sa loob ng useEffect
  useEffect(() => {
    const loadInventoryProduct = async () => {
      try {
        // 1. Fetch POS data to determine top selling products
        let { data: posData, error: posError } = await supabase
          .from("POS")
          .select("product_id, quantity");

        if (posError) throw posError;

        // Aggregate sales by product_id
        const salesByProduct = {};
        if (posData && posData.length > 0) {
          posData.forEach((record) => {
            const pid = record.product_id;
            const qty = record.quantity || 1; // Default to 1 if missing
            if (pid) {
              salesByProduct[pid] = (salesByProduct[pid] || 0) + qty;
            }
          });
        }

        // Sort product IDs by total quantity sold (descending)
        const sortedProductIds = Object.keys(salesByProduct).sort(
          (a, b) => salesByProduct[b] - salesByProduct[a],
        );

        // Limit to Top 12 products
        const topProductIds = sortedProductIds.slice(0, 12);

        let finalInventory = [];

        if (topProductIds.length > 0) {
          // 2. Fetch the top products from Inventory
          let { data: inventoryData, error: inventoryError } = await supabase
            .from("Inventory")
            .select("*")
            .in("id", topProductIds);

          if (inventoryError) throw inventoryError;

          if (inventoryData) {
            // Re-sort the fetched inventory to match the topProductIds order
            finalInventory = inventoryData.sort((a, b) => {
              return (
                topProductIds.indexOf(a.id.toString()) -
                topProductIds.indexOf(b.id.toString())
              );
            });
          }
        }

        // 3. Fallback: If no sales or fewer than 4 top products, fill with newest products
        if (finalInventory.length < 4) {
          let { data: fallbackData, error: fallbackError } = await supabase
            .from("Inventory")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(12);

          if (fallbackError) throw fallbackError;

          // Merge without duplicates
          const existingIds = new Set(finalInventory.map((item) => item.id));
          const additionalItems = (fallbackData || []).filter(
            (item) => !existingIds.has(item.id),
          );

          finalInventory = [...finalInventory, ...additionalItems].slice(0, 12);
        }

        setInventory(finalInventory); // ilagay sa inventory state ung nafetch na product
        console.log("Top products loaded successfully");
      } catch (error) {
        console.error("Error loading products:", error.message);
      }
    };
    loadInventoryProduct();
  }, [supabase]);

  return (
    <div className=" font-body text-on-surface min-h-screen">
      {/* ── Hero Section ──────────────────────────────────────── */}
      <DynamicNavbar />
      <section
        id="hero"
        className="relative w-full h-screen min-h-[640px] overflow-hidden flex flex-col border-b-4 border-primary-container hero-border-glow"
        style={{ fontFamily: "var(--font-rubik), sans-serif" }}
      >
        {/* Video Background — deepest layer, behind DotGrid */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: -55, filter: "hue-rotate(55deg) saturate(1.3)" }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260227_042027_c4b2f2ea-1c7c-4d6e-9e3d-81a78063703f.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* ── Hero Content — Upper Third ─────────────────────── */}
        <div className="relative z-20 flex flex-col items-start justify-start px-8 lg:px-16 pt-24 flex-1">
          {/* Eyebrow */}
          <span className="text-primary-container text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Premium Diecast Reservation
          </span>

          {/* Headline */}
          <h1
            className="font-black uppercase text-white leading-[0.9] tracking-[-0.04em] mb-6"
            style={{ fontSize: "clamp(42px, 6.5vw, 64px)" }}
          >
            Hunt. Reserve.
            <br />
            <span className="text-primary-container">Collect.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/60 text-sm font-medium max-w-[360px] mb-8 leading-relaxed">
            Your exclusive source for limited-edition diecast brands. Reserved
            for elite collectors.
          </p>

          {/* Browse Products button */}
          <Link
            href="/customer/product"
            className="btn-clipped inline-flex items-center gap-2 bg-primary-container text-black/90 text-xs font-bold uppercase tracking-widest px-7 py-3.5 transition-all hover:opacity-90 active:scale-95"
          >
            Browse Products
            <span className="material-symbols-outlined text-[14px] leading-none">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* ── Liquid Glass Consultation Card — Bottom Left ──── */}
        <div className="relative z-20 px-8 lg:px-16 pb-10">
          <div className="liquid-glass rounded-xl p-5 max-w-[300px] flex items-center gap-4">
            {/* Icon bubble — primary-container/black */}
            <div className="btn-clipped flex-shrink-0 w-10 h-10 bg-primary-container flex items-center justify-center">
              <Phone size={16} className="text-black" strokeWidth={2.5} />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-0.5">
                How It Works
              </p>
              <p className="text-white/50 text-[11px] leading-snug">
                See how to reserve & collect
              </p>
            </div>
            {/* Pill CTA — secondary-container */}
            <button
              onClick={() => setHowItWorksModal(true)}
              className="btn-clipped flex-shrink-0 bg-primary-container text-black/90 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 transition-opacity hover:opacity-80"
            >
              Learn
            </button>
          </div>
        </div>
      </section>
      {/* ── End Targo Hero ────────────────────────────────────── */}

      <DynamicHowItWorksModal
        isOpen={howItWorksModal}
        onClose={() => setHowItWorksModal(false)}
      />

      {/* Top Products */}
      <section className="py-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-headline font-black text-4xl  uppercase italic tracking-tight mb-2 text-font-color text-md drop-shadow-xl/30">
                Top Selling Products
              </h2>
            </div>
            <button
              onClick={() => router.push("/customer/product")}
              className="group flex items-center gap-2 border border-primary-container bg-primary-container p-3 rounded-xl italic tracking-tight uppercase text-md font-black text-black/90 drop-shadow-xl/30"
            >
              View More
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_right
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
      <section className="py-12">
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
                className="flex flex-col items-center justify-center gap-3 rounded-lg drop-shadow-lg/50 bg-primary-container p-6 hover:scale-105 transition-all group"
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
