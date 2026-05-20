"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import dynamic from "next/dynamic";
import Image from "next/image";

const DynamicProductCards = dynamic(
  () => import("../../components/ProductCard"),
  {
    ssr: false,
  },
);

const DynamicFooter = dynamic(() => import("../../components/CustomerFooter"), {
  ssr: false,
});
export default function Product() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // for searching products
  const [selectedCategory, setSelectedCategory] = useState("All"); // for category filters
  const [selectedBrands, setSelectedBrands] = useState([]); // for selecting brand filters
  const [sortBy, setSortBy] = useState("latest"); // for sorting
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1); // for pagination
  const itemsPerPage = 20; // product displayed limit per page
  const supabase = createClient();

  const loadInventoryProduct = async () => {
    setLoading(true); // start loading products
    try {
      let { data, error } = await supabase
        .from("Inventory")
        .select("*")
        .order("created_at");

      if (error) throw Error; // immediately stops execution, like return statement
      setInventory(data || []);
      console.log("Product loaded successfully");
    } catch (error) {
      showToast("Error loading products from Inventory");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryProduct();
  }, []);

  const filterBrand = (brandCode) => {
    setSelectedBrands((prev) =>
      prev.includes(brandCode)
        ? prev.filter((b) => b !== brandCode)
        : [...prev, brandCode],
    );
    setCurrentPage(1);
  };

  const filteredProducts = inventory
    .filter((item) => {
      // finds the product name in the search bar
      const matchesSearch = item.item_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // product category filtering
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(item.brand);
      return matchesSearch && matchesCategory && matchesBrand;
    })
    .sort((a, b) => {
      // sorts price in ascending order
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      // sorts by Date (New Arrivals)
      return new Date(b.created_at) - new Date(a.created_at);
    });

  /* Calculates total pages by dividing results by 20 (itemsPerPage). 'Ceil' rounds UP if there's a remainder. */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  /* Cuts the big list into a smaller chunk. 
   Example Page 2: starts at index 20, ends at index 40. */
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      <header className="relative py-28 px-12 lg:px-20 border-b border-white/5 overflow-hidden reveal-up">
        <div className="absolute inset-0 bg-black/60 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-full  h-full pointer-events-none  animate-drive-in drop-shadow-lg/50">
          <Image
            className="w-full h-full object-cover "
            src="/porsche-grayscale.jpg"
            alt="Hero BG"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 85vw" // 4. Add sizes for better optimization
          />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto">
          <h1 className="font-headline font-black text-6xl lg:text-[140px] tracking-tighter uppercase leading-[0.8] mb-8 italic">
            <span className="text-primary-container">PRODUCTS</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="text-primary-container text-sm font-black tracking-[0.4em] uppercase">
              Limited Stocks Only!
            </span>
          </div>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto p-6 lg:p-12 gap-10 pt-28 lg:pt-32 ">
        {/* Sidebar Filters */}
        <aside className="hidden md:flex flex-col w-[280px] shrink-0 bg-secondary-container p-8 rounded-lg carbon-noise h-fit sticky top-[100px] reveal-up drop-shadow-lg/50">
          <h2 className="font-headline text-2xl text-white/90 font-black uppercase mb-8 border-b border-white/5F pb-4 tracking-tighter italic">
            Filter by Brand
          </h2>

          <div className="space-y-12">
            <FilterSection title="Manufacturer">
              <FilterCheckbox
                label="Hot Wheels"
                checked={selectedBrands.includes("Hot Wheels")}
                onChange={() => filterBrand("Hot Wheels")}
              />
              <FilterCheckbox
                label="Tomica"
                checked={selectedBrands.includes("Tomica")}
                onChange={() => filterBrand("Tomica")}
              />
              <FilterCheckbox
                label="Majorette"
                checked={selectedBrands.includes("Majorette")}
                onChange={() => filterBrand("Majorette")}
              />
              <FilterCheckbox
                label="Auto World"
                checked={selectedBrands.includes("Auto World")}
                onChange={() => filterBrand("Auto World")}
              />
              <FilterCheckbox
                label="Mini GT"
                checked={selectedBrands.includes("Mini GT")}
                onChange={() => filterBrand("Mini GT")}
              />
              <FilterCheckbox
                label="Bburago"
                checked={selectedBrands.includes("Bburago")}
                onChange={() => filterBrand("Bburago")}
              />
              <FilterCheckbox
                label="Maisto"
                checked={selectedBrands.includes("Maisto")}
                onChange={() => filterBrand("Maisto")}
              />
              <FilterCheckbox
                label="Others"
                checked={selectedBrands.includes("Others")}
                onChange={() => filterBrand("Others")}
              />
            </FilterSection>
          </div>
        </aside>

        {/* Content Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Dashboard Toolbar */}
          <div
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 bg-secondary-container backdrop-blur-xl p-8 rounded-lg border border-white/5 reveal-up drop-shadow-lg/50"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex-1 w-full max-w-xl relative">
              <p className="text-sm font-black uppercase tracking-[0.4em] text-primary-container mb-3 ml-1">
                Search Products
              </p>
              <div className="relative group">
                <span className="material-symbols-outlined text-white/90 absolute left-5 top-1/2 -translate-y-1/2 ...">
                  search
                </span>
                <input
                  type="text"
                  className="w-full bg-input-field border-b-2 border-transparent focus:border-primary-container focus:outline-none py-4 pl-14 pr-6 rounded-lg text-md text-white/90 font-headline tracking-widest placeholder:text-white/80 transition-all font-bold"
                  placeholder="Hot Wheels, Bburago, etc..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full lg:w-64">
              <p className="text-sm font-black uppercase tracking-[0.4em] text-primary-container  mb-3 ml-1">
                Sort Products
              </p>
              <div className="relative">
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-input-field border-b-2 border-transparent focus:border-primary-container focus:outline-none py-4 px-5 rounded-lg text-sm  uppercase tracking-[0.2em] cursor-pointer appearance-none transition-all text-white/90 focus:text-white"
                >
                  <option value="new-arrivals">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/90  pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
          {/* Product Grid - Staggered Reveal */}
          <div className="flex-1">
            {loading ? (
              /* 1. THE LOADING STATE */
              <div className="w-full py-32 flex flex-col items-center justify-center  bg-background rounded-sm reveal-up">
                <div className="size-12 border-4 border-secondary-container border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="font-headline text-2xl font-black uppercase italic text-font-color animate-pulse">
                  Loading Products...
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/10 mt-2">
                  Please wait for the products to load
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="w-full py-32 flex flex-col items-center justify-center bg-background rounded-lg reveal-up">
                <h3 className="font-headline text-2xl font-black uppercase  text-white-font-color">
                  Product not available
                </h3>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-font-color mt-2">
                  Adjust your search or brand filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 reveal-up">
                {currentProducts.map((product) => (
                  <DynamicProductCards key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Only show pagination if there are products to navigate through */}
            {filteredProducts.length > itemsPerPage && (
              <div className="mt-16 flex items-center justify-center gap-4 reveal-up">
                <div className="mt-16 flex items-center justify-center gap-4 reveal-up">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="size-12 flex items-center justify-center border border-white/10 hover:bg-white/5 disabled:opacity-30 transition-all rounded-[1px]"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>

                  <span className="font-headline font-black text-xs uppercase tracking-widest text-white/40">
                    Page {currentPage}{" "}
                    <span className="text-white/10 mx-2">/</span> {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="size-12 flex items-center justify-center border border-white/10 hover:bg-white/5 disabled:opacity-30 transition-all rounded-[1px]"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <DynamicFooter />

      <style jsx global>{`
        .reveal-up {
          animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes reveal-up {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .carbon-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}

const FilterSection = ({ title, children }) => (
  <div className="space-y-6">
    <h3 className="font-headline text-sm font-black uppercase tracking-[0.4em] text-primary-container ">
      {title}
    </h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const FilterCheckbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-4 cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked} // Changed from defaultChecked
        onChange={onChange} // Added the onChange handler
        className="appearance-none size-5 border-2 border-primary-container rounded-md checked:bg-primary-container checked:border-primary-container transition-all"
      />
      {/* 
         IMPORTANT: Use 'checked' (not peer-checked) 
         to show the checkmark icon manually based on state 
      */}
      {checked && (
        <span className="material-symbols-outlined absolute inset-0 text-[14px]  text-black flex items-center justify-center pointer-events-none">
          check
        </span>
      )}
    </div>
    <span
      className={`font-headline text-sm font-black uppercase tracking-widest transition-colors ${checked ? "text-white" : "text-white/90"} group-hover:text-white`}
    >
      {label}
    </span>
  </label>
);
