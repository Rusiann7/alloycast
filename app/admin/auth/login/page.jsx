"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { reusableSupabase } from "../../../../lib/supabaseClient";
import bcrypt from "bcryptjs";
import Toast from "../../../components/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });
  const [showPassword, setShowPassword] = useState(false); // false muna para d mapakita password unless i-click ung button

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 4000);
  };

  const getInputValue = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevLoginForm) => ({
      ...prevLoginForm,
      [name]: value,
    }));
  };

  const inputSanitizerFunction = () => {
    const sanitizedForm = {
      ...loginForm,
      email: loginForm.email.trim().toLowerCase(),
    };

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(sanitizedForm.email)) {
      return { isValid: false, message: "Invalid email format!" };
    }

    return { isValid: true, data: sanitizedForm };
  };

  const loginAccount = async (e) => {
    e.preventDefault();
    const formValidation = inputSanitizerFunction();
    if (!formValidation.isValid) {
      return showToast(formValidation.message);
    }

    const sanitizedData = formValidation.data;
    const { data: accountData } = await reusableSupabase
      .from("Users")
      .select("*")
      .eq("email", sanitizedData.email)
      .eq("is_admin", true)
      .single();

    const passwordMatch = await bcrypt.compare(
      sanitizedData.password,
      accountData.password,
    );

    if (passwordMatch) {
      showToast("Login Successful!", "success");
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } else {
      showToast("Invalid Credentials");
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
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-primary-container text-white overflow-hidden">
          <div className="relative z-10">
            <h1 className="font-headline font-black text-4xl uppercase italic leading-none mb-4">
              Join the <br /> Hunt.
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

          <div className="relative z-10 flex items-center gap-2">
            <span className="material-symbols-outlined">flare</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Diecast Vault established 2026
            </span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-surface">
          <div className="mb-8">
            <h2 className="text-2xl font-headline font-black uppercase italic mb-2">
              LOGIN YOUR ADMIN ACCOUNT
            </h2>
            <p className="text-xs text-[#A8A8A0] uppercase tracking-widest">
              Enter your credentials to access the inventory
            </p>
          </div>

          <form className="space-y-6" onSubmit={loginAccount}>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-surface-container-highest border-b border-white/10 px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
                name="email"
                value={loginForm.email}
                onChange={getInputValue}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-highest border-b border-white/10 px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight pr-12"
                  name="password"
                  value={loginForm.password}
                  onChange={getInputValue}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-3 text-[#A8A8A0] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>
            <button className="w-full bg-primary-container text-white py-4 font-headline font-black uppercase tracking-[0.2em] text-sm hover:bg-secondary-container hover:text-black transition-all transform active:scale-[0.98]">
              LOGIN
            </button>
          </form>
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
            <p className="text-[10px] text-[#A8A8A0] uppercase tracking-widest text-center">
              Add Admin User?{" "}
              <Link
                href="/admin/auth/register"
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
