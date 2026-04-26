"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import bcrypt from "bcryptjs";
import Toast from "../../../components/Toast";
import TermsModal from "../../../components/TermsModal";
import { createClient } from "../../../../lib/supabase/client";
export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter(); // pang navigate to sa login page kung successfull na login
  // dto muna mastore mga input fields bago mapunta sa Users at Customers Table
  const [accountForm, setAccountForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false); // eye toggle para makita password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // eye toggle para makita confirmPassword
  const [isAgreed, setIsAgreed] = useState(false); // Agreement checkbox state
  const [showTermsModal, setShowTermsModal] = useState(false); // Terms Modal visibility state
  const [toast, setToast] = useState({
    // toast notification (gawa ni AI) hehehe
    visible: false,
    message: "",
    type: "error",
  });

  // Function to show toast (gawa ni AI)
  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  // pangkuha ng input value bawat fields at pangupdate ng accountForm useState
  const getInputValue = (e) => {
    const { name, value } = e.target; // pange extract ng: e.target.value at name="" sa mga inputs
    setAccountForm((prevAccountForm) => ({
      // lumang accountForm (walang value)
      ...prevAccountForm, // kopya ng bagong accountForm (may values)
      [name]: value, // [name] = key sa bawat input fields (name="") para malaman ang value
    }));
  };

  // INPUT SANITIZATION
  const inputSanitizerFunction = () => {
    if (
      !accountForm.firstName ||
      !accountForm.lastName ||
      !accountForm.email ||
      !accountForm.gender ||
      !accountForm.dob ||
      !accountForm.password ||
      !accountForm.confirmPassword
    ) {
      return { isValid: false, message: "Please fill in all fields" };
    }
    // panglinis ng input sa firstname, lastname at email
    const sanitizeForm = {
      ...accountForm, // kopya ng accountForm={} para d magalaw ung original na accountForm
      firstName: accountForm.firstName.trim(),
      lastName: accountForm.lastName.trim(),
      email: accountForm.email.trim().toLowerCase(),
    };

    // pang check ng password length (min = 8)
    if (sanitizeForm.password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters!",
      };
    }

    // pangcheck ng symbols sa password field
    const passwordSymbols = /[!@#$%^&*(),.?":{}|<>]/;
    if (!passwordSymbols.test(sanitizeForm.password)) {
      // kailangan gumamit ng symbols sa password
      return {
        isValid: false,
        message: "Password must contain at least one symbol (!@#$ etc.)",
      };
    }

    // pangkumpara ng password vs confirmPassword
    if (sanitizeForm.password !== sanitizeForm.confirmPassword) {
      return { isValid: false, message: "Passwords do not match!" };
    }

    // kung ok lahat ng fields
    return { isValid: true, data: sanitizeForm };
  };

  // ito ung function para maregister sa Users table muna
  const registerAccount = async (e) => {
    e.preventDefault(); // para maiwasan marefresh ung page kapag nagsubmit

    const formValidation = inputSanitizerFunction(); // call ng inputSanitizerFunction()
    if (!formValidation.isValid) {
      // kung hindi nakapasa sa input sanitization
      return showToast(formValidation.message); // return alert para mag stop ung execution ng buong functions
    }

    const sanitizedData = formValidation.data;

    // pang check if my kaparehas na email nakasatored sa Users Table
    const { data: existingEmail } = await supabase
      .from("Users")
      .select("email") // select email column
      .eq("email", sanitizedData.email) // pang check if may kaparehas nang email
      .maybeSingle(); // pang check kung may kaparehas na email KAHIT ISA

    if (existingEmail) {
      return showToast("This email is already registered");
    }

    // ok so binago ko na ung pag request kay supabase
    // gagamit na ito ng supabase auth at Users Table
    const { data, error } = await supabase.auth.signUp({
      // supabase Auth sign up
      email: sanitizedData.email, // store sa supabase auth at Users Table
      password: sanitizedData.password, // store sa supabase auth at Users Table
      options: {
        data: {
          first_name: sanitizedData.firstName, // store sa Customers Table
          last_name: sanitizedData.lastName, // store sa Customers Table
          gender: sanitizedData.gender, // store sa Customers Table
          dob: sanitizedData.dob, // store sa Customers Table
          is_admin: false, // matik false para Customers
        },
      },
    });

    if (error) {
      showToast(error.message);
    } else {
      showToast(
        "Registration Success! Please check your email to verify your account.",
        "success",
      );
      setTimeout(() => {
        router.push("/customer/auth/login");
      }, 1500);
    }
  };

  const googleSignUp = async () => {
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
    <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center p-6 radial-brand relative overflow-x-hidden">
      {/* Reusable Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      {/* Terms of Service Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={() => {
          setIsAgreed(true);
          setShowTermsModal(false);
        }}
      />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-container-high rounded-xl overflow-hidden border border-white/5 shadow-2xl animate-fade-in">
        {/* Left Side: Branding/Visual */}
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-black/80 text-white overflow-hidden">
          <div className="relative z-10">
            <h1 className="font-headline font-black text-4xl text-primary-container uppercase italic leading-none mb-4">
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
              Diecast Vault established 2024
            </span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-surface">
          <div className="mb-8">
            <h2 className="text-2xl font-headline font-black uppercase italic mb-2">
              CREATE YOUR ACCOUNT
            </h2>
            <p className="text-xs text-[#A8A8A0] uppercase tracking-widest">
              Create an account to order reservations
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
                  className="w-full bg-surface-container-highest border-b border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
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
                  className="w-full bg-surface-container-highest border-b border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
                  name="lastName"
                  value={accountForm.lastName}
                  onChange={getInputValue}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  className="w-full bg-surface-container-highest border-b border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
                  name="gender"
                  value={accountForm.gender}
                  onChange={getInputValue}
                >
                  <option value="" disabled hidden>
                    GENDER
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A8A0] mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  placeholder="DATE OF BIRTH"
                  className="w-full bg-surface-container-highest border-b border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
                  name="dob"
                  value={accountForm.dob}
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
                className="w-full bg-surface-container-highest border-b border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight"
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
                  className="w-full bg-surface-container-highest border-b border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight pr-12"
                  name="password"
                  value={accountForm.password}
                  onChange={getInputValue}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A8A0] hover:text-white transition-colors"
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
                  className="w-full bg-surface-container-highest border-b border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-container outline-none transition-colors  tracking-tight pr-12"
                  name="confirmPassword"
                  value={accountForm.confirmPassword}
                  onChange={getInputValue}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A8A0] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showConfirmPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 ">
              <input
                type="checkbox"
                id="terms"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-4 h-4  accent-primary-container cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-[10px] text-[#A8A8A0] uppercase tracking-widest cursor-pointer select-none"
              >
                I have read and agree to the{" "}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                  className="text-primary-container hover:underline italic font-bold"
                >
                  Terms of Service
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors mb-2 border border-gray-300"
                onClick={googleSignUp}
              >
                <img
                  src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span className="uppercase text-[10px] tracking-widest font-black">
                  Sign up with Google
                </span>
              </button>
              <button
                disabled={!isAgreed}
                className={`w-full py-3 px-4 rounded-lg font-headline font-black uppercase tracking-[0.2em] text-sm transition-all transform active:scale-[0.98] ${
                  isAgreed
                    ? "bg-primary-container text-black/90 hover:bg-secondary-container hover:text-white/90  cursor-pointer"
                    : "bg-surface-container-highest text-[#A8A8A0] opacity-50 cursor-not-allowed"
                }`}
              >
                REGISTER
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
            <p className="text-[10px] text-[#A8A8A0] uppercase tracking-widest text-center">
              Already have an account?{" "}
              <Link
                href="/customer/auth/login"
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
