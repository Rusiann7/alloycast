import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, tag, tagColor, featured }) {
  if (!product) return null; // to prevent crash if no hardcoded products

  const reservationAnalytics = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "similar_product_click", {
        to_product: product.item_name,
      });
    }
  };

  return (
    <div className="flex flex-col h-full drop-shadow-lg/30 bg-secondary-container rounded-lg overflow-hidden group hover:scale-105 hover:cursor-pointer transition-all duration-300 isolate">
      <div className="relative aspect-[4/3]  overflow-hidden">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={product.item_image || "/placeholder-car.png"}
          alt={product.item_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 transform-gpu"
        />
        {(tag || product.category) && (
          <div className="absolute top-4 left-4">
            <span
              className={`${tagColor || "bg-primary-container"} text-sm rounded-lg font-black uppercase px-2 py-1 shadow-lg text-black`}
            >
              {tag || product.category}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col p-4">
        <p
          className={`text-sm font-black uppercase tracking-widest mb-1 ${featured ? "text-primary-container" : "text-[#A8A8A0]"}`}
        >
          {product.brand}
        </p>
        <h3 className=" font-bold text-md uppercase mb-2 text-white/90">
          {product.item_name}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-black text-lg text-white/90">
            ₱ {product.price}
          </span>
          <Link
            href={`/customer/productDetail?id=${product.id}`}
            onClick={reservationAnalytics}
          >
            <button className="size-10 flex items-center justify-center shadow-lg/30 bg-primary-container border border-primary-container rounded-[4px] p-2 text-black/90 hover:border-primary-container transition-colors group/btn">
              <span className="material-symbols-outlined text-black/90 group-hover/btn:text-black/90">
                shopping_cart
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
