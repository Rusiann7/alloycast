"use client";

import { useState, useEffect } from "react";
import Toast from "../../components/Toast";
import { createClient } from "../../../lib/supabase/client";

export default function FeedbackPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentDB, setCommentDB] = useState([]);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const totalReviews = commentDB.length;

  const supabase = createClient();

  useEffect(() => {
    const getCommentsAuto = async () => {
      const { data, error } = await supabase.from("Ratings").select(
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
      );

      if (error) throw error;
      setCommentDB(data || []);
      console.log(data);
    };
    getCommentsAuto();
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  return (
    <div className="bg-background text-[#e5e2e1] min-h-screen font-body relative overflow-hidden select-none">
      <main className="lg:ml-64 pt-28 lg:pt-10 min-h-screen">
        <div className="px-4 sm:px-10 pb-40">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl text-primary-container font-black font-headline tracking-tighter uppercase italic leading-none mb-4 sm:mb-0">
              REVIEWS
            </h3>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full" />
          <p className="text-[11px] sm:text-[13px] font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-white/40">
            TOTAL ITEMS:{" "}
            <span className="text-primary-container">{totalReviews}</span>
          </p>

          {/* Review Table */}
          <div
            className="bg-[#111111]/40 border border-white/[0.03] rounded-lg overflow-x-auto reveal-up scrollbar-hide"
            style={{ animationDelay: "0.2s" }}
          >
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/[0.03] bg-[#131313]">
                  <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                    PRODUCT NAME
                  </th>
                  <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                    BRAND
                  </th>
                  <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                    CUSTOMER
                  </th>
                  <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                    RATING
                  </th>
                  <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                    REVIEW
                  </th>
                  <th className="px-8 py-5 text-center text-md font-black font-headline uppercase tracking-[0.3em] text-primary-container">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.02]">
                {commentDB.map((comments) => (
                  <tr key={comments.id}>
                    <td className="px-8 py-5 text-center">
                      {comments.Inventory?.item_name}
                    </td>
                    <td className="px-8 py-5 text-center">
                      {comments.Inventory?.brand}
                    </td>
                    <td className="px-8 py-5 text-center">
                      {comments.Users?.Customer?.[0]?.firstname}{" "}
                      {comments.Users?.Customer?.[0]?.lastname}
                    </td>
                    <td className="px-8 py-5 text-center">{comments.rating}</td>
                    <td className="px-8 py-5 text-center">
                      {comments.comment}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          // onClick={() => deleteProduct(item.id)}
                          className="w-8 h-8 flex items-center justify-center bg-error-container rounded-lg text-white hover:bg-error-container/40 hover:text-white/90 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </div>
  );
}
