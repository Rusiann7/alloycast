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
import dynamic from "next/dynamic";
import Image from "next/image";

const DynamicToast = dynamic(() => import("../../components/Toast"), {
  ssr: false,
});

const DynamicProductCards = dynamic(
  () => import("../../components/ProductCard"),
  {
    ssr: false,
  },
);

const DynamicFooter = dynamic(() => import("../../components/CustomerFooter"), {
  ssr: false,
});

function ProductDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // for checking auth users
  const searchParams = useSearchParams(); // identify the id of the product clicked url
  const [quantity, setQuantity] = useState(1); // for adding more product reservation
  const [similarProducts, setSimilarProducts] = useState([]); // for similar products analytics
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [commentDB, setCommentDB] = useState([]);
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

  useEffect(() => {
    if (!productId) return;

    const getCommentsAuto = async () => {
      const { data, error } = await supabase
        .from("Ratings")
        .select(
          `
  id,
  product_id,
  user_id,
  comment,
  rating,
  created_at,
  Inventory!product_id (
    id,
    item_name,
    brand
  ),
  Users (
    id,
    Customer (
      firstname,
      lastname
    )
  )
`,
        )
        .eq("product_id", productId);

      if (error) throw error;
      setCommentDB(data || []);
      console.log(data);
      setComment("");
      setRating(1);
    };
    getCommentsAuto();
  }, [productId]);

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

  const getComments = async (product_id) => {
    try {
      const { data, error } = await supabase
        .from("Ratings")
        .select(
          `
  id,
  product_id,
  user_id,
  comment,
  rating,
  created_at,
  Inventory!product_id (
    id,
    item_name,
    brand
  ),
  Users (
    id,
    Customer (
      firstname,
      lastname
    )
  )
`,
        )
        .eq("product_id", product_id);

      if (error) throw error;
      setCommentDB(data || []);
      console.log(data);
      setComment("");
      setRating(1);
    } catch (error) {
      console.log(error);
    }
  };

  const insertComment = async (rating, comment) => {
    try {
      if (!user) {
        // is user is not logged in
        showToast("You must login first to comment on this product", "error");
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

      if (rating === 0 || !comment) return;

      const { error } = await supabase.from("Ratings").insert({
        product_id: productId,
        user_id: user.id,
        comment: comment,
        rating: rating,
      });

      if (error) throw error;

      getComments(productId);
      showToast("Comment Added", "success");

      console.log(rating, comment);
    } catch (error) {
      console.log(error);
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
      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      <main className="pt-24 lg:pt-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 px-6 lg:px-12 pb-24">
          {/* Left Column: Image Display */}
          <div className="md:sticky md:top-32 h-fit space-y-8 reveal-up ">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden display-case-lighting group shadow-lg/50">
              <div className="absolute inset-0 carbon-noise opacity-30 pointer-events-none"></div>
              <Image
                alt={product.item_name}
                className="w-full h-full object-contain  p-12 transition-transform duration-1000 group-hover:scale-110"
                src={product.item_image}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 85vw" // 4. Add sizes for better optimization
              />
              {/* Dynamic Tag based on category */}
              <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
                <span className="bg-primary-container text-black font-headline font-black text-lg px-4 py-2 uppercase tracking-tighter shadow-2xl skew-x-[-12deg]">
                  {product.category || "PREMIUM SELECTION"}
                </span>
                {product.stock < 5 && (
                  <span className="bg-on-primary text-white font-headline font-black text-[10px] px-4 py-2 uppercase tracking-tighter shadow-2xl skew-x-[-12deg]">
                    LOW STOCK ALERT
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Spec Sheet & Control */}
          <div className="py-0 reveal-up" style={{ animationDelay: "0.2s" }}>
            <div className="space-y -12">
              <div>
                <span className="inline-block bg-primary-container text-black/90 font-headline font-black text-sm tracking-[0.4em] px-4 py-2  drop-shadow-lg/30 rounded-lg mb-8 uppercase italic">
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
              <div className=" p-6 rounded-lg carbon-noise relative group">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <p className="font-headline text-sm  text-font-color  uppercase tracking-[0.5em] mb-3 font-bold">
                      ITEM PRICE:
                    </p>
                    <p className="text-6xl lg:text-6xl font-headline font-black ext-font-color  tracking-tighter italic tabular-nums">
                      ₱{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-headline font-black text-on-primary dark:text-red-500 uppercase tracking-tight animate-pulse">
                      {product.stock} STOCKS LEFT
                    </p>
                  </div>
                </div>
                <div className="h-3 w-full bg-input-field overflow-hidden relative drop-shadow-lg/30 rounded-lg">
                  <div
                    className="h-full bg-primary-container relative transition-all duration-1000"
                    style={{
                      width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 mt-10">
                <button
                  onClick={productReservation}
                  disabled={product.stock === 0} // disables the button if the stock is 0
                  className={`w-full rounded-lg py-8 font-headline font-black text-2xl uppercase tracking-[0.3em] transition-all italic sharp-edge drop-shadow-lg/50 ${
                    product.stock === 0
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed grayscale" // 2. "Sold Out" styling
                      : "bg-primary-container text-black/90 hover:scale-105 active:scale-[0.98]" // regular styling
                  }`}
                >
                  {product.stock === 0 ? "Out of Stock" : "Reserve Product"}
                </button>
              </div>
            </div>
            {/* Customer Rating Section */}
            <div
              className="mt-12 pt-12 border-t border-secondary-container space-y-8 reveal-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="space-y-4">
                <h3 className="font-headline font-black text-xl uppercase tracking-widest italic">
                  Customer Review
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`material-symbols-outlined text-4xl transition-all duration-300${
                        rating >= star
                          ? "text-primary-container [font-variation-settings:'FILL'_1]"
                          : "text-font-color hover:text-secondary-container [font-variation-settings:'FILL'_0]"
                      }`}
                    >
                      star
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block font-headline font-black text-sm uppercase tracking-[0.3em] text-font-color">
                  Provide Comment
                </label>
                <button className="flex  items-center gap-2 bg-primary-container text-black/90 text-sm p-2 rounded-lg drop-shadow-lg/50 font-bold uppercase  hover:scale-105 active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined">edit</span>
                  Edit
                </button>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts on performance and quality..."
                  className="w-full bg-input-field border border-white/5 rounded-lg drop-shadow-lg/30 p-4 font-body text-white placeholder:text-white/70 focus:outline-none focus:border-primary-container/50 transition-all min-h-[150px] resize-none carbon-noise shadow-inner"
                />
              </div>

              <button
                className="w-full sm:w-auto p-3 bg-primary-container drop-shadow-lg/30 rounded-lg font-bold text-sm text-black uppercase tracking-[0.2em] hover:scale-105  transition-all active:scale-[0.98]"
                onClick={() => insertComment(rating, comment)}
              >
                Submit Review
              </button>
            </div>
            <div
              className="mt-12 overflow-x-auto rounded-lg bg-secondary-container p-1 shadow-lg/30 reveal-up"
              style={{ animationDelay: "0.6s" }}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 font-headline font-black uppercase tracking-widest text-xs text-primary-container">
                      User
                    </th>
                    <th className="px-6 py-4 font-headline font-black uppercase tracking-widest text-xs text-primary-container text-center">
                      Rating
                    </th>
                    <th className="px-6 py-4 font-headline font-black uppercase tracking-widest text-xs text-primary-container">
                      Comment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {commentDB.map((comments) => (
                    <tr
                      key={comments.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-white/90">
                          {comments.Users?.Customer?.[0]?.firstname}{" "}
                          {comments.Users?.Customer?.[0]?.lastname}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <span className="font-black text-sm text-primary-container">
                            {comments.rating}
                          </span>
                          <span className="material-symbols-outlined text-xs text-primary-container [font-variation-settings:'FILL'_1]">
                            star
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-light text-sm text-white/80 leading-relaxed max-w-md">
                          {comments.comment}
                        </p>
                      </td>
                    </tr>
                  ))}
                  {commentDB.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-12 text-center text-white/40 font-headline uppercase tracking-widest text-xs italic"
                      >
                        No reviews yet. Be the first to share your experience.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
              <DynamicProductCards key={item.id} product={item} />
            ))}
            {similarProducts.length === 0 && (
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-headline">
                No similar items found.
              </p>
            )}
          </div>
        </div>
        <div className="mt-20"> </div>
        <DynamicFooter />
      </main>
      {/* Reservation Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-background  border border-white/10 rounded-lg p-6 sm:p-8 md:p-12 text-font-color my-auto shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-black uppercase italic leading-tight flex-1 pr-4">
                Confirm Reservation?
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="material-symbols-outlined flex-shrink-0 bg-on-primary text-white/90  rounded-full p-2 transition-colors"
                aria-label="Close reservation modal"
              >
                close
              </button>
            </div>

            {/* Quantity Section */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex flex-col items-end">
              <p className="font-light text-lg sm:text-sm text-on-surface-variant leading-relaxed">
                How many &nbsp;
                <span className="text-primary-container dark:text-secondary-container font-bold">
                  {product.item_name}
                </span>
                &nbsp; you want to reserve?
              </p>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                max={product.stock}
                min="1"
                className="w-auto bg-input-field px-4 py-3 sm:py-4 border border-white/10 rounded-lg text-white font-headline text-lg focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder="Enter quantity"
              />
              <p className="text-lg sm:text-md text-on-surface-variant/70 font-light">
                Available stock: {product.stock} units
              </p>
            </div>

            {/* Summary Section */}
            <div className="bg-surface-container-low border border-white/5 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="text-lg sm:text-md uppercase tracking-wider text-on-surface/40 font-headline mb-2">
                Order Summary
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg sm:text-md text-on-surface-variant">
                    Product:
                  </span>
                  <span className="text-lg sm:text-md font-bold text-primary-container dark:text-secondary-container">
                    {product.item_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg sm:text-md text-on-surface-variant">
                    Quantity:
                  </span>
                  <span className="text-lg sm:text-md font-bold text-font-color">
                    {quantity || 0} {quantity > 1 ? "units" : "unit"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <button
                className="w-full py-4 sm:py-5 md:py-6 bg-primary-container text-black/90 font-headline font-black uppercase tracking-widest text-sm sm:text-base hover:bg-secondary-container hover:text-white/90 transition-all rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98]"
                onClick={insertReservationToTable}
              >
                Confirm My Reservation
              </button>
              <button
                className="w-full py-3 sm:py-4 bg-surface-container border border-white/10 font-headline font-bold uppercase tracking-wider text-sm sm:text-base text-on-surface hover:bg-surface transition-all rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
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
