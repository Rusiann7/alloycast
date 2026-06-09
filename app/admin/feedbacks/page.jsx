"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import dynamic from "next/dynamic";
import { TableSkeleton } from "../../components/Skeleton";

const DynamicToast = dynamic(() => import("../../components/Toast"));

const supabase = createClient();
export default function FeedbackPage() {
  const [feedbacks, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const itemsPerPage = 5;
  const totalFeedback = feedbacks.length;

  useEffect(() => {
    const getFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from("Feedback")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setFeedback(data || []);

        console.log("Feedback Reloaded!");
      } catch (error) {
        showToast("Error loading feedbacks.", "error");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getFeedback();
  }, []);

  return (
    <div className="text-font-color min-h-screen font-body relative overflow-hidden select-none">
      <main className="pl-0 lg:pl-[var(--sidebar-width)] ml-5 pt-24 lg:pt-5 px-6 lg:px-8 pb-12 min-h-screen transition-all duration-300">
        <div className="px-4 sm:px-10 pb-40">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl text-font-color font-black font-headline tracking-tighter uppercase italic leading-none mb-4 sm:mb-0">
              FEEDBACK
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-font-color">
                TOTAL FEEDBACK:{" "}
                <span className="text-font-color">{totalFeedback}</span>
              </p>
            </div>
          </div>

          {/* Review Table */}
          {loading ? (
            <div
              className="bg-secondary-container shadow-lg/30 rounded-lg overflow-hidden reveal-up border border-white/5"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="p-6">
                <TableSkeleton columns={2} rows={5} />
              </div>
            </div>
          ) : (
            <div
              className="bg-secondary-container shadow-lg/30 rounded-lg overflow-hidden reveal-up border border-white/5"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse min-w-[600px] md:min-w-[1000px]">
                  <thead className="border-b border-primary-container">
                    <tr className="bg-input-field">
                      <th className="px-4 sm:px-8 py-4 sm:py-5 text-center text-sm sm:text-lg font-black font-headline uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary-container">
                        RATING
                      </th>
                      <th className="px-4 sm:px-8 py-4 sm:py-5 text-center text-sm sm:text-lg font-black font-headline uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary-container">
                        FEEDBACK
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {feedbacks.length === 0 ? (
                      <tr>
                        <td
                          colSpan="2"
                          className="px-4 sm:px-8 py-20 text-center"
                        >
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <span className="material-symbols-outlined text-6xl">
                              search_off
                            </span>
                            <p className="text-lg sm:text-xl font-headline font-black uppercase tracking-[0.2em]">
                              Feedback not available
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      feedbacks
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage,
                        )
                        .map((feedback, index) => (
                          <tr
                            key={index}
                            className="border-b border-primary-container"
                          >
                            <td className="px-4 sm:px-8 py-4 sm:py-5 text-center">
                              <div className="flex justify-center items-center gap-0.5 sm:gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`material-symbols-outlined text-lg sm:text-2xl transition-all duration-300 ${
                                      feedback.rating >= star
                                        ? "text-primary-container [font-variation-settings:'FILL'_1]"
                                        : "text-white/20 [font-variation-settings:'FILL'_0]"
                                    }`}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 sm:px-8 py-4 sm:py-5 text-center">
                              <p className="text-sm sm:text-lg text-white font-bold font-headline uppercase tracking-tight">
                                {feedback.comment}
                              </p>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-center p-8 bg-input-field ">
                <div className="flex items-center gap-3">
                  {/* Previous */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-white/5 text-white/90 hover:bg-white/50 transition-colors disabled:opacity-20"
                  >
                    <span className="material-symbols-outlined text-md">
                      chevron_left
                    </span>
                  </button>

                  {/* Current Page Indicator */}
                  <button className="w-8 h-8 flex items-center justify-center bg-primary-container text-black  font-black text-md">
                    {currentPage}
                  </button>

                  {/* Next */}
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(
                          p + 1,
                          Math.ceil(feedbacks.length / itemsPerPage),
                        ),
                      )
                    }
                    disabled={
                      currentPage >= Math.ceil(feedbacks.length / itemsPerPage)
                    }
                    className="w-8 h-8 flex items-center justify-center border border-white/5 text-white/90 hover:bg-white/50 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-md">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </div>
  );
}
