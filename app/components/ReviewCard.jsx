"use client";

import React from "react";
import styled from "styled-components";

export default function ReviewCard({ review }) {
  if (!review) return null;
  const customer = Array.isArray(review.Users?.Customer)
    ? review.Users?.Customer[0]
    : review.Users?.Customer;

  const firstName = customer?.firstname || "Verified Customer";

  const rating = Number(review.rating) || 5;

  return (
    <CardWrapper>
      <div className="card">
        {/* Review Comment */}
        <p className="text-sm text-black/80 font-medium line-clamp-3 italic mb-3">
          "{review.comment || "Great product and service!"}"
        </p>
        {review.Inventory?.item_name && (
          <span className="text-[10px] font-bold text-black/50 truncate max-w-[120px] uppercase">
            {review.Inventory.item_name}
          </span>
        )}
        {/* Header: Stars & Item Name */}
        <div className="flex  items-center justify-between mb-2">
          <div className="flex text-input-field">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-sm"
                style={{
                  fontVariationSettings: `'FILL' ${i < rating ? 1 : 0}`,
                }}
              >
                star
              </span>
            ))}
          </div>
        </div>

        {/* Customer / Footer info */}
        <div className="mt-auto pt-2 border-t border-black/5 flex justify-between items-center text-xs text-black/70">
          <span>{firstName || "Verified Customer"}</span>{" "}
          <span className="text-[10px] opacity-85">Verified Customer</span>
        </div>
      </div>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  height: 100%;

  .card {
    --card-bg: var(--primary-container, #f4f4f5);

    width: 100%;
    height: 100%;
    background: var(--card-bg);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  body.dark & .card {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;
