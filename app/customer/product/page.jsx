"use client";

import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import CustomerFooter from "../../components/CustomerFooter";
import { createClient } from "../../../lib/supabase/client";

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
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-full lg:w-3/4 h-full pointer-events-none opacity-20 lg:opacity-40 grayscale animate-drive-in">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-iBE2bThpejE-k0yVjvD9_9bvpDi5E3-AIaZyaBgX3WPkoe0yeJqYYJiLR6JCLDq3vnmf9gRVTcYGP6rugVRMCVEGdqa5PtYQMotdtaVumU-aptncRp3o4KMv80mCpzkhu6pRz2Y7EXRwz2tb_tzNhTP79N5vKOqra706nIC6yxKh4_9faXMzKGTW5bC44JQUOglYXXBYJrh1xRWnR3ic2a5ACn4QsnLJi5euAjQ63XxuarlEUO048Nv5uAMWPT1YxMjhUDQEtJM"
            alt="Hero BG"
          />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto">
          <h1 className="font-headline font-black text-6xl lg:text-[140px] tracking-tighter uppercase leading-[0.8] mb-8 italic">
            <span className="text-primary-container">PRODUCTS</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="bg-secondary-container text-white/90 px-6 py-2 font-headline font-black text-sm tracking-widest uppercase italic shadow-2xl">
              Q1-Q3 2024 DROP SCHEDULE
            </span>
            <span className="text-primary-container text-[11px] font-black tracking-[0.4em] uppercase">
              Limited Slot Allocations Remaining
            </span>
          </div>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto p-6 lg:p-12 gap-10 pt-28 lg:pt-32">
        {/* Sidebar Filters */}
        <aside className="hidden md:flex flex-col w-[280px] shrink-0 bg-[#1A1A1A] p-8 rounded border border-white/5 carbon-noise h-fit sticky top-[100px] reveal-up">
          <h2 className="font-headline text-2xl font-black uppercase mb-8 border-b border-white/5 pb-4 tracking-tighter italic">
            Filters
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
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 bg-[#1A1A1A]/40 backdrop-blur-xl p-8 rounded border border-white/5 reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex-1 w-full max-w-xl relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary-container transition-colors">
                search
              </span>
              <input
                type="text"
                className="w-full bg-[#242424] border-b-2 border-transparent focus:border-primary-container focus:outline-none py-4 pl-14 pr-6 rounded-t text-sm font-headline tracking-widest placeholder:text-white/10 transition-all font-bold"
                placeholder="SEARCH PRODUCTS"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full lg:w-64">
              <p className="text-[12px] font-black uppercase tracking-[0.4em] text-primary-container mb-3 ml-1">
                Sort Products
              </p>
              <div className="relative">
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#242424] border-b-2 border-transparent focus:border-primary-container focus:outline-none py-4 px-5 rounded-t text-[12px]  uppercase tracking-[0.2em] cursor-pointer appearance-none transition-all text-white/60 focus:text-white"
                >
                  <option value="new-arrivals">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
          {/* Product Grid - Staggered Reveal */}
          <div className="flex-1">
            {loading ? (
              /* 1. THE LOADING STATE */
              <div className="w-full py-32 flex flex-col items-center justify-center border border-white/5 bg-[#1A1A1A] rounded-sm reveal-up">
                <div className="size-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="font-headline text-2xl font-black uppercase italic text-white/40 animate-pulse">
                  Loading Products...
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/10 mt-2">
                  Please wait for the products to load
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="w-full py-32 flex flex-col items-center justify-center border border-white/5 bg-[#1A1A1A] rounded-sm reveal-up">
                <h3 className="font-headline text-2xl font-black uppercase  text-white/80">
                  Product not available
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 mt-2">
                  Adjust your search or brand filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 reveal-up">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
      <CustomerFooter />

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
    <h3 className="font-headline text-[10px] font-black uppercase tracking-[0.4em] text-primary-container">
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
        className="appearance-none size-5 border-2 border-white/10 rounded-[1px] checked:bg-primary-container checked:border-primary-container transition-all"
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
      className={`font-headline text-[11px] font-black uppercase tracking-widest transition-colors ${checked ? "text-white" : "text-white/20"} group-hover:text-white`}
    >
      {label}
    </span>
  </label>
);
