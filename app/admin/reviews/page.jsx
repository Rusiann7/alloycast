"use client";

import { useState, useEffect } from "react";
import Toast from "../../components/Toast";
import { createClient } from "../../../lib/supabase/client";
import dynamic from "next/dynamic";

const DynamicToast = dynamic(() => import("../../components/Toast"));

const DynamicDeleteConfirmationModal = dynamic(
  () => import("../../components/DeleteConfirmationModal"),
  {
    ssr: false,
  },
);

export default function FeedbackPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentDB, setCommentDB] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const totalReviews = commentDB.length;

  const supabase = createClient();

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

  useEffect(() => {
    const fetchComments = async () => {
      await getCommentsAuto();
    };
    fetchComments();
  }, []);

  const confirmDeleteReview = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("Ratings")
        .delete()
        .eq("id", itemToDelete.id);

      if (error) throw error;

      showToast("Review deleted", "success");
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await getCommentsAuto();
    } catch (error) {
      showToast("Failed to remove review");
      console.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  return (
    <div className="bg-background text-font-color min-h-screen font-body relative overflow-hidden select-none">
      <main className="pl-0 lg:pl-[var(--sidebar-width)] ml-5 pt-24 lg:pt-5 px-6 lg:px-8 pb-12 min-h-screen transition-all duration-300">
        <div className="px-4 sm:px-10 pb-40">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl text-font-color font-black font-headline tracking-tighter uppercase italic leading-none mb-4 sm:mb-0">
              REVIEWS
            </h3>
            <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-font-color">
              TOTAL ITEMS:{" "}
              <span className="text-font-color">{totalReviews}</span>
            </p>
          </div>

          {/* Review Table */}
          <div
            className="bg-secondary-container shadow-lg/30 rounded-lg  overflow-x-auto reveal-up scrollbar-hide"
            style={{ animationDelay: "0.2s" }}
          >
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-input-field">
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
                    <td className="px-8 py-5 text-center text-white/90">
                      {comments.Inventory?.item_name}
                    </td>
                    <td className="px-8 py-5 text-center text-white/90">
                      {comments.Inventory?.brand}
                    </td>
                    <td className="px-8 py-5 text-center text-white/90">
                      {comments.Users?.Customer?.[0]?.firstname}{" "}
                      {comments.Users?.Customer?.[0]?.lastname}
                    </td>
                    <td className="px-8 py-5 text-center text-white/90">
                      {comments.rating}
                    </td>
                    <td className="px-8 py-5 text-center text-white/90">
                      {comments.comment}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setItemToDelete(comments);
                            setDeleteModalOpen(true);
                          }}
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

      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      <DynamicDeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteReview}
        itemName={
          itemToDelete?.comment
            ? `"${itemToDelete.comment.substring(0, 30)}..."`
            : "this review"
        }
        itemType="Review"
        isDeleting={isDeleting}
      />
    </div>
  );
}
