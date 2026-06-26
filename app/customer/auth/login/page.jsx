"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "../../../../lib/supabase/client";
import dynamic from "next/dynamic";
import { AuthFormSkeleton } from "../../../components/Skeleton";

const DynamicToast = dynamic(() => import("../../../components/Toast"));
const DynamicForgotPasswordModal = dynamic(
  () => import("../../../components/ForgotPasswordModal"),
  { ssr: false },
);
const DynamicNewPasswordModal = dynamic(
  () => import("../../../components/NewPasswordModal"),
  { ssr: false },
);

function LoginContent() {
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
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams(); // for capturing clicked product url and id
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      await supabase.auth.getSession();
      setLoading(false);
    };
    checkSession();
  }, [supabase.auth]);

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
      return showToast("Invalid email format!", "error");
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
    const { error } = await supabase.auth.signInWithPassword({
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
      const id = setTimeout(() => {
        if (typeof window !== "undefined" && router && router.push) {
          router.push(destination); // redirects back to clicked productDetail
        }
      }, 1500);
      timeoutRef.current = id;
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

    if (error) throw error;
  };

  //check if the email exists on the DB
  const checkEmail = async () => {
    try {
      const targetEmail = loginForm.email.trim().toLowerCase();
      setEmail(targetEmail);
      console.log("Check email: " + targetEmail);

      const { count: checkCount, error: checkError } = await supabase
        .from("Users")
        .select("*", { count: "exact", head: true })
        .eq("email", targetEmail);

      if (checkError || !checkCount) {
        showToast("Email Not Found", "error");
      } else {
        sendEmail(targetEmail);
        setIsForgotOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendEmail = async (receivedEmail) => {
    try {
      const newCode = Math.floor(10000 + Math.random() * 90000).toString();

      const { error: codeError } = await supabase
        .from("Users")
        .update({ reset: newCode })
        .eq("email", receivedEmail);

      if (codeError) {
        showToast("Failed to generate code", "error");
      } else {
        const res = await fetch("/api/send-nodes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to_email: receivedEmail, code: newCode }),
        });

        const result = await res.json();

        if (result.success) {
          showToast("Email has been sent", "success");
        } else {
          showToast("Failed to send email", "error");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //check if the code sent matches the DB
  const checkCode = async (submittedCode) => {
    try {
      const { count, error } = await supabase
        .from("Users")
        .select("*", { count: "exact", head: true })
        .eq("reset", submittedCode)
        .eq("email", email);

      if (error || !count) {
        showToast("Invalid Code", "error");
      } else {
        setIsNewOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //reset password call to the api
  const resetPassword = async (submittedPassword) => {
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: submittedPassword }),
      });

      const result = await res.json();

      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast("Password reset successfully!", "success");
        changeCode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //change the code to a new one
  const changeCode = async () => {
    try {
      const newCode = Math.floor(10000 + Math.random() * 90000).toString();

      const { error } = await supabase
        .from("Users")
        .update({ reset: newCode })
        .eq("email", email);

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center p-6 radial-brand">
      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      {loading ? (
        <div className="w-full max-w-4xl">
          <AuthFormSkeleton />
        </div>
      ) : (
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 border border-primary-container hero-border-glow bg-surface-container-high rounded-lg  overflow-hidden  shadow-lg/30 animate-fade-in">
          {/* Left Side: Branding/Visual */}
          <div className="relative hidden md:flex flex-col justify-between  p-12 bg-black text-white overflow-hidden">
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
          <div className="p-8 md:p-12 flex flex-col justify-center bg-secondary-container">
            <div className="mb-8">
              <h2 className="text-2xl font-headline text-primary-container uppercase italic mb-2">
                LOGIN YOUR ACCOUNT
              </h2>
              <p className="text-sm text-white/90 uppercase tracking-widest">
                To order the product you want
              </p>
            </div>

            <form className="space-y-6" onSubmit={loginAccount}>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-white/90 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="hello@gmail.com..."
                  className="w-full bg-input-field dark:border-b dark:border-primary-container rounded-lg px-4 py-3 text-md text-white/90 focus:border-primary-container outline-none transition-colors  tracking-tight"
                  name="email"
                  value={loginForm.email}
                  onChange={getInputValue}
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-black uppercase tracking-widest text-white/90 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-input-field dark:border-b dark:border-primary-container  rounded-lg px-4 py-3 text-md text-white/90 focus:border-primary-container outline-none transition-colors  tracking-tight pr-12"
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
              <p className="text-xs text-white/90 uppercase tracking-widest text-center">
                Didn&apos;t receive the email?{" "}
                <button
                  type="button"
                  onClick={resendVerification}
                  className="text-primary-container hover:underline italic font-bold uppercase cursor-pointer"
                >
                  Resend Link
                </button>
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => checkEmail()}
                  className=" text-blue-400   hover:underline text-xs drop-shadow-lg/30 italic font-bold uppercase cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 shadow-lg/30  bg-white hover:scale-105 transition-all text-black font-bold py-3 px-4 rounded-lg  mb-6 border border-gray-300"
                onClick={googleLogin}
              >
                <Image
                  src="/google-icon.png"
                  alt="Google Logo"
                  width={24}
                  height={24}
                />
                <span className="uppercase text-xs tracking-widest font-black">
                  Sign in with Google
                </span>
              </button>

              <button className="w-full bg-primary-container shadow-lg/30 rounded-lg text-black/90 py-3 px-4  font-headline font-black uppercase tracking-[0.2em] text-sm hover:scale-105  transition-all transform active:scale-[0.98]">
                LOGIN
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
              <p className="text-xs text-white/90 uppercase tracking-widest text-center">
                Don&apos;t have an account?{" "}
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
      )}
      <DynamicForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSubmit={(code) => {
          setIsForgotOpen(false);
          checkCode(code);
        }}
      />

      <DynamicNewPasswordModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onSubmit={(password) => {
          setIsNewOpen(false);
          resetPassword(password);
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
