import Link from "next/link";

export default function ProductCard({ product, tag, tagColor, featured }) {
  if (!product) return null; // to prevent crash if no hardcoded products
  return (
    <div className="bg-surface-container-high rounded-[4px] overflow-hidden p-1 group">
      <div className="relative aspect-square bg-surface-container-highest flex items-center justify-center mb-4 overflow-hidden">
        <img
          alt={product.item_name}
          className="w-4/5 h-auto object-contain transition-transform duration-500 group-hover:scale-110"
          src={product.item_image}
        />
        {(tag || product.category) && (
          <div className="absolute top-4 left-4">
            <span
              className={`${tagColor || "bg-primary-container"} text-[10px] font-black uppercase px-2 py-1 shadow-lg text-white`}
            >
              {tag || product.category}
            </span>
          </div>
        )}
      </div>
      <div className="px-4 pb-6">
        <p
          className={`text-[10px] font-black uppercase tracking-widest mb-1 ${featured ? "text-primary-container" : "text-[#A8A8A0]"}`}
        >
          {product.brand}
        </p>
        <h3 className="font-headline font-bold text-xl uppercase mb-2 text-white">
          {product.item_name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-headline font-black text-lg text-white">
            {product.price}
          </span>
          <button className="size-10 flex items-center justify-center bg-surface-container-highest border border-outline-variant hover:border-primary-container transition-colors group/btn">
            <Link href={`/customer/productDetail?id=${product.id}`}>
              <span className="material-symbols-outlined text-on-surface group-hover/btn:text-primary-container">
                shopping_cart
              </span>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
