import { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase/client";
import dynamic from "next/dynamic";
import styled from "styled-components";

const DynamicReviewCard = dynamic(() => import("./ReviewCard"), { ssr: false });

export default function ReviewFeedbackCarousel({ speed }) {
  const supabase = createClient();

  const [reviews, setReview] = useState([]);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    try {
      const { data } = await supabase
        .from("Ratings")
        .select(`*, Inventory(item_name), Users(id, Customer(firstname))`);

      setReview(data || []);
    } catch (e) {
      console.error("Error fetching reviews:", e);
    }
  };

  if (!reviews.length) return null;

  const minimumRequiredItems = 15;
  const repeatCount = Math.ceil(minimumRequiredItems / reviews.length);
  const duplicatedReviews = Array(Math.max(repeatCount, 2))
    .fill(reviews)
    .flat();

  return (
    <CarouselContainer>
      <Track $speed={speed}>
        {duplicatedReviews.map((item, index) => (
          <CardWrapper key={`${item.id}-${index}`}>
            <DynamicReviewCard review={item} />
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

  body.dark &::before {
    background: linear-gradient(to right, rgba(18, 18, 18, 1), transparent);
  }
  body.dark &::after {
    background: linear-gradient(to left, rgba(18, 18, 18, 1), transparent);
  }
`;

const Track = styled.div`
  display: flex;
  width: max-content; /* Critical: keeps track as wide as all cards combined */
  gap: 20px;
  animation: scroll ${(props) => props.$speed || 35}s linear infinite;

  &:hover {
    animation-play-state: paused;
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%); /* Moves exactly half the cloned distance */
    }
  }
`;

const CardWrapper = styled.div`
  width: 300px;
  flex-shrink: 0; /* Prevents cards from squishing on small screens */
`;
