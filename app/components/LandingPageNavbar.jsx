"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import Toast from "./Toast";

export default function LandingPageNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState(null); // user state to track user logged in
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
    // { id: 1, label: "New Arrivals", href: "/customer/new-arrivals" },
    // { id: 2, label: "Pre-Orders", href: "/customer/pre-orders" },
  ];

  const logoutAccount = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // logout sucess
      showToast("Goodbye!", "success");
      setUser(null); // manually clear user state for instant UI update
      router.push("/");
    } else {
      console.error("Auth: Error logging out", error.message);
    }
  };
  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-1 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto flex items-center justify-between px-6 lg:px-12 py-4">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 text-white">
              <div className="size-6 text-primary-container">
                <img
                  src="https://scontent.fcrk1-3.fna.fbcdn.net/v/t39.30808-6/644340223_122213082470530419_6615498980518078861_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeEgG4siFoRLWVvtPSEqyZ6C6XgpYHoEoUnpeClgegShSSNn7gW48rNushLosBNvbMtV9T4xvqZNtjSpRd91-iCk&_nc_ohc=rw7XoySkXqEQ7kNvwFojGGX&_nc_oc=AdoC_YfDtQU02H42WKNg7O8T3Qg2mxDYgGPQH7FvU0ARSLe-raddwJhKIg0A4BBXWps&_nc_zt=23&_nc_ht=scontent.fcrk1-3.fna&_nc_gid=Fs9oXNHCX0hKFD6MIjEyOQ&oh=00_Af0UWeeul3blDoNzL_aGqyzpaoZsvj2P9YLoPznYagzRlA&oe=69F0CEC0"
                  alt="Ethan Marcus Diecast"
                />
              </div>
              <h2 className="font-headline text-lg font-bold uppercase tracking-tight hover:cursor-pointer">
                <Link href="/">Ethan Marcus Diecast</Link>
              </h2>
            </div>
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((navLink) => (
                <Link
                  key={navLink.id}
                  className="text-xs uppercase tracking-widest font-bold hover:text-primary-container transition-colors"
                  href={navLink.href}
                >
                  {navLink.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex lg:hidden items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors"
              onClick={() => setNavbarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            {!user ? (
              <button className="hidden lg:block bg-primary-container text-black/60 text-xs font-black uppercase tracking-widest px-6 h-10 rounded btn-premium">
                <Link href="/customer/auth/login">Log In</Link>
              </button>
            ) : (
              <div className="flex items-center gap-6">
                {/* Link to the user's profile/dashboard */}
                <Link
                  href="/customer/account"
                  className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">
                    person
                  </span>{" "}
                  Account
                </Link>

                {/* Trigger the logout function */}
                <button
                  onClick={logoutAccount}
                  className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-primary-container hover:text-white transition-colors"
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
          className={`absolute top-0 right-0 h-full w-[300px] bg-surface-container-low border-l border-white/5 p-8 transition-transform duration-500 transform ${navbarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-container">
              Vault Access
            </span>
            <button
              onClick={() => setNavbarOpen(false)}
              className="material-symbols-outlined text-white hover:rotate-90 transition-transform"
            >
              close
            </button>
          </div>
          <nav className="flex flex-col gap-8">
            {navLinks.map((navLink) => (
              <Link
                key={navLink.id}
                href={navLink.href}
                className="text-2xl font-headline font-black uppercase italic hover:text-primary-container transition-colors tracking-tighter"
                onClick={() => setNavbarOpen(false)}
              >
                {navLink.label}
              </Link>
            ))}
            {!user ? (
              <button className="bg-primary-container text-black text-xs font-black uppercase tracking-widest px-6 h-10 rounded btn-premium">
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
                  className="text-2xl font-headline font-black uppercase italic text-primary-container"
                  onClick={() => setNavbarOpen(false)}
                >
                  My Account
                </Link>

                {/* Mobile Logout Link */}
                <button
                  onClick={() => {
                    handleLogout();
                    setNavbarOpen(false);
                  }}
                  className="text-left text-2xl font-headline font-black uppercase italic text-on-surface hover:text-primary-container transition-colors tracking-tighter"
                >
                  Log Out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
