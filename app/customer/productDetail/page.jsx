"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Skeleton } from "../../components/Skeleton";

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

const DynamicDeliveryAddressMapModal = dynamic(
  () => import("../../components/DeliveryAddressMapModal"),
  { ssr: false },
);

function ProductDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // for checking auth users
  const searchParams = useSearchParams(); // identify the id of the product clicked url
  const [quantity, setQuantity] = useState(1); // for adding more product reservation
  const [similarProducts, setSimilarProducts] = useState([]); // for similar products analytics
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [commentDB, setCommentDB] = useState([]);
  const [submitBtn, setSubmitBtn] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState(null);
  const [orderType, setOrderType] = useState("Pickup");
  const [paymentType, setPaymentType] = useState("Cash");
  const [deliveryType, setDeliveryType] = useState("DoorToDoor");
  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    phoneNumber: "",
  });
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

  const commentCount = commentDB.length;

  const averageRating = commentDB.length
    ? commentDB.reduce((sum, item) => sum + item.rating, 0) / commentDB.length
    : 0;

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
  }, [productId, supabase]);

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

      if (user) {
        // Fetch Customer firstname & lastname
        const { data: custData } = await supabase
          .from("Customer")
          .select("firstname, lastname")
          .eq("user_id", user.id)
          .maybeSingle();

        // Fetch Users phone_number
        const { data: userData } = await supabase
          .from("Users")
          .select("phone_number")
          .eq("id", user.id)
          .maybeSingle();

        const fullName = custData
          ? `${custData.firstname || ""} ${custData.lastname || ""}`.trim()
          : "";
        const phoneNumber = userData?.phone_number
          ? String(userData.phone_number)
          : "";

        setCustomerDetails({ fullName, phoneNumber });
      }
    };
    checkUser(); // calls the checkUser function
  }, [supabase]);

  const getComments = useCallback(
    async (product_id) => {
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
      } catch (error) {
        console.log(error);
      }
    },
    [supabase],
  );

  //fella this shyte works the clear functons
  useEffect(() => {
    const initializeFunction = async () => {
      getComments(productId);
      setComment("");
      setRating(0);
    };
    initializeFunction();
  }, [getComments, productId]);

  useEffect(() => {
    if (!user || !productId) return;

    const checkReservationStatus = async () => {
      const { data, error } = await supabase
        .from("Reservation")
        .select("id")
        .eq("user_id", user.id)
        .eq("inventory_id", productId)
        .eq("status", "Approved")
        .limit(1);

      if (!error && data && data.length > 0) {
        setCanReview(true);
      } else {
        setCanReview(false);
      }
    };

    checkReservationStatus();
  }, [user, productId, supabase]);

  useEffect(() => {
    if (!user) return;

    const userCommented = () => {
      const userCheck = commentDB.find((item) => item.user_id === user.id);

      if (!userCheck) {
        setSubmitBtn(true);
      } else {
        setSubmitBtn(false);
        const userComment = commentDB.find((item) => item.user_id === user.id);
        setComment(userComment?.comment);
        setRating(userComment?.rating);
      }
    };
    userCommented();
  }, [user, commentDB]);

  // for product reservation
  const productReservation = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "reserve_click", {
        product_name: product.item_name,
      });
    }
    if (!user) {
      // is user is not logged in
      showToast("You must login first to order this product", "error");
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

  const getOrderType = (event) => {
    const val = event.target.value;
    setOrderType(val);
    if (val === "Delivery") {
      // Reset to Door-to-Door and Online payment when switching to Delivery
      setDeliveryType("DoorToDoor");
      setPaymentType("Online");
    } else {
      // Pickup: reset delivery type and default to Cash
      setDeliveryType("DoorToDoor");
      setPaymentType("Cash");
    }
  };

  const getPaymentType = (event) => {
    const val = event.target.value;
    if (orderType === "Delivery" && deliveryType === "LbcBranch") {
      // LBC branch is always Cash, do not allow changing
      return;
    }
    if (orderType === "Delivery" && val === "Cash") {
      showToast(
        "Cash on Pickup is not applicable for Delivery orders.",
        "error",
      );
      setPaymentType("Online");
      return;
    }
    setPaymentType(val);
  };

  const getDeliveryType = (event) => {
    const val = event.target.value;
    setDeliveryType(val);
    if (val === "LbcBranch") {
      // LBC local branch pickup is always Cash
      setPaymentType("Cash");
    } else {
      // Door to Door is Online Payment
      setPaymentType("Online");
    }
  };

  // Checks URL query parameters for PayMongo redirect callback
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      showToast(
        "Online Payment Successful! Your order has been placed and sent to Admin.",
        "success",
      );
    } else if (paymentStatus === "cancelled") {
      showToast("Payment was cancelled. You can retry anytime.", "error");
    }
  }, [searchParams]);

  // This will insert the reserve product to Reservation Table using the confirmation Modal
  const insertReservationToTable = async () => {
    const { data, error } = await supabase
      .from("Customer")
      .select(`firstname, lastname,Users(phone_number)`);

    if (error) throw error;

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      showToast("Please enter a valid quantity of at least 1.", "error");
      return;
    }
    if (parsedQuantity > product.stock) {
      showToast(
        `Cannot reserve more than the available stock of ${product.stock} units.`,
        "error",
      );
      return;
    }

    // Delivery always goes through address modal (for shipping details)
    if (orderType === "Delivery") {
      setIsModalOpen(false);
      setIsAddressModalOpen(true);
      return;
    }

    // Pickup + Online Payment → go straight to PayMongo (QR / GCash)
    if (orderType === "Pickup" && paymentType === "Online") {
      try {
        // Fetch customer details
        const { data: custData } = await supabase
          .from("Customer")
          .select("firstname, lastname")
          .eq("user_id", user.id)
          .maybeSingle();

        const { data: userData } = await supabase
          .from("Users")
          .select("email, phone_number")
          .eq("id", user.id)
          .maybeSingle();

        const customerFullName = custData
          ? `${custData.firstname || ""} ${custData.lastname || ""}`.trim()
          : "Valued Customer";
        const customerEmail = userData?.email || user.email || "";
        const contactNumber = userData?.phone_number
          ? String(userData.phone_number)
          : "";
        const totalPrice = (product?.price || 0) * parsedQuantity;

        // 1. Insert reservation with Pending Payment status
        const { data: inserted, error: reserveError } = await supabase
          .from("Reservation")
          .insert([
            {
              user_id: user.id,
              inventory_id: product.id,
              quantity: parsedQuantity,
              discount: 0,
              status: "Pending",
              order_type: "Pickup",
              payment_mode: "Online",
              payment_status: "Pending Payment",
              fulfillment_status: "Pending Pickup",
            },
          ])
          .select()
          .single();

        if (reserveError) throw reserveError;

        // 2. Create PayMongo checkout session
        const response = await fetch("/api/paymongo/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalPrice,
            item_name: product.item_name,
            quantity: parsedQuantity,
            reservation_id: inserted.id,
            customer_name: customerFullName,
            customer_email: customerEmail,
            contact_number: contactNumber,
            // No shipping address needed for Pickup
          }),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          throw new Error(
            resData.error || "Failed to initiate PayMongo payment session.",
          );
        }

        // 3. Redirect to PayMongo checkout (supports QR Ph / GCash)
        showToast("Redirecting to PayMongo for online payment...", "success");
        setTimeout(() => {
          window.location.href = resData.checkout_url;
        }, 1500);
        return;
      } catch (err) {
        console.error("Pickup Online Payment Error:", err);
        showToast(err.message || "Payment initiation failed.", "error");
        return;
      }
    }

    // Pickup + Cash Flow
    try {
      // Fetch customer details for email notification
      const { data: custData } = await supabase
        .from("Customer")
        .select("firstname, lastname")
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: userData } = await supabase
        .from("Users")
        .select("email, phone_number")
        .eq("id", user.id)
        .maybeSingle();

      const customerFullName = custData
        ? `${custData.firstname || ""} ${custData.lastname || ""}`.trim()
        : "Valued Customer";
      const customerEmail = userData?.email || user.email || "";
      const contactNumber = userData?.phone_number
        ? String(userData.phone_number)
        : "";

      const parsedTotalPrice = (product?.price || 0) * parsedQuantity;

      const reservationDataInsert = {
        user_id: user.id,
        inventory_id: product.id,
        quantity: parsedQuantity,
        discount: 0,
        status: "Pending",
        order_type: "Pickup",
        payment_mode: "Cash",
        payment_status: "Pending Payment",
        fulfillment_status: "Pending Pickup",
      };

      const { data: inserted, error: reserveError } = await supabase
        .from("Reservation")
        .insert([reservationDataInsert])
        .select()
        .single();

      if (reserveError) throw reserveError;

      // Send dual emails: Admin + Customer 48hr pickup reminder
      await fetch("/api/notifications/send-pickup-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: inserted.id,
          customerName: customerFullName,
          customerEmail,
          contactNumber,
          productName: product.item_name,
          quantity: parsedQuantity,
          totalPrice: parsedTotalPrice,
          orderType: "Pickup",
          paymentMode: "Cash",
          createdAt: inserted.created_at,
        }),
      });

      showToast(
        "Pickup Reservation Placed! Please pay in-store upon pickup. A confirmation email has been sent.",
        "success",
      );
      setIsModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.error("Reservation Failed: ", error.message);
      showToast("Failed to process pickup reservation.", "error");
    }
  };

  // Handles Delivery & Online Payment
  const handleConfirmDeliveryAddress = async (addressData) => {
    setIsSubmittingAddress(true);
    const parsedQuantity = parseInt(quantity, 10) || 1;
    const totalPrice = (product?.price || 0) * parsedQuantity;

    // ── Door-to-Door + Online: Email admin, wait for manual payment ──────────
    if (deliveryType === "DoorToDoor" && paymentType === "Online") {
      try {
        // Fetch customer profile for contact info
        const { data: custData } = await supabase
          .from("Customer")
          .select("firstname, lastname")
          .eq("user_id", user.id)
          .maybeSingle();

        const { data: userData } = await supabase
          .from("Users")
          .select("email, phone_number")
          .eq("id", user.id)
          .maybeSingle();

        const customerFullName =
          addressData.customerName ||
          (custData
            ? `${custData.firstname || ""} ${custData.lastname || ""}`.trim()
            : "Valued Customer");
        const customerEmail = userData?.email || user.email || "";
        const contactNumber =
          addressData.contactNumber ||
          (userData?.phone_number ? String(userData.phone_number) : "");

        // 1. Insert reservation — no stock decrement, no revenue yet
        const { data: inserted, error: reserveError } = await supabase
          .from("Reservation")
          .insert([
            {
              user_id: user.id,
              inventory_id: product.id,
              quantity: parsedQuantity,
              discount: 0,
              status: "Pending",
              order_type: "Delivery",
              payment_mode: "Online",
              payment_status: "Pending Payment",
              fulfillment_status: "Pending Shipping",
              shipping_address: addressData.shippingAddress,
              district: addressData.district,
              zip_code: parseInt(addressData.zipCode, 10) || null,
              latitude: addressData.latitude,
              longtitude: addressData.longtitude,
            },
          ])
          .select()
          .single();

        if (reserveError) throw reserveError;

        // 2. Notify all admins via email (admin will reply with PayMongo / GCash QR)
        await fetch("/api/notifications/send-delivery-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reservationId: inserted.id,
            customerName: customerFullName,
            customerEmail,
            contactNumber,
            productName: product.item_name,
            quantity: parsedQuantity,
            totalPrice,
            shippingAddress: addressData.shippingAddress,
            district: addressData.district,
            zipCode: addressData.zipCode,
            deliveryType: "Door-to-Door",
            createdAt: inserted.created_at,
          }),
        });

        showToast(
          "Order placed! Our team will send you a payment link via email within 48 hours.",
          "success",
        );
        setIsAddressModalOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
        return;
      } catch (err) {
        console.error("Door-to-Door Delivery Error:", err);
        showToast(err.message || "Failed to place delivery order.", "error");
        setIsSubmittingAddress(false);
        return;
      }
    }

    // ── LBC Local Branch + Cash: Email admin, manual COD via LBC ────────────
    if (deliveryType === "LbcBranch" && paymentType === "Cash") {
      try {
        // Fetch customer profile
        const { data: custData } = await supabase
          .from("Customer")
          .select("firstname, lastname")
          .eq("user_id", user.id)
          .maybeSingle();

        const { data: userData } = await supabase
          .from("Users")
          .select("email, phone_number")
          .eq("id", user.id)
          .maybeSingle();

        const customerFullName =
          addressData.customerName ||
          (custData
            ? `${custData.firstname || ""} ${custData.lastname || ""}`.trim()
            : "Valued Customer");
        const customerEmail = userData?.email || user.email || "";
        const contactNumber =
          addressData.contactNumber ||
          (userData?.phone_number ? String(userData.phone_number) : "");

        // 1. Insert reservation — no stock decrement, no revenue yet
        //    fulfillment_status starts as "Pending Shipping"; admin will update
        //    through the stages: Pending Shipping → Shipped → Completed
        const { data: inserted, error: reserveError } = await supabase
          .from("Reservation")
          .insert([
            {
              user_id: user.id,
              inventory_id: product.id,
              quantity: parsedQuantity,
              discount: 0,
              status: "Pending",
              order_type: "Delivery",
              payment_mode: "Cash",
              payment_status: "Pending Payment",
              fulfillment_status: "Pending Shipping",
              shipping_address: addressData.shippingAddress,
              district: addressData.district,
              zip_code: parseInt(addressData.zipCode, 10) || null,
              latitude: addressData.latitude,
              longtitude: addressData.longtitude,
            },
          ])
          .select()
          .single();

        if (reserveError) throw reserveError;

        // 2. Notify all admins — they will ship via LBC and reply to the customer
        await fetch("/api/notifications/send-lbc-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reservationId: inserted.id,
            customerName: customerFullName,
            customerEmail,
            contactNumber,
            productName: product.item_name,
            quantity: parsedQuantity,
            totalPrice,
            shippingAddress: addressData.shippingAddress,
            district: addressData.district,
            zipCode: addressData.zipCode,
            createdAt: inserted.created_at,
          }),
        });

        showToast(
          "Order placed! Our team will process your LBC shipment and email you the total cost + tracking details.",
          "success",
        );
        setIsAddressModalOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
        return;
      } catch (err) {
        console.error("LBC Order Error:", err);
        showToast(err.message || "Failed to place LBC order.", "error");
        setIsSubmittingAddress(false);
        return;
      }
    }

    // ── All other Delivery types → PayMongo checkout (existing flow) ─────────

    try {
      // 1. Insert order into Reservation table with Pending Payment status
      const { data: inserted, error: dbError } = await supabase
        .from("Reservation")
        .insert([
          {
            user_id: user.id,
            inventory_id: product.id,
            quantity: parsedQuantity,
            status: "Pending",
            payment_status: "Pending Payment",
            fulfillment_status: "Pending Shipping",
            order_type: orderType || "Delivery",
            payment_mode: paymentType || "Online",
            shipping_address: addressData.shippingAddress,
            district: addressData.district,
            zip_code: parseInt(addressData.zipCode, 10) || null,
            latitude: addressData.latitude,
            longtitude: addressData.longtitude,
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // 2. Call PayMongo Checkout API Route
      const response = await fetch("/api/paymongo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          item_name: product.item_name,
          quantity: parsedQuantity,
          reservation_id: inserted.id,
          customer_name: addressData.customerName,
          customer_email: user.email,
          contact_number: addressData.contactNumber,
          shipping_address: addressData.shippingAddress,
          district: addressData.district,
          zip_code: addressData.zipCode,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(
          resData.error || "Failed to initiate PayMongo payment session.",
        );
      }

      // 3. Redirect customer to PayMongo GCash checkout URL
      showToast("Redirecting to PayMongo GCash Checkout...", "success");
      setTimeout(() => {
        window.location.href = resData.checkout_url;
      }, 1500);
    } catch (err) {
      console.error("Online Payment Error:", err);
      showToast(err.message || "Payment initiation failed.", "error");
      setIsSubmittingAddress(false);
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

      if (rating === 0) {
        showToast("Please provide a star rating.", "error");
        return;
      }
      if (!comment || comment.trim() === "") {
        showToast("Please write a comment.", "error");
        return;
      }

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
      showToast("Error Adding comment. Try again later", "error");
      console.log(error);
    }
  };

  const updateComment = async (rating, comment) => {
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

      if (rating === 0) {
        showToast("Please provide a star rating.", "error");
        return;
      }
      if (!comment || comment.trim() === "") {
        showToast("Please write a comment.", "error");
        return;
      }

      const { error } = await supabase
        .from("Ratings")
        .update({
          comment: comment,
          rating: rating,
        })
        .eq("product_id", productId)
        .eq("user_id", user.id);

      if (error) throw error;

      getComments(productId);
      showToast("Comment Updated", "success");

      console.log(rating, comment);
    } catch (error) {
      showToast("Error updating comment. Try again later.", "error");
      console.log(error);
    }
  };

  const checkWishlist = async () => {
    if (!user || !productId) return; // guard
    try {
      const { data, error } = await supabase
        .from("Wishlist")
        .select("is_active")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      setWishlistStatus(data !== null ? data.is_active : null);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const doWishlistCheck = async () => {
      checkWishlist();
    };
    doWishlistCheck();
  }, [user, productId]); 

  const addWishlist = async () => {
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

      if (wishlistStatus === null) {
        const { error } = await supabase.from("Wishlist").insert({
          product_id: productId,
          user_id: user.id,
          is_active: true,
        });

        if (error) throw error;

        console.log(wishlistStatus);
        checkWishlist();
      } else if (!wishlistStatus) {
        const { error } = await supabase
          .from("Wishlist")
          .update({ is_active: true })
          .eq("product_id", productId)
          .eq("user_id", user.id);

        if (error) throw error;
        console.log(wishlistStatus);
        checkWishlist();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeWishlist = async () => {
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

      const { error } = await supabase
        .from("Wishlist")
        .update({ is_active: false })
        .eq("product_id", productId)
        .eq("user_id", user.id);

      if (error) throw error;

      checkWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  // for loading product
  if (loading) {
    return (
      <div className="font-body selection:bg-primary-container selection:text-white min-h-screen pt-24 lg:pt-32">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 px-6 lg:px-12 pb-24">
          <div className="h-[450px] w-full rounded-lg relative overflow-hidden flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="py-0 space-y-8">
            <Skeleton className="h-8 w-1/3 rounded-lg" />
            <Skeleton className="h-16 w-3/4 rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-1/2 rounded-lg" />
            </div>
            <Skeleton className="h-24 w-full rounded-lg mt-10" />
            <Skeleton className="h-16 w-full rounded-lg mt-6" />
          </div>
        </div>
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
    <div className="font-body selection:bg-primary-container selection:text-white min-h-screen">
      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      <main className="pt-24 lg:pt-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 px-6 lg:px-12 pb-24">
          {/* Left Column: Image Display */}
          <div className=" h-fit space-y-4 reveal-up">
            <div className="relative w-full h-auto max-h-[450px] border-2 border-primary-container hero-border-glow  rounded-lg overflow-hidden display-case-lighting group shadow-lg/50 flex items-center justify-center">
              <div className="absolute inset-0 carbon-noise opacity-30 pointer-events-none z-10"></div>
              <Image
                alt={product.item_name}
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                src={product.item_image}
                width={800}
                height={450}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 85vw"
              />

              {/* Dynamic Tag based on category */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                {" "}
                {/* Tightened positions from 8 to 4 */}
                <span className="bg-primary-container text-black font-headline font-black text-sm px-3 py-1.5 uppercase tracking-tighter shadow-2xl skew-x-[-12deg]">
                  {product.category || "PREMIUM SELECTION"}
                </span>
                {product.stock < 5 && (
                  <span className="bg-on-primary text-white font-headline font-black text-[10px] px-3 py-1.5 uppercase tracking-tighter shadow-2xl skew-x-[-12deg]">
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
                <h1 className="text-[40px] font-headline font-black uppercase leading-[0.8] tracking-tighter mb-6 italic">
                  {product.item_name}
                </h1>
                <div className="flex items-center gap-6">
                  <p className="text-font-color font-headline font-black tracking-[0.2em] text-lg uppercase flex items-center gap-4 italic">
                    {product.brand} OFFICIAL SERIES
                  </p>
                  {averageRating < 1 ? (
                    <span className="rounded-lg p-1 bg-primary-container font-headline font-black text-black/90">
                      NO RATING
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-primary-container [font-variation-settings:'FILL'_1]">
                        star
                      </span>
                      <span className="text-xs text-primary-container font-bold">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Allocation Telemetry */}
              <div className="rounded-lg carbon-noise relative group">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <p className="font-headline text-sm  text-font-color  uppercase tracking-[0.5em] mb-3 font-bold">
                      ITEM PRICE:
                    </p>
                    <p className="text-6xl lg:text-6xl font-headline font-black text-font-color  tracking-tighter italic tabular-nums">
                      ₱{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-headline font-black text-on-primary dark:text-red-500 uppercase tracking-tight animate-pulse">
                      {product.stock === 1
                        ? "1 STOCK LEFT!"
                        : product.stock === 0
                          ? "OUT OF STOCK"
                          : product.stock + " STOCKS LEFT"}
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
              <div className="flex gap-4 mt-10">
                <button
                  onClick={productReservation}
                  disabled={product.stock === 0} // disables the button if the stock is 0
                  className={`flex-1 rounded-lg py-8 font-headline font-black text-2xl uppercase tracking-[0.3em] transition-all italic sharp-edge drop-shadow-lg/50 ${
                    product.stock === 0
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed grayscale" // 2. "Sold Out" styling
                      : "bg-primary-container text-black/90 hover:scale-105 active:scale-[0.98]" // regular styling
                  }`}
                >
                  {product.stock === 0 ? "Out of Stock" : "Order Product"}
                </button>

                {wishlistStatus ? (
                  <button
                    onClick={removeWishlist}
                    className="flex-shrink-0 w-16 h-16 rounded-lg bg-red-600 border-2 border-red-700 text-white transition-all hover:scale-110 active:scale-[0.95] drop-shadow-lg/50 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-3xl">
                      delete
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={addWishlist}
                    className="flex-shrink-0 w-16 h-16 rounded-lg bg-secondary-container border-2 border-primary-container text-primary-container transition-all hover:scale-110 active:scale-[0.95] drop-shadow-lg/50 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-3xl">
                      favorite
                    </span>
                  </button>
                )}
              </div>
            </div>
            {/* Customer Rating Section */}
            <div
              className="mt-12 pt-12 border-t border-secondary-container space-y-8 reveal-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="space-y-4">
                <h3 className="font-headline font-black text-xl uppercase tracking-widest italic">
                  Customer Review ({commentCount})
                </h3>
              </div>

              <div
                className="mt-12 overflow-x-auto rounded-lg bg-secondary-container shadow-lg/30 reveal-up"
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
                  <tbody className="divide-y divide-white/5 bg-input-field">
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
                          className="px-6 py-12 text-center text-white/80 font-headline uppercase tracking-widest text-xs italic"
                        >
                          No reviews yet. Be the first to share your experience.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {canReview ? (
                <div className="space-y-4 bg-secondary-container p-4 rounded-lg shadow-lg/30">
                  <div className="flex items-center gap-1">
                    <p className="text-font-color text-lg uppercase font-bold">
                      Rating:{" "}
                    </p>
                    <span>
                      {" "}
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
                    </span>
                  </div>
                  <label className="block font-headline font-black text-sm uppercase tracking-[0.3em] text-white/90">
                    Provide Comment
                  </label>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your comments about the product quality..."
                    className="w-full h-full bg-input-field border border-white/5 rounded-lg drop-shadow-lg/30 p-4 font-body text-white placeholder:text-white/70 focus:outline-none focus:border-primary-container/50 transition-all min-h-[150px] resize-none carbon-noise shadow-inner"
                  />
                  <div className="flex gap-2 justify-end">
                    {!submitBtn ? (
                      <button
                        className="w-full sm:w-auto p-3 bg-primary-container drop-shadow-lg/30 rounded-lg font-bold text-sm text-black uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-[0.98]"
                        onClick={() => updateComment(rating, comment)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                        Edit Review
                      </button>
                    ) : (
                      <button
                        className="w-full sm:w-auto p-3 bg-primary-container drop-shadow-lg/30 rounded-lg font-bold text-sm text-black uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-[0.98]"
                        onClick={() => insertComment(rating, comment)}
                      >
                        Submit Review
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-secondary-container p-8 rounded-lg shadow-lg/30 text-center flex flex-col items-center justify-center border border-white/5">
                  <span className="material-symbols-outlined text-5xl text-primary-container mb-4 opacity-50">
                    lock
                  </span>
                  <p className="font-headline font-bold uppercase tracking-widest text-sm text-white/70">
                    Only customers with an approved reservation can leave a
                    review.
                  </p>
                </div>
              )}
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          {/* Removed mt-10 and adjusted padding to max out at p-6 instead of p-12 */}
          <div className="relative mt-30 w-full max-w-md bg-modal-background border border-white/10 rounded-lg p-5 sm:p-6 text-font-color shadow-2xl">
            {/* Header - Reduced mb */}
            <div className="flex justify-between items-start mb-4 sm:mb-5">
              {/* Scaled down the massive heading sizes slightly */}
              <h2 className="text-xl sm:text-2xl font-headline font-black uppercase italic leading-tight flex-1 pr-4">
                Order Confirmation
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="material-symbols-outlined flex-shrink-0 bg-on-primary text-white/90 rounded-full p-1.5 transition-colors"
                aria-label="Close reservation modal"
              >
                close
              </button>
            </div>

            {/* Quantity Section - Tighter spacing */}
            <div className="space-y-2 mb-4 sm:mb-5 flex flex-col ">
              <p className="text-md ">Available stock: {product.stock}</p>
              <label htmlFor="quantity-input" className="text-sm sm:text-base">
                Enter amount of items you want to reserve
              </label>
              <div className="flex flex-col gap-1.5 items-end w-full sm:w-auto">
                <input
                  id="quantity-input"
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setQuantity("");
                      return;
                    }
                    const parsed = parseInt(val, 10);
                    if (isNaN(parsed)) {
                      setQuantity("");
                    } else if (parsed > product.stock) {
                      setQuantity(product.stock);
                      showToast(
                        `Quantity capped at maximum available stock (${product.stock})`,
                        "error",
                      );
                    } else if (parsed < 1) {
                      setQuantity(1);
                    } else {
                      setQuantity(parsed);
                    }
                  }}
                  max={product.stock}
                  min="1"
                  className="w-16 bg-input-field border border-white/10 rounded-lg p-3 text-center text-white font-headline text-base focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  placeholder="1"
                />
              </div>
              <label htmlFor="">Order Type</label>
              <select
                name="orderType"
                id="orderType"
                className="w-full bg-input-field border border-white/[0.03] rounded-lg h-auto p-2 text-md font-headline font-bold  tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
                value={orderType}
                onChange={getOrderType}
              >
                <option value="Pickup">Pickup</option>
                <option value="Delivery">
                  Delivery (Outside Olongapo Only)
                </option>
              </select>
              {/* Delivery Type — only shown for Delivery orders */}
              {orderType === "Delivery" && (
                <>
                  <label htmlFor="deliveryType">Delivery Type:</label>
                  <select
                    name="deliveryType"
                    id="deliveryType"
                    className="w-full bg-input-field border border-white/[0.03] rounded-lg h-auto p-2 text-md font-headline font-bold tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10"
                    value={deliveryType}
                    onChange={getDeliveryType}
                  >
                    <option value="DoorToDoor">
                      Door to Door Delivery (Online Payment)
                    </option>
                    <option value="LbcBranch">
                      LBC Local Branch Pickup (Cash)
                    </option>
                  </select>
                </>
              )}

              <label htmlFor="paymentType">Mode of Payment:</label>
              <select
                name="paymentType"
                id="paymentType"
                className={`w-full bg-input-field border border-white/[0.03] rounded-lg h-auto p-2 text-md font-headline font-bold tracking-widest focus:border-primary-container outline-none transition-all duration-300 text-white placeholder:text-white/10 ${
                  orderType === "Delivery"
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
                value={paymentType}
                onChange={getPaymentType}
                disabled={orderType === "Delivery"}
              >
                {/* Mode of payment */}
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </div>

            {/* Summary Section - Compact padding and margins */}
            <div className="border border-primary-container bg-input-field rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
              <p className="text-center text-md uppercase tracking-wider text-primary-container font-headline mb-1.5">
                Order Summary
              </p>
              <div className="space-y-1.5 text-sm sm:text-base">
                <div className="flex flex-col ">
                  <span className="text-primary-container">Product:</span>
                  <p className="text-white/90 truncate max-w-full">
                    {product.item_name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-container">Quantity:</span>
                  <span className="font-bold text-white/90">
                    {quantity || 0} {quantity > 1 ? "units" : "unit"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-container">Order Type:</span>
                  <span className="font-bold text-white/90">{orderType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-container">
                    Mode of Payment:
                  </span>
                  <span className="font-bold text-white/90">{paymentType}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Shaved off large button heights */}
            <div className="space-y-2">
              <button
                className="w-full py-2.5 sm:py-3 bg-primary-container text-black/90 font-headline font-black uppercase tracking-widest text-xs sm:text-sm hover:scale-[1.02] transition-all rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98]"
                onClick={insertReservationToTable}
              >
                Confirm Order
              </button>
              <button
                className="w-full py-2 sm:py-2.5 bg-surface-container border border-secondary-container font-headline font-bold uppercase tracking-wider text-xs sm:text-sm text-on-surface hover:bg-secondary-container hover:text-white/90 transition-all rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DynamicDeliveryAddressMapModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirmAddress={handleConfirmDeliveryAddress}
        defaultCustomerName={customerDetails.fullName}
        defaultPhoneNumber={customerDetails.phoneNumber}
        isSubmitting={isSubmittingAddress}
      />

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
