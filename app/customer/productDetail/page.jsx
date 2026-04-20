"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import Toast from "../../components/Toast";
import Link from "next/link";

export default function ProductDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // for checking auth users
  const searchParams = useSearchParams(); // identify the id of the product clicked url
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

        if (!error) {
          setProduct(data);
        } else {
          console.error("Error fetching product: ", error.message);
        }
        setLoading(false);
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
    if (!user) {
      // is user is not logged in
      showToast("You must login first to reserve this product", "error");
      setTimeout(() => {
        router.push("/customer/auth/login");
      }, 4000);
      return;
    }
    setIsModalOpen(true);
    showToast("Reservation Successful!", "success"); // if user is currently logged
  };

  // dummy function to destroy user session
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null); // Clear the local state
      showToast("Signed Out: Session Destroyed", "success");
      console.log("Session cleared successfully.");
    } else {
      console.error("Logout Error:", error.message);
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
                <span className="bg-[#FFDB3C] text-black font-headline font-black text-[10px] px-4 py-2 uppercase tracking-tighter shadow-2xl skew-x-[-12deg]">
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
                <span className="inline-block bg-[#E8112D]/10 text-[#E8112D] font-headline font-black text-[10px] tracking-[0.4em] px-4 py-2 border border-[#E8112D]/20 mb-8 uppercase italic">
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
                    <p className="text-xl font-headline font-black text-[#E8112D] uppercase tracking-tight animate-pulse">
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
                <button
                  onClick={productReservation}
                  className="w-full py-8 bg-[#E8112D] hover:bg-white hover:text-black text-white font-headline font-black text-2xl uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl italic sharp-edge"
                >
                  Reserve Product
                </button>
                <button
                  onClick={handleLogout}
                  className="text-[10px] text-on-surface-variant hover:text-white uppercase tracking-widest font-black mb-4 block underline"
                >
                  [TEST] Destroy Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* TO BE CONTINUE */}
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

            <p className="mb-8 font-light text-on-surface-variant">
              You are about to reserve:{" "}
              <span className="text-primary-container font-bold">
                {product.item_name}
              </span>
            </p>
            <button
              className="w-full py-6 bg-primary-container font-headline font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              onClick={() => {
                showToast("Reservation successful!", "success");
                setIsModalOpen(false);
              }}
            >
              Confirm My Reservation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
