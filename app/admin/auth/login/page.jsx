"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "../../../../lib/supabase/client";
import dynamic from "next/dynamic";
import Image from "next/image";
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

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });
  const [showPassword, setShowPassword] = useState(false); // false muna para d mapakita password unless i-click ung button
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 4000);
  };

  useEffect(() => {
    const checkSession = async () => {
      await supabase.auth.getSession();
      setLoading(false);
    };
    checkSession();
  }, [supabase.auth]);

  const getInputValue = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevLoginForm) => ({
      ...prevLoginForm,
      [name]: value,
    }));
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
    const { data: data, error: codeError } = await supabase
      .from("Users")
      .select("reset")
      .eq("email", receivedEmail);

    if (codeError || !data) {
      showToast("Code Not Found", "error");
    } else {
      const targetCode = data[0]?.reset;
      setCode(targetCode);

      const res = await fetch("/api/send-nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_email: receivedEmail, code: targetCode }),
      });

      const result = await res.json();

      if (result.success) {
        showToast("Email has been sent", "success");
      } else {
        showToast("Failed to send email", "error");
      }
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
    // binago ko to para gamitin supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedData.email, // kunin email sa Auth
      password: sanitizedData.password, // kunin password sa Auth
    });

    // email verification check kung verified o hindi
    if (error) {
      if (
        error.message.includes("Email not confirmed") ||
        error.message.includes("Email not verified")
      ) {
        return showToast(
          "Please verify your email before logging in!",
          "error",
        );
      }
      // kung mali email o password
      return showToast("Invalid Credentials", "error");
    }

    // pang check lng ng logged in account
    if (data?.user) {
      console.log("Account: " + data.user.email);
    }

    // check kung admin ung account
    const { data: profile, error: profileError } = await supabase
      .from("Users")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();

    // layas ka na sa admin page kung d ka admin boi
    if (profileError || !profile?.is_admin) {
      await supabase.auth.signOut();
      return showToast("Access Denied: You are not an Admin.", "error");
    }

    // okie login ka na sa dashboard boi
    console.log("Account: " + data.user.email);
    showToast("Login Successful!", "success");
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1500);
  };

  // pang resend ng email verification kung kelangan
  const resendVerification = async () => {
    if (!loginForm.email) {
      return showToast("Please enter your email address first");
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: loginForm.email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/login`,
      },
    });

    if (error) {
      showToast(error.message);
    } else {
      showToast("Verification email resent! Check your inbox.", "success");
    }
  };

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/auth/callback`,
        data: {
          is_admin: true,
        },
      },
    });
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
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 border border-primary-container hero-border-glow rounded-xl overflow-hidden  shadow-2xl animate-fade-in">
          {/* Left Side: Branding/Visual */}
          <div className="relative hidden md:flex flex-col justify-between p-12 bg-black text-white overflow-hidden">
            <div className="relative z-10">
              <h1 className="font-headline font-black text-4xl text-primary-container uppercase italic leading-none mb-4">
                Join the Hunt
              </h1>
              <p className="text-sm font-light uppercase tracking-widest opacity-80">
                The premier destination for elite diecast collectors.
              </p>
            </div>

            <div className="absolute -bottom-10 -right-20 w-[150%] opacity-20 pointer-events-none transform rotate-[-15deg]">
              <Image
                alt="Car Silhouette"
                src="/auth-image.png"
                width={500}
                height={500}
                loading="lazy"
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
              <h2 className="text-2xl text-primary-container font-headline  uppercase italic mb-2">
                LOGIN YOUR ADMIN ACCOUNT
              </h2>
              <p className="text-sm text-white/90 uppercase tracking-widest">
                Enter your credentials to access the inventory
              </p>
            </div>

            <form className="space-y-6" onSubmit={loginAccount}>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-white/90 mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com..."
                  className="w-full bg-input-field dark:border-b dark:border-primary-container rounded-lg px-4 py-3 text-md text-white/90 focus:border-primary-container outline-none transition-colors  tracking-tight"
                  name="email"
                  value={loginForm.email}
                  onChange={getInputValue}
                />
              </div>
              <div>
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
                    className="absolute right-4 top-1/2 -translate-y-3 text-[#A8A8A0] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-xs text-white/90 uppercase tracking-widest text-center">
                  Didn&apos;t receive the email?
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
                  className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors mb-2 border border-gray-300"
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
                <button className="w-full bg-primary-container rounded-lg text-black/90 py-3 px-4  font-headline font-black uppercase tracking-[0.2em] text-sm hover:scale-105  transition-all transform active:scale-[0.98]">
                  LOGIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DynamicForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSubmit={(submittedCode) => {
          console.log("Recieved code: " + submittedCode);
          setCode(submittedCode);
          setIsForgotOpen(false);
          checkCode(submittedCode);
        }}
      />

      <DynamicNewPasswordModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onSubmit={(submittedPassword) => {
          setPassword(submittedPassword);
          setIsNewOpen(false);
          resetPassword(submittedPassword);
        }}
      />
    </div>
  );
}
