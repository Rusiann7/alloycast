"use client"; // Required for styled-components and event hooks in Next.js App Router

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

export default function ProductCard({ product, tag, tagColor, featured }) {
  if (!product) return null;

  const reservationAnalytics = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "similar_product_click", {
        to_product: product.item_name,
      });
    }
  };

  return (
    <StyledWrapper>
      <div className="card hover:drop-shadow-2xl/50">
        {/* Visual FX Layers */}
        <div className="card__shine" />
        <div className="card__glow" />

        {/* Main Content Layout Container */}
        <div className="card__content">
          {/* Top Image & Badge Section */}
          <div className="card__image relative aspect-[4/3]">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={product.item_image || "/placeholder-car.png"}
              alt={product.item_name}
              className="w-full h-full object-cover transition-transform duration-700 transform-gpu"
            />

            {(tag || product.category) && (
              /* The container is now managed strictly via our CSS pseudo-selectors below */
              <div className="card__badge absolute top-4 left-4">
                <span
                  className={`${tagColor || "bg-primary-container text-black/90"} text-xs rounded-md font-black uppercase px-2 py-1 shadow-md`}
                >
                  {tag || product.category}
                </span>
              </div>
            )}
          </div>

          {/* Typography Metadata Section */}
          <div className="card__text flex-1 flex flex-col mt-3">
            <p className="text-xs font-black uppercase tracking-widest mb-1 text-black/60">
              {product.brand}
            </p>
            <h3 className="card__title font-extrabold text-sm uppercase mb-2 text-black">
              {product.item_name}
            </h3>
          </div>

          {/* Pricing & Call-To-Action Footer Area */}
          <div className="card__footer mt-auto flex items-center justify-between">
            <span className="card__price font-black text-lg text-black">
              ₱ {product.price}
            </span>

            <Link
              href={`/customer/productDetail?id=${product.id}`}
              onClick={reservationAnalytics}
            >
              <button className="card__button size-10 flex items-center justify-center shadow-md bg-secondary-container  rounded-full p-3 text-black/90  transition-colors">
                <span className="material-symbols-outlined text-white">
                  shopping_cart
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  height: 100%;

  .card {
    --card-bg: #f8e408;
    --card-accent: #000000;
    --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

    width: 100%;
    height: 100%;
    background: var(--card-bg);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: var(--card-shadow);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .card__glow {
    position: absolute;
    inset: -10px;
    background: radial-gradient(
      circle at 50% 0%,
      rgba(0, 0, 0, 0.05) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .card__content {
    padding: 1.25em;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
  }

  /* Category Tag Setup (Hidden by default) */
  .card__badge {
    opacity: 0;
    transform: translateY(-10px) scale(0.9);
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 4;
  }

  .card__image {
    width: 100%;
    border-radius: 12px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  .card__title,
  .card__price,
  .card__button {
    transition: all 0.3s ease;
  }

  /* Hover Effects Trigger States */
  .card:hover {
    transform: translateY(-8px);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.15),
      0 10px 10px -5px rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0.15);
  }

  .card:hover .card__shine {
    opacity: 1;
    animation: shine 3s infinite;
  }

  .card:hover .card__glow {
    opacity: 1;
  }

  /* Make Category Visible on Hover */
  .card:hover .card__badge {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .card:hover .card__image {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
  }

  .card:hover .card__image img {
    transform: scale(1.06);
  }

  .card:hover .card__title {
    transform: translateX(2px);
  }

  .card:hover .card__price {
    transform: translateX(2px);
  }

  .card:hover .card__button {
    transform: scale(1.05);
  }

  /* Active Press Down State */
  .card:active {
    transform: translateY(-3px) scale(0.99);
  }

  /* Keyframe Animations */
  @keyframes shine {
    0% {
      background-position: -100% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;
