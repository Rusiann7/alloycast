"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import Toast from "../../components/Toast";
import ProductCard from "../../components/ProductCard";
import CustomerFooter from "../../components/CustomerFooter";
import emailjs from "@emailjs/browser";

function ProductDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // for checking auth users
  const searchParams = useSearchParams(); // identify the id of the product clicked url
  const [quantity, setQuantity] = useState(1); // for adding more product reservation
  const [similarProducts, setSimilarProducts] = useState([]); // for similar products analytics
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const router = useRouter();
  const productId = searchParams.get("id"); // get the id of the product clicked url
  const supabase = createClient();

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 4000);
  };

  // for querying selected product from Inventory Table
  useEffect(() => {
    if (productId) {
      // if there's product url clicked with id (searchParams)
      const fetchProduct = async () => {
        let { data, error } = await supabase
          .from("Inventory")
          .select("*")
          .eq("id", productId) // equals to product id clicked
          .single(); // returns single product only

        if (!error && data) {
          setProduct(data);
          fetchSimilarProducts(data);
        } else {
          console.error("Error fetching product: ", error.message);
        }
        setLoading(false);
      };

      const fetchSimilarProducts = async (currentProduct) => {
        const { data, error } = await supabase
          .from("Inventory")
          .select("*")
          // Logic: Same brand OR same category, but NOT the current product
          .or(
            `brand.eq."${currentProduct.brand}",category.eq."${currentProduct.category}"`,
          )
          .neq("id", currentProduct.id)
          .limit(8);
        if (!error) setSimilarProducts(data);
      };
      fetchProduct();
    }
  }, [productId]);

  // for redirecting back to landpage if no product exists
  useEffect(() => {
    if (!loading && !product) {
      // if loading is finished and no product found
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer); // clears timer
    }
  }, [loading, product, router]);

  // for checking if user is currently logged in when they click RESERVE button
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Supabase Auth User:", user);
      setUser(user); // if user is authenticated
    };
    checkUser(); // calls the checkUser function
  }, []);

  // for product reservation
  const productReservation = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "reserve_click", {
        product_name: product.item_name,
      });
    }
    if (!user) {
      // is user is not logged in
      showToast("You must login first to reserve this product", "error");
      const captureCurrentPath =
        window.location.pathname + window.location.search; // capture current page url with product id
      setTimeout(() => {
        router.push(
          // pass the captured current path url to login page
          `/customer/auth/login?redirectTo=${encodeURIComponent(captureCurrentPath)}`,
        );
      }, 4000);
      return;
    }
    setIsModalOpen(true);
    showToast("Reservation Successful!", "success"); // if user is currently logged
  };

  // This will insert the reserve product to Reservation Table using the confirmation Modal
  const insertReservationToTable = async () => {
    try {
      const reservationDataInsert = {
        // these are the data that will be inserted into Reservation Table
        user_id: user.id, // user_id on Reservation Table
        inventory_id: product.id, // the reserved product id
        quantity: quantity, // 1 for now, will add state for more latere
        discount: 0, // 0 for now since no discount for now
      };

      // Insert to Reservation Table
      const { error: reserveError } = await supabase
        .from("Reservation")
        .insert([reservationDataInsert]); // inserts the reservationDataInsert items
      if (reserveError) throw reserveError;

      // Decreases the stock in Inventory Table because a reservation has been made
      const { error: stockError } = await supabase
        .from("Inventory")
        .update({ stock: product.stock })
        .eq("id", product.id);
      if (stockError) throw stockError;

      // fetch admins to send emails
      const { data: admins } = await supabase
        .from("Users")
        .select("email")
        .eq("is_admin", true);
      const adminEmailsConcatenated = admins.map((a) => a.email).join(", ");

      // Trigger Email Notification
      const templateParams = {
        userName: user.email,
        productName: product.item_name,
        quantity: quantity,
        adminList: adminEmailsConcatenated,
      };

      await emailjs.send(
        "service_mu3qrbd", // Found in "Email Services" page
        "template_do3kcc3", // Found in "Email Templates" page
        templateParams,
        "3ilQZwBk_Cxjfohab", // Found in "Account" -> "API Keys"
      );
      showToast(
        "Reservation Completed. An email will be sent to Admins",
        "success",
      );
      setIsModalOpen(false); // closes the confirmation modal
      setTimeout(() => {
        window.location.reload(); // refreshes the page to show updated list/stocks
      }, 3000);
    } catch (error) {
      console.error("Reservation Failed: ", error.message);
      showToast("Failed to process reservation. Try again later", "error");
    }
  };

  // for loading product
  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <h1 className="text-white font-headline animate-pulse uppercase tracking-widest">
          Loading Product Data...
        </h1>
      </div>
    );
  }

  // if product not found
  if (!product) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-headline mb-4 uppercase">
          Product Not Found
        </h1>
        <p className="text-on-surface-variant animate-pulse font-black uppercase tracking-widest text-xs">
          Returning to homepage...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-white min-h-screen">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      <main className="pt-24 lg:pt-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 px-6 lg:px-12 pb-24">
          {/* Left Column: Image Display */}
          <div className="md:sticky md:top-32 h-fit space-y-8 reveal-up">
            <div className="relative aspect-square bg-surface-container-lowest border border-white/5 overflow-hidden display-case-lighting group shadow-2xl">
              <div className="absolute inset-0 carbon-noise opacity-30 pointer-events-none"></div>
              <img
                alt={product.item_name}
                className="w-full h-full object-contain p-12 transition-transform duration-1000 group-hover:scale-110"
                src={product.item_image}
              />
              {/* Dynamic Tag based on category */}
              <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
                <span className="bg-[#FFDB3C] text-black font-headline font-black text-[12px] px-4 py-2 uppercase tracking-tighter shadow-2xl skew-x-[-12deg]">
                  {product.category || "PREMIUM SELECTION"}
                </span>
                {product.stock < 5 && (
                  <span className="bg-[#E8112D] text-white font-headline font-black text-[10px] px-4 py-2 uppercase tracking-tighter shadow-2xl skew-x-[-12deg]">
                    LOW STOCK ALERT
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Spec Sheet & Control */}
          <div className="py-0 reveal-up" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-12">
              <div>
                <span className="inline-block bg-primary-container text-black/90 font-headline font-black text-[10px] tracking-[0.4em] px-4 py-2 border border-[#E8112D]/20 mb-8 uppercase italic">
                  {product.brand} PERFORMANCE
                </span>
                <h1 className="text-[60px] lg:text-[80px] font-headline font-black uppercase leading-[0.8] tracking-tighter mb-6 italic">
                  {product.item_name}
                </h1>
                <div className="flex items-center gap-6">
                  <p className="text-on-surface-variant font-headline font-black tracking-[0.2em] text-lg uppercase flex items-center gap-4 italic">
                    {product.brand} OFFICIAL SERIES
                  </p>
                </div>
              </div>
              {/* Allocation Telemetry */}
              <div className="bg-surface-container-low p-12 border border-white/5 carbon-noise relative group">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <p className="font-headline text-[13px]  text-white uppercase tracking-[0.5em] text-on-surface/30 mb-3 font-bold">
                      ITEM PRICE
                    </p>
                    <p className="text-6xl lg:text-6xl font-headline font-black text-[#FFDB3C] tracking-tighter italic tabular-nums">
                      ₱{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-headline font-black text-[#fa7a02] uppercase tracking-tight animate-pulse">
                      {product.stock} STOCKS LEFT
                    </p>
                  </div>
                </div>
                <div className="h-3 w-full bg-surface-container-highest overflow-hidden relative">
                  <div
                    className="h-full bg-[#E8112D] relative transition-all duration-1000"
                    style={{
                      width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <p>Product Details: AI TO BE IMPLEMENTED</p>
                <button
                  onClick={productReservation}
                  disabled={product.stock === 0} // disables the button if the stock is 0
                  className={`w-full py-8 font-headline font-black text-2xl uppercase tracking-[0.3em] transition-all italic sharp-edge shadow-2xl ${
                    product.stock === 0
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed grayscale" // 2. "Sold Out" styling
                      : "bg-primary-container text-black/90 hover:bg-secondary-container hover:text-white/90 active:scale-[0.98]" // regular styling
                  }`}
                >
                  {product.stock === 0 ? "Out of Stock" : "Reserve Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Similar Products */}
        <div className="space-y-6 px-6 pt-5  border-white/5">
          <h3 className="font-headline font-black text-2xl uppercase tracking-tighter italic">
            Similar Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
            {similarProducts.length === 0 && (
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-headline">
                No similar items found.
              </p>
            )}
          </div>
        </div>
        <CustomerFooter />
      </main>
      {/* Reservation Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full  bg-surface-container border border-white/10 p-12 text-white">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-4xl font-headline font-black uppercase italic">
                Confirm Reservation?
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="material-symbols-outlined"
              >
                close
              </button>
            </div>

            <p className="font-light text-on-surface-variant">
              How many &nbsp;
              <span className="text-primary-container font-bold">
                {product.item_name}
              </span>
              &nbsp; you want to reserve?
            </p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              max={product.stock}
              className=" bg-surface p-2 border border-white/10"
            />

            <p className="mb-8 font-light text-on-surface-variant">
              You are about to reserve:{" "}
              <span className="text-primary-container font-bold">
                {product.item_name}
              </span>
            </p>
            <button
              className="w-full py-6 bg-primary-container font-headline font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              onClick={insertReservationToTable}
            >
              Confirm My Reservation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={null}>
      <ProductDetail />
    </Suspense>
  );
}
