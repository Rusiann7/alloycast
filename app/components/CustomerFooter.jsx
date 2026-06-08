"use client";

import Link from "next/link";
import { useState } from "react";

const CustomerFooter = () => {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (type, e) => {
    e.preventDefault();
    if (type === "About") {
      setModalContent({
        title: "About Us",
        text: "Ethan Marcus Diecast is a business that sells limited diecast products from famous brands (mainly hot wheels) that collectors have a hard time to find.",
      });
    } else if (type === "Selling") {
      setModalContent({
        title: "What We Sell",
        text: "They sell 1/64 diecast scales from Hot Wheels, AutoWorld, Nascar, and other famous brands that targets collectors Olongapo City.",
      });
    }
  };

  const closeModal = () => setModalContent(null);

  return (
    <footer className="bg-background py-16 border-t border-primary-container hero-border-glow relative">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-[300px]">
          <div className="flex items-center gap-3 text-font-color mb-6">
            <div className="size-6 text-primary-container">
              <img src="/logo.jpg" alt="Ethan Marcus Diecast" />
            </div>
            <h2 className="font-headline text-xl text-font-color  font-bold uppercase tracking-tight">
              Ethan Marcus Diecast
            </h2>
          </div>
          <p className="text-md font-light text-font-color leading-relaxed">
            The premier destination for elite diecast collectors. Machined
            precision, industrial curation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
          <div>
            <h5 className="text-sm font-black uppercase tracking-widest mb-6 text-font-color ">
              Business
            </h5>
            <ul className="space-y-4 text-md text-">
              {[
                { name: "About", path: "#", isModal: true },
                { name: "Selling", path: "#", isModal: true },
                {
                  name: "Feedback",
                  path: "/customer/feedback",
                  isModal: false,
                },
              ].map((item) => (
                <li key={item.name}>
                  {item.isModal ? (
                    <a
                      href={item.path}
                      onClick={(e) => openModal(item.name, e)}
                      className="hover:text-primary-container transition-colors cursor-pointer"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.path}
                      className="hover:text-primary-container transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-secondary-container flex flex-col md:flex-row justify-between text-xs font-bold uppercase tracking-widest  gap-4">
        <p className="text-font-color ">
          © 2026 Ethan Marcus Diecast. Authorized Partner of Premium Diecast
          Brands.
        </p>
        <div className="flex gap-6 text-font-color">
          <p>Developed by: Team Progidevs</p>
        </div>
      </div>

      {/* Modal Overlay */}
      {modalContent && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-secondary-container border border-white/10 rounded-lg p-8 max-w-md w-full relative shadow-2xl reveal-up">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/90 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline text-2xl font-black uppercase tracking-widest text-primary-container mb-4 italic">
              {modalContent.title}
            </h3>
            <p className="text-white/90 text-lg leading-relaxed font-light">
              {modalContent.text}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default CustomerFooter;
