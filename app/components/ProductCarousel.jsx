"use client";
import React from "react";
import styled from "styled-components";
import ProductCard from "./ProductCard";

export default function ProductCarousel({
  products = [],
  tag,
  tagColor,
  speed = 30,
}) {
  if (!products.length) return null;

  // Duplicate the array to create a seamless infinite loop
  const duplicatedProducts = [...products, ...products];

  return (
    <CarouselContainer>
      <Track $speed={speed}>
        {duplicatedProducts.map((product, index) => (
          <CardWrapper key={`${product.id}-${index}`}>
            <ProductCard
              product={product}
              tag={tag}
              tagColor={tagColor}
              featured
            />
          </CardWrapper>
        ))}
      </Track>
    </CarouselContainer>
  );
}

const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 20px 0;

  &::before {
    left: 0;
    background: linear-gradient(to right, rgba(255, 255, 255, 1), transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, rgba(255, 255, 255, 1), transparent);
  }

  /* Support dark mode edge fading if your app toggles body.dark */
  body.dark &::before {
    background: linear-gradient(to right, rgba(18, 18, 18, 1), transparent);
  }
  body.dark &::after {
    background: linear-gradient(to left, rgba(18, 18, 18, 1), transparent);
  }
`;

const Track = styled.div`
  display: flex;
  width: max-content;
  gap: 24px;
  animation: scroll ${(props) => props.$speed || 30}s linear infinite;

  /* Pause sliding when the user hovers over any card so they can easily click links */
  &:hover {
    animation-play-state: paused;
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

const CardWrapper = styled.div`
  width: 280px; /* Fixed card width in the carousel */
  flex-shrink: 0;
`;
