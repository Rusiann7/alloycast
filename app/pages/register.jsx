import React, { useState } from "react";

const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  const containerStyle = {
    backgroundColor: "#131313",
    fontFamily: "'Inter', sans-serif",
    color: "#e5e2e1",
  };

  const headlineStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontStyle: "italic",
    letterSpacing: "0.05em",
  };

  return (
    <div
      style={containerStyle}
      className="min-h-screen flex flex-col items-center justify-between p-8 overflow-hidden relative selection:bg-red-600 selection:text-white"
    >
      {/* Import Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1c1b1b;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c8102e;
            border-radius: 2px;
          }
        `}
      </style>

      {/* Main Content */}
      <div className="w-full max-w-xl flex flex-col items-center mt-20 z-10">
        <header className="text-center mb-12">
          <h1
            style={headlineStyle}
            className="text-4xl md:text-5xl font-bold text-[#c8102e] mb-2 uppercase tracking-tighter"
          >
            Ethan Marcus Diecast
          </h1>
          <p
            style={headlineStyle}
            className="text-[10px] tracking-[0.4em] text-gray-400 font-medium uppercase"
          >
            Precision Engineered Reservations
          </p>
        </header>

        {/* Auth Card */}
        <div className="w-full bg-[#1c1b1b] rounded-t-sm overflow-hidden border border-white/5 shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-5 text-xs font-bold tracking-widest transition-all duration-300 relative ${
                activeTab === "login"
                  ? "text-[#c8102e] bg-[#2a2a2a]"
                  : "text-gray-500 hover:text-gray-300 bg-transparent"
              }`}
            >
              LOGIN
              {activeTab === "login" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c8102e]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-5 text-xs font-bold tracking-widest transition-all duration-300 relative ${
                activeTab === "register"
                  ? "text-[#c8102e] bg-[#2a2a2a]"
                  : "text-gray-500 hover:text-gray-300 bg-transparent"
              }`}
            >
              REGISTER
              {activeTab === "register" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c8102e]"></div>
              )}
            </button>
          </div>

          {/* Form */}
          <div className="p-10 pt-12 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">
                Collector Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-500 group-focus-within:text-[#c8102e] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="block w-full pl-11 pr-4 py-4 bg-[#2a2a2a] border-none rounded-sm text-sm placeholder-gray-600 focus:ring-1 focus:ring-[#c8102e] transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">
                  Access Key
                </label>
                <button className="text-[9px] font-bold tracking-wider text-[#c8102e] hover:text-red-400 uppercase transition-colors">
                  Forgot Key?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-500 group-focus-within:text-[#c8102e] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-4 bg-[#2a2a2a] border-none rounded-sm text-sm placeholder-gray-600 focus:ring-1 focus:ring-[#c8102e] transition-all outline-none"
                />
              </div>
            </div>

            <button className="w-full py-5 bg-[#c8102e] hover:bg-[#a60d26] text-white text-xs font-bold tracking-[0.2em] rounded-sm transition-all duration-300 flex items-center justify-center space-x-2 group active:scale-[0.98]">
              <span>INITIALIZE ACCESS</span>
              <svg
                className="w-3 h-3 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="bg-[#131313]/50 py-6 text-center border-t border-white/5">
            <p className="text-[9px] text-gray-600 font-medium tracking-[0.1em] px-8">
              BY ENTERING, YOU AGREE TO THE COLLECTOR'S TERMS OF SERVICE.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <button className="mt-8 flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-gray-500 hover:text-white transition-colors group uppercase">
          <svg
            className="w-3 h-3 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Return to Showroom</span>
        </button>
      </div>

      {/* Footer Info */}
      <footer className="w-full flex flex-col space-y-8 z-10 pt-10">
        <div className="flex justify-between items-center w-full">
          <div className="bg-[#ffdb3c] text-black text-[9px] font-bold px-3 py-1 rounded-sm flex items-center space-x-2 animate-pulse">
            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
            <span className="tracking-widest">SYSTEM SECURED: SHA-256</span>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[9px] text-gray-600 font-bold tracking-widest">
              EMD-CORE-V2.0
            </p>
            <p className="text-[8px] text-gray-700 font-bold tracking-[0.2em]">
              MINT_CONDITION_AUTHENTICATED
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 space-y-4 md:space-y-0">
          <p className="text-[9px] text-gray-600 font-medium tracking-wider">
            © 2024 ETHAN MARCUS DIECAST. ENGINEERED FOR COLLECTORS.
          </p>
          <div className="flex space-x-6">
            <button className="text-[9px] text-gray-500 hover:text-white transition-colors tracking-widest uppercase">
              Privacy Policy
            </button>
            <button className="text-[9px] text-gray-500 hover:text-white transition-colors tracking-widest uppercase">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {/* Large Ghost Text */}
      <h2
        style={{ ...headlineStyle, opacity: 0.03 }}
        className="absolute bottom-[-20px] right-[-40px] text-[15rem] font-bold select-none pointer-events-none uppercase italic"
      >
        Precision
      </h2>
    </div>
  );
};

export default RegisterPage;
