"use client";
import Link from "next/link";
import LandingPageNavbar from "./components/LandingPageNavbar";

export default function LandingPage() {
  return (
    <div className="bg-background font-body text-on-surface min-h-screen">
      <LandingPageNavbar />
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
              <span className="block">Hunt.</span>
              <span className="block text-primary-container">Collect.</span>
              <span className="block">Reserve.</span>
            </h1>
          </div>
          {/* Subheadline */}
          <p
            className="text-[16px] sm:text-[18px] font-light text-[#A8A8A0] max-w-[440px] mb-10 leading-relaxed reveal-up"
            style={{ animationDelay: "0.6s" }}
          >
            Your Source For Premium Tomica, Mini GT, and Pop Race Diecast.
            Exclusive Curation for Elite Collectors.
          </p>
          {/* CTA Row */}
          <div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto reveal-up"
            style={{ animationDelay: "0.8s" }}
          >
            <button className="w-full sm:min-w-[220px] h-[52px] bg-primary-container text-white font-headline font-black uppercase tracking-widest text-sm rounded-[4px] btn-premium">
              <Link href="/customer/product">Browse Products</Link>
            </button>
            <button className="w-full sm:min-w-[220px] h-[52px] border border-primary-container text-primary-container font-headline font-black uppercase tracking-widest text-sm rounded-[4px] btn-premium hover:bg-primary-container hover:text-white">
              How It Works
            </button>
          </div>

          {/* Ticker Section */}
          <div className="mt-16 w-full lg:max-w-[600px] overflow-hidden">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#555555]">
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
                    Mini GT{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      flare
                    </span>
                    Pop Race{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      flare
                    </span>
                    Tomica{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      flare
                    </span>
                    Tarmac Works{" "}
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

      {/* Featured Specimens */}
      <section className="bg-surface py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-headline font-black text-4xl uppercase italic tracking-tight mb-2 text-white">
                Featured Specimens
              </h2>
              <p className="text-sm font-light text-[#A8A8A0] uppercase tracking-[0.2em]">
                The vault is now open
              </p>
            </div>
            <button className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-container">
              View Entire Catalog
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard
              tag="PREMIUM"
              tagColor="bg-secondary-fixed text-on-secondary-fixed"
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuBPlw0ExStzaiUbo687oyOL5bIGdtGkg1UiE0rMlapWcERulmZc4uv4zeNqbvkf57riRKM8G_7EjxcvC48a_pp-W9wsqdEPdbwjW6EDx-9b8f6MLTkjJez3VuzoLO8LpehEwWo81DdmBsCBlZI-LZae5AqfgcSOdvwt3hlfy2kx3-8I8ROZoL05i98K4d4CrxcDttehflqiEZt1uUdNCw9GR24srf4zQnlyHNMU8URRT8G_yc5N8WryMu5aK7FSJr68kBDAJ0rtRRw"
              type="Super Treasure Hunt"
              name="R34 Skyline GT-R"
              price="₱650"
              featured
            />
            <ProductCard
              tag="SPECIAL"
              tagColor="bg-on-tertiary text-white"
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuDhDZ0QZV5glkncgbQTEH-B_TzdxQSAmneBZuxk40MdH6LilzZd-0G2QzAh2HeCmWo01O3e80RtnF3Z5Tpv4yUaVHuGMTcZbXCTJAaFTY4vrpA83JjGZo5oRO9SiSpi6dtPwfk9xeWFInoQkR04SfNHjmUyWxATeRMb_wsnHBFxodWYgX537eYMb1boBx1TX1yABXTQY3lYcFa2Ux1PKnHsZ-mwpJ1w71eOIxUElF87M7XVVxFK6flDx2rsF2B4F68Q_bYC7vZGBw4"
              type="Premium Series"
              name="'67 Camaro"
              price="₱350"
            />
            <ProductCard
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuCgnSVC6pF1RqFJSOiNDvjlis5dQPNnxCd4dhF0HWjGUAE0-ohV6BvydL7aIWWgbfCWi13rcAibe753a6UbUkzUQsdaG6HMneQbatVsPq04v8oTTGGXgG8y6SZO2OuDCOkqweCbwwPNAtJSuLoQPp4-65gRcrfGo32zE9tbgcbMDlAhuRgqkv0QhEZWs-v2z5yMHLVFCbJunWO66rIkEHHd16tTmlEsYkWZYd3j8PCdaxQxj61Uaf_5i_CHGgWPb5LyoXDDQ_gpwv0"
              type="Mainline"
              name="Porsche 911 GT3"
              price="₱350"
            />
            <ProductCard
              tag="Limited"
              tagColor="bg-primary-container text-white"
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuDwm6G0lhOpkeWmfYMd87v37gpK_3zQeCoiGnJsZtxwfaAUDeEI1W8cLsTEjkzQaW6WYX77PPSdu-EUGaAebx6SDIU5Cw4_gOd4TZbgxUVX7T9cHki5PABDD7Ov9UGJepkQXQCMzTCY3Wc4D7snbowqKtxFwo2lwbTsXrfiIA_Wxqpu3GOyOim7Zrw7hGZ7q9iGIrWUCpzgn1APVWCNYrkt_9ap0CP7p6J9zndLygVCsLEfh45-lOMyBd_k6JmL-189JMGKP1dOe4Y"
              type="Convention Exclusive"
              name="Datsun 510"
              price="₱200"
            />
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="bg-surface-container-low py-12 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              "Tomica",
              "Mini GT",
              "Pop Race",
              "Inno64",
              "Tarmac",
              "Hot Wheels",
              "Matchbox",
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
      <footer className="bg-surface-container-lowest py-16 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-[300px]">
            <div className="flex items-center gap-3 text-white mb-6">
              <div className="size-6 text-primary-container">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="font-headline text-lg font-bold uppercase tracking-tight">
                Ethan Marcus Diecast
              </h2>
            </div>
            <p className="text-sm font-light text-[#A8A8A0] leading-relaxed">
              The premier destination for elite diecast collectors. Machined
              precision, industrial curation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
            <div>
              <h5 className="text-xs font-black uppercase tracking-widest mb-6 text-white">
                Catalog
              </h5>
              <ul className="space-y-4 text-sm text-[#A8A8A0]">
                {["New Releases", "Vault Items", "Price Guide"].map((item) => (
                  <li key={item}>
                    <a
                      className="hover:text-primary-container transition-colors"
                      href="#"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-widest mb-6 text-white">
                Company
              </h5>
              <ul className="space-y-4 text-sm text-[#A8A8A0]">
                {["About", "Selling"].map((item) => (
                  <li key={item}>
                    <a
                      className="hover:text-primary-container transition-colors"
                      href="#"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-[10px] font-bold uppercase tracking-widest text-[#555555] gap-4">
          <p>
            © 2026 Ethan Marcus Diecast. Authorized Partner of Premium Brands.
          </p>
          <div className="flex gap-6">
            <p>Developed by: Team Progidevs</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for Product Cards
const ProductCard = ({ tag, tagColor, img, type, name, price, featured }) => (
  <div className="bg-surface-container-high rounded-[4px] overflow-hidden p-1 group">
    <div className="relative aspect-square bg-surface-container-highest flex items-center justify-center mb-4 overflow-hidden">
      <img
        alt={name}
        className="w-4/5 h-auto object-contain transition-transform duration-500 group-hover:scale-110"
        src={img}
      />
      {tag && (
        <div className="absolute top-4 left-4">
          <span
            className={`${tagColor} text-[10px] font-black uppercase px-2 py-1 shadow-lg`}
          >
            {tag}
          </span>
        </div>
      )}
    </div>
    <div className="px-4 pb-6">
      <p
        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${featured ? "text-primary-container" : "text-[#A8A8A0]"}`}
      >
        {type}
      </p>
      <h3 className="font-headline font-bold text-xl uppercase mb-2 text-white">
        {name}
      </h3>
      <div className="flex items-center justify-between">
        <span className="font-headline font-black text-lg text-white">
          {price}
        </span>
        <button className="size-10 flex items-center justify-center bg-surface-container-highest border border-outline-variant hover:border-primary-container transition-colors group/btn">
          <Link href="/customer/productDetail">
            <span className="material-symbols-outlined text-on-surface group-hover/btn:text-primary-container">
              shopping_cart
            </span>
          </Link>
        </button>
      </div>
    </div>
  </div>
);
