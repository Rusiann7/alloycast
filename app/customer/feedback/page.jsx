"use client";

import { useState, useEffect } from "react";
import CustomerFooter from "../../components/CustomerFooter";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

const DynamicToast = dynamic(() => import("../../components/Toast"), {
  ssr: false,
});

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // for checking auth users
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const supabase = createClient();
  const router = useRouter();

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 4000);
  };

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

  const insertFeedback = async (rating, comment) => {
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

      if (!comment) {
        showToast("Please add comment");
        return;
      }

      const { error } = await supabase.from("Feedback").insert({
        rating: rating,
        comment: comment,
      });

      if (error) throw error;

      showToast("Feedback has been sent!", "success");
      setRating(1);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      <header className="relative py-28 px-12 lg:px-20 border-b border-white/5 overflow-hidden reveal-up">
        <div className="absolute inset-0 bg-black/60 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-full h-full pointer-events-none animate-drive-in drop-shadow-lg/30">
          <Image
            className="w-full h-full object-cover"
            src="/porsche-grayscale.jpg"
            alt="Hero BG"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 85vw"
          />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto">
          <h1 className="font-headline font-black text-6xl lg:text-[140px] tracking-tighter uppercase leading-[0.8] mb-8 italic">
            <span className="text-primary-container">FEEDBACK</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="text-primary-container text-sm font-black tracking-[0.4em] uppercase">
              We appreciate your responses!
            </span>
          </div>
        </div>
      </header>

      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      {/* Main Feedback View */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-[800px] w-full mx-auto p-6 lg:p-12 gap-10 pt-12 lg:pt-20 mb-20">
        <div className="w-full bg-secondary-container backdrop-blur-xl p-8 lg:p-12 rounded-lg border border-white/5 reveal-up shadow-lg/30 carbon-noise">
          <div className="text-center mb-10">
            <h2 className="font-headline text-2xl lg:text-3xl text-primary-container font-black uppercase tracking-widest italic mb-2">
              Rate Your Experience
            </h2>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-white/90">
              Help us improve our service
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`material-symbols-outlined text-5xl sm:text-6xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                    rating >= star
                      ? "text-primary-container [font-variation-settings:'FILL'_1] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                      : "text-white/60 hover:text-primary-container/50 [font-variation-settings:'FILL'_0]"
                  }`}
                >
                  star
                </button>
              ))}
            </div>

            <div className="w-full space-y-4 mt-4">
              <label className="block font-headline font-black text-sm uppercase tracking-[0.3em] text-primary-container ml-1">
                Provide Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the order reservation process..."
                className="w-full bg-input-field border-b-2 border-transparent focus:border-primary-container py-6 px-6 rounded-lg text-md text-white/90 font-headline tracking-widest placeholder:text-white/40 focus:outline-none transition-all min-h-[180px] resize-none font-bold"
              />
            </div>

            <button
              className="w-full py-5 mt-6 bg-primary-container drop-shadow-lg/30 rounded-lg font-headline font-black text-sm text-black uppercase tracking-[0.3em] hover:scale-105 transition-all active:scale-[0.98]"
              onClick={() => insertFeedback(rating, comment)}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <CustomerFooter />

      <style jsx global>{`
        .reveal-up {
          animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes reveal-up {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .carbon-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}

const FilterSection = ({ title, children }) => (
  <div className="space-y-6">
    <h3 className="font-headline text-sm font-black uppercase tracking-[0.4em] text-primary-container ">
      {title}
    </h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const FilterCheckbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-4 cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked} // Changed from defaultChecked
        onChange={onChange} // Added the onChange handler
        className="appearance-none size-5 border-2 border-primary-container rounded-md checked:bg-primary-container checked:border-primary-container transition-all"
      />
      {/* 
         IMPORTANT: Use 'checked' (not peer-checked) 
         to show the checkmark icon manually based on state 
      */}
      {checked && (
        <span className="material-symbols-outlined absolute inset-0 text-[14px]  text-black flex items-center justify-center pointer-events-none">
          check
        </span>
      )}
    </div>
    <span
      className={`font-headline text-sm font-black uppercase tracking-widest transition-colors ${checked ? "text-white" : "text-font-color"} group-hover:text-white`}
    >
      {label}
    </span>
  </label>
);
