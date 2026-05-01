"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Toast from "../../../components/Toast";
import { createClient } from "../../../../lib/supabase/client";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const router = useRouter();
  const searchParams = useSearchParams(); // for capturing clicked product url and id
  const supabase = createClient();

  // const redirectTo = searchParams.get("redirectTo") || "/customer/dashboard"; // gets the redirect path from capturedCurrentPath in productDetail

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 4000);
  };

  // pangkuha ng input
  const getInputValue = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevLoginForm) => ({
      ...prevLoginForm,
      [name]: value,
    }));
  };

  const inputSanitizerFunction = () => {
    // panglinis ng email input
    const sanitizedForm = {
      ...loginForm,
      email: loginForm.email.trim().toLowerCase(),
    };

    // para icheck ung email format
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // kailangan may symbol na "@"
    if (!emailFormat.test(sanitizedForm.email)) {
      return { isValid: false, message: "Invalid email format!" };
    }

    // kung ok lahat
    return { isValid: true, data: sanitizedForm };
  };

  const loginAccount = async (e) => {
    e.preventDefault();
    const formValidation = inputSanitizerFunction();
    if (!formValidation.isValid) {
      return showToast(formValidation.message);
    }

    const sanitizedData = formValidation.data;
    // gagamit na tayo ng supabase auth para sa login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedData.email, // kukunin email sa supabase Auth
      password: sanitizedData.password, // kukunin password sa supabase Auth
    });

    // pang check kung naverify na email o hindi
    if (error) {
      if (error.message.includes("Email not verified")) {
        return showToast(
          "Please verify your email before logging in!",
          "error",
        );
      }
      // kung mali email o password
      return showToast("Invalid Email or Password", "error");
    }

    if (!error) {
      const redirectTo = searchParams.get("redirectTo"); // kinukuha ung specific productDetail url (if meron)
      const destination = redirectTo || "/customer/account"; // kung meron, balik, kung wla, punta sa account
      showToast("Login Successful", "success");
      setTimeout(() => {
        router.push(destination); // redirects back to clicked productDetail
      }, 1500);
    } else {
      showToast(error.message, "error");
    }
  };

  // pang resend ng email verification
  const resendVerification = async () => {
    if (!loginForm.email) {
      return showToast("Please enter your email address first");
    }

    // isesend nito email verification sa gmail
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: loginForm.email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/customer/auth/login`, // direct url kapag clinick email verification
      },
    });

    // pang check ng email verification resend
    if (error) {
      showToast(error.message);
    } else {
    }
  };

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/customer/auth/callback`,
        data: {
          is_admin: false,
        },
      },
    });

    if (error) {
      showToast(error.message);
    }
  };

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center p-6 radial-brand">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-container-high rounded-xl overflow-hidden border border-white/5 shadow-2xl animate-fade-in">
        {/* Left Side: Branding/Visual */}
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-black/80 text-white overflow-hidden">
          <div className="relative z-10">
            <h1 className="font-headline font-black text-4xl uppercase text-primary-container italic leading-none mb-4">
              Join the Hunt
            </h1>
            <p className="text-sm font-light uppercase tracking-widest opacity-80">
              The premier destination for elite diecast collectors.
            </p>
          </div>

          <div className="absolute -bottom-10 -right-20 w-[150%] opacity-20 pointer-events-none transform rotate-[-15deg]">
            <img
              alt="Car Silhouette"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL-AWm0406EG-1UZke8iuF1oZxcY65Vq6dc_9-A1GnFbAoiFAWnkMBVZgKMgaVRrrRUJYiw4nqzaDQd1xGgpwmcWvsEgj79XUUyMY5S2nZYlyPKfUOAWjiQ526D-dlyERFA5g4vM428anIhTgnebUse3SrzDJ-KFXe1uL4dTXtd2m6zn7W9gdZTxRKoEkXLyJSbUtC_04soQqG8Y9gtrtxozmtOzC2Dn_cxQRGR3D-A3F6oSplCvPXJHKZHEGE26GEuAPJ9owfaUc"
            />
          </div>

          <div className="relative z-10 flex items-center gap-2 text-primary-container">
            <span className="material-symbols-outlined">flare</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Diecast Vault established 2026
            </span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-surface">
          <div className="mb-8">
            <h2 className="text-2xl font-headline text-primary-container uppercase italic mb-2">
              LOGIN YOUR ACCOUNT
            </h2>
            <p className="text-xs text-[#A8A8A0] uppercase tracking-widest">
              To order the product you want
            </p>
          </div>

          <form className="space-y-6" onSubmit={loginAccount}>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-surface-container-highest border-b border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
                name="email"
                value={loginForm.email}
                onChange={getInputValue}
              />
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-highest border-b border-white/10 rounded-lgI px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight pr-12"
                  name="password"
                  value={loginForm.password}
                  onChange={getInputValue}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-3 text-[#A8A8A0] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-md">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>
            <p className="text-[10px] text-[#A8A8A0] uppercase tracking-widest text-center">
              Didn't receive the email?{" "}
              <button
                type="button"
                onClick={resendVerification}
                className="text-primary-container hover:underline italic font-bold uppercase cursor-pointer"
              >
                Resend Link
              </button>
            </p>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors mb-6 border border-gray-300"
              onClick={googleLogin}
            >
              <img
                src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                alt="Google Logo"
                className="w-5 h-5"
              />
              <span className="uppercase text-[10px] tracking-widest font-black">
                Sign in with Google
              </span>
            </button>

            <button className="w-full bg-primary-container rounded-lg text-black/90 py-3 px-4  font-headline font-black uppercase tracking-[0.2em] text-sm hover:bg-secondary-container hover:text-white/90 transition-all transform active:scale-[0.98]">
              LOGIN
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
            <p className="text-[10px] text-[#A8A8A0] uppercase tracking-widest text-center">
              Don't have an account?{" "}
              <Link
                href="/customer/auth/register"
                className="text-primary-container hover:underline italic font-bold"
              >
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
