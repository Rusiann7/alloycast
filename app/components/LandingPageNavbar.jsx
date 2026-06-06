"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import dynamic from "next/dynamic";
import Image from "next/image";

const DynamicToast = dynamic(() => import("./Toast"));
const DynamicSessionModal = dynamic(() => import("./SessionModal"));

export default function LandingPageNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState(null); // user state to track user logged in
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });
  const supabase = createClient();

  // Auth user listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe(); // cleanup
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 4000);
  };

  // itatago nito ung navbar sa register at login page
  const hideNavbarOn = ["/customer/auth/login", "/customer/auth/register"];

  // If the current path is in our hide list, don't render the navbar
  if (hideNavbarOn.includes(pathname)) return null;

  const navLinks = [
    {
      id: 0,
      label: "Browse Products",
      href: "/customer/product",
    },
  ];

  const showLogoutModal = async () => {
    setShowSessionModal(true);
  };

  const logoutAccount = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      showToast("Goodbye!", "success");
      setShowSessionModal(false);
      // logout sucess
      setUser(null); // manually clear user state for instant UI update
      router.push("/");
    } else {
      console.error("Auth: Error logging out", error.message);
    }
  };
  return (
    <>
      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      {/* Header Navigation */}
      <header className="bg-primary-container fixed top-0 left-0 w-full z-[999]  text-white">
        <div className="mx-auto flex items-center justify-between px-3 lg:px-12 py-4">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="size-10">
                <Image
                  width={100}
                  height={100}
                  src="/logo.jpg"
                  alt="Ethan Marcus Diecast"
                  className="border-white/20 border-1 rounded-lg"
                  loading="lazy"
                />
              </div>
              <h2 className="font-headline text-lg text-black/90 font-bold uppercase tracking-tight hover:cursor-pointer  transition-colors">
                <Link href="/">Ethan Marcus Diecast</Link>
              </h2>
            </div>
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((navLink) => (
                <Link
                  key={navLink.id}
                  className="font-headline text-md text-input-field r font-bold uppercase tracking-tight hover:cursor-pointer transition-colors"
                  href={navLink.href}
                >
                  {navLink.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex lg:hidden items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <span className="material-symbols-outlined text-white transition-all duration-300">
                {navbarOpen ? "close" : "menu"}
              </span>
            </button>

            {!user ? (
              <button className="hidden lg:block btn-clipped bg-secondary-container  text-white/90 hover:scale-105 drop-shadow-lg/30 transition-all text-xs font-black uppercase tracking-widest px-6 h-10">
                <Link href="/customer/auth/login">Log In</Link>
              </button>
            ) : (
              <div className="flex items-center gap-6">
                {/* Link to the user's profile/dashboard */}
                <Link
                  href="/customer/account"
                  className="hidden lg:flex items-center gap-2 text-sm font-black uppercase tracking-widest text-input-field hover:cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    person
                  </span>{" "}
                  Account
                </Link>

                {/* Trigger the logout function */}
                <button
                  onClick={showLogoutModal}
                  className="hidden lg:block text-sm font-black uppercase tracking-widest text-on-primary hover:cursor-pointer transition-colors"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-[110] transition-opacity duration-300 ${navbarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setNavbarOpen(false)}
        ></div>
        <div
          className={`absolute top-0 right-0 h-full w-[300px] bg-secondary-container p-8 transition-transform duration-500 transform ${navbarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-end items-center mb-16">
            <button
              onClick={() => setNavbarOpen(false)}
              className="material-symbols-outlined  text-red hover:rotate-90 transition-transform"
            >
              close
            </button>
          </div>
          <nav className="flex flex-col gap-8">
            {navLinks.map((navLink) => (
              <Link
                key={navLink.id}
                href={navLink.href}
                className="text-2xl font-headline font-black uppercase italic text-white/90 hover:text-primary-container transition-colors tracking-tighter"
                onClick={() => setNavbarOpen(false)}
              >
                {navLink.label}
              </Link>
            ))}
            {!user ? (
              <button className="bg-primary-container text-black/90 text-xs font-black uppercase tracking-widest px-6 h-10 rounded btn-premium">
                <Link
                  href="/customer/auth/login"
                  onClick={() => setNavbarOpen(false)}
                >
                  Log In
                </Link>
              </button>
            ) : (
              <>
                <Link
                  href="/customer/account"
                  className="text-2xl font-headline font-black uppercase italic text-white/90"
                  onClick={() => setNavbarOpen(false)}
                >
                  My Account
                </Link>

                {/* Mobile Logout Link */}
                <button
                  onClick={() => {
                    showLogoutModal();
                    setNavbarOpen(false);
                  }}
                  className="text-left text-2xl font-headline font-black uppercase italic text-white/90 transition-colors tracking-tighter"
                >
                  Log Out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
      <DynamicSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onConfirm={logoutAccount}
      />
    </>
  );
}
