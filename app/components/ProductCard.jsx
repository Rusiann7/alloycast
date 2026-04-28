import Link from "next/link";

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
    <div className="flex flex-col h-full bg-[#262626] rounded-[2px] overflow-hidden group hover:bg-[#2A2A2A] transition-all duration-300">
      <div className="relative aspect-[4/3] bg-surface-container-lowest overflow-hidden">
        <img
          src={product.item_image || "/placeholder-car.png"}
          alt={product.item_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {(tag || product.category) && (
          <div className="absolute top-4 left-4">
            <span
              className={`${tagColor || "bg-primary-container"} text-[10px] font-black uppercase px-2 py-1 shadow-lg text-black`}
            >
              {tag || product.category}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col p-4">
        <p
          className={`text-[10px] font-black uppercase tracking-widest mb-1 ${featured ? "text-primary-container" : "text-[#A8A8A0]"}`}
        >
          {product.brand}
        </p>
        <h3 className="font-headline font-bold text-xl uppercase mb-2 text-white">
          {product.item_name}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-headline font-black text-lg text-white">
            ₱ {product.price}
          </span>
          <Link
            href={`/customer/productDetail?id=${product.id}`}
            onClick={reservationAnalytics}
          >
            <button className="size-10 flex items-center justify-center bg-primary-container border border-primary-container rounded-[4px] p-2 text-black/90 hover:border-primary-container transition-colors group/btn">
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
