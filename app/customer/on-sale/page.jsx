"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "../../../lib/supabase/client";

const DynamicProductCard = dynamic(
  () => import("../../components/ProductCard"),
  {
    ssr: false,
  },
);

const DynamicFooter = dynamic(() => import("../../components/CustomerFooter"), {
  ssr: false,
});

const DynamicToast = dynamic(() => import("../../components/Toast"), {
  ssr: false,
});

const ITEMS_PER_PAGE = 20;

export default function OnSaleProducts() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });
  const [supabase] = useState(() => createClient());

  const showToast = useCallback((message, type = "error") => {
    setToast({ visible: true, message, type });
  }, []);

  useEffect(() => {
    const loadSaleProducts = async () => {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      try {
        const { data, error } = await supabase
          .from("Inventory")
          .select("*")
          .not("discount", "is", null)
          .gt("discount", 0)
          .lte("start_discount", today)
          .gte("end_discount", today)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error loading sale products:", error.message);
        showToast("Error loading sale products");
      } finally {
        setLoading(false);
      }
    };

    loadSaleProducts();
  }, [showToast, supabase]);

  const filteredProducts = products
    .filter((product) =>
      product.item_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price);
      }
      if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-container selection:text-black">
      <header className="relative overflow-hidden border-b-4 border-primary-container px-6 py-28 hero-border-glow sm:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(248,228,8,0.2),transparent_32%),linear-gradient(135deg,#111_0%,#252503_100%)]" />
        <div className="relative z-10 mx-auto max-w-[1600px]">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-primary-container sm:text-sm">
            Limited-time offers
          </p>
          <h1 className="max-w-4xl font-headline text-5xl font-black uppercase italic leading-[0.85] tracking-tight text-white sm:text-7xl lg:text-[clamp(5rem,11vw,10rem)]">
            On Sale
          </h1>
          <p className="mt-8 max-w-xl text-sm font-medium leading-relaxed text-white/65 sm:text-base">
            Collect exclusive diecasts at a better price while stocks last.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-10 flex flex-col gap-5 rounded-lg bg-secondary-container p-5 drop-shadow-lg/30 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <label className="w-full lg:max-w-xl">
            <span className="mb-3 ml-1 block text-xs font-black uppercase tracking-[0.3em] text-primary-container">
              Search sale products
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Hot Wheels, Ferrari, etc..."
              className="w-full rounded-lg bg-input-field px-5 py-4 font-headline text-sm font-bold tracking-widest text-white/90 outline-none transition-colors placeholder:text-white/45 focus:border-primary-container focus:border-b-2"
            />
          </label>

          <label className="w-full lg:max-w-xs">
            <span className="mb-3 ml-1 block text-xs font-black uppercase tracking-[0.3em] text-primary-container">
              Sort products
            </span>
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-lg bg-input-field px-5 py-4 text-sm font-bold uppercase tracking-widest text-white/90 outline-none focus:border-primary-container focus:border-b-2"
            >
              <option value="latest">Newest Arrivals</option>
              <option value="price-low">Sale Price: Low to High</option>
              <option value="price-high">Sale Price: High to Low</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[390px] animate-pulse rounded-[20px] bg-primary-container/30"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <h2 className="font-headline text-2xl font-black uppercase text-font-color">
              No sale products available
            </h2>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest text-font-color/60">
              Check back soon for the next offer
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentProducts.map((product) => (
                <DynamicProductCard
                  key={product.id}
                  product={product}
                  tag="On Sale"
                  tagColor="bg-red-600 text-white"
                  showDiscountPrice
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex size-12 items-center justify-center rounded-lg bg-primary-container text-black disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <span className="font-headline text-xs font-black uppercase tracking-widest text-font-color">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex size-12 items-center justify-center rounded-lg bg-primary-container text-black disabled:opacity-30"
                  aria-label="Next page"
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <DynamicFooter />
      <DynamicToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((current) => ({ ...current, visible: false }))}
      />
    </div>
  );
}
