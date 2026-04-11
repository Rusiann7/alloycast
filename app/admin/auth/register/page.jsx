"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { reusableSupabase } from "../../../../lib/supabaseClient";
import Toast from "../../../components/Toast";

export default function RegisterAdminPage() {
  const router = useRouter();
  const [accountForm, setAccountForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const getInputValue = (e) => {
    const { name, value } = e.target;
    setAccountForm((prevAccountForm) => ({
      ...prevAccountForm,
      [name]: value,
    }));
  };

  const inputSanitizerFunction = () => {
    if (
      !accountForm.firstName ||
      !accountForm.lastName ||
      !accountForm.email ||
      !accountForm.password ||
      !accountForm.confirmPassword
    ) {
      return { isValid: false, message: "Please fill in all fields" };
    }
    const sanitizeForm = {
      ...accountForm,
      firstName: accountForm.firstName.trim(),
      lastName: accountForm.lastName.trim(),
      email: accountForm.email.trim().toLowerCase(),
    };

    if (sanitizeForm.password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters!",
      };
    }

    const passwordSymbols = /[!@#$%^&*(),.?":{}|<>]/;
    if (!passwordSymbols.test(sanitizeForm.password)) {
      return {
        isValid: false,
        message: "Password must contain at least one symbol (!@#$ etc.)",
      };
    }

    if (sanitizeForm.password !== sanitizeForm.confirmPassword) {
      return { isValid: false, message: "Passwords do not match!" };
    }

    return { isValid: true, data: sanitizeForm };
  };

  // d ko na iexplain to, same lng cla sa registerAccount ni Customer with Auth
  const registerAccount = async (e) => {
    e.preventDefault();
    const formValidation = inputSanitizerFunction();
    if (!formValidation.isValid) {
      return showToast(formValidation.message);
    }

    setIsLoading(true);
    const sanitizedData = formValidation.data;

    const { data: existingEmail } = await reusableSupabase
      .from("Users")
      .select("email")
      .eq("email", sanitizedData.email)
      .maybeSingle();

    if (existingEmail) {
      setIsLoading(false);
      return showToast("This email is already registered");
    }

    const { data, error } = await reusableSupabase.auth.signUp({
      email: sanitizedData.email,
      password: sanitizedData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/login`,
        data: {
          first_name: sanitizedData.firstName,
          last_name: sanitizedData.lastName,
          is_admin: true,
        },
      },
    });

    setIsLoading(false);
    if (error) {
      showToast(error.message);
    } else {
      showToast(
        "Admin Registration Success! Please verify your email.",
        "success",
      );
      setTimeout(() => {
        router.push("/admin/auth/login");
      }, 1500);
    }
  };

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center p-6 radial-brand relative overflow-x-hidden">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-container-high rounded-xl overflow-hidden border border-white/5 shadow-2xl animate-fade-in">
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-primary-container text-white overflow-hidden">
          <div className="relative z-10">
            <h1 className="font-headline font-black text-4xl uppercase italic leading-none mb-4">
              Manage the <br /> Hunt.
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

        <div className="p-8 md:p-12 flex flex-col justify-center bg-surface">
          <div className="mb-8">
            <h2 className="text-2xl font-headline font-black uppercase italic mb-2">
              CREATE YOUR ACCOUNT
            </h2>
            <p className="text-xs text-[#A8A8A0] uppercase tracking-widest">
              Create an account to manage business
            </p>
          </div>

          <form className="space-y-6" onSubmit={registerAccount}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="FIRST NAME"
                  className="w-full bg-surface-container-highest border-b border-white/10 px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
                  name="firstName"
                  value={accountForm.firstName}
                  onChange={getInputValue}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="LAST NAME"
                  className="w-full bg-surface-container-highest border-b border-white/10 px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
                  name="lastName"
                  value={accountForm.lastName}
                  onChange={getInputValue}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-surface-container-highest border-b border-white/10 px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
                name="email"
                value={accountForm.email}
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
                  value={accountForm.password}
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

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-highest border-b border-white/10 px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight pr-12"
                  name="confirmPassword"
                  value={accountForm.confirmPassword}
                  onChange={getInputValue}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-3 text-[#A8A8A0] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showConfirmPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                disabled={isLoading}
                className={`w-full py-4 font-headline font-black uppercase tracking-[0.2em] text-sm transition-all transform active:scale-[0.98] ${
                  isLoading
                    ? "bg-surface-container-highest text-[#A8A8A0] opacity-50 cursor-not-allowed"
                    : "bg-primary-container text-white hover:bg-secondary-container hover:text-black cursor-pointer"
                }`}
              >
                {isLoading ? "PROCCESSING..." : "REGISTER ADMIN"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
            <p className="text-[10px] text-[#A8A8A0] uppercase tracking-widest text-center">
              Already have an admin account?{" "}
              <Link
                href="/admin/auth/login"
                className="text-primary-container hover:underline italic font-bold"
              >
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
