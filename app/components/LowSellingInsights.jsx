"use client";

import { useState, useEffect } from "react";

export default function LowSellingInsights({
  isOpen,
  onClose,
  lowProducts = [],
}) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState("");
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const stopSpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleClose = () => {
    stopSpeech();
    onClose();
  };

  const fetchInsights = async () => {
    if (!lowProducts || lowProducts.length === 0) return;
    stopSpeech();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai-low-selling-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lowProducts }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate AI insights.");
      }

      setInsights(data.insights);
    } catch (err) {
      console.error("Error generating insights:", err);
      setError(err.message || "Failed to load AI insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Web Speech API is not supported in your browser.");
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    if (!insights) return;

    // Clean markdown symbols for natural speech playback
    const textToRead = insights
      .replace(/[*#\-_`]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    if (isOpen && !insights && !loading) {
      fetchInsights();
    }
    if (!isOpen) {
      stopSpeech();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="bg-modal-background rounded-xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-primary-container/20 max-h-[90vh] flex flex-col animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container/10 border border-primary-container/30 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-2xl animate-pulse">
                auto_awesome
              </span>
            </div>
            <div>
              <h3 className="font-headline font-black text-xl text-white uppercase italic tracking-tighter">
                AI Sales Optimization Insights
              </h3>
              <p className="text-xs text-white/50 font-headline uppercase tracking-widest">
                Powered by Gemini AI Retail Analyst
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-lg bg-secondary-container hover:bg-white/10 text-white/60 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
          {/* Analyzed Items Tag Section */}
          <div className="bg-secondary-container p-4 rounded-lg border border-white/5">
            <p className="text-[11px] font-headline font-black uppercase tracking-[0.2em] text-primary-container mb-2">
              Analyzed Low-Selling Products ({lowProducts.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {lowProducts.map((prod, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-input-field rounded border border-white/10 text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {prod.name} ({prod.units} orders)
                </span>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 border-2 border-primary-container/40 flex items-center justify-center animate-spin">
                <span className="material-symbols-outlined text-primary-container text-3xl">
                  auto_awesome
                </span>
              </div>
              <div>
                <p className="font-headline font-black text-lg text-white uppercase tracking-wider italic">
                  Analyzing Product Performance...
                </p>
                <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
                  Gemini AI is generating growth strategies for your inventory
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-bold flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* AI Insights Content Output */}
          {insights && !loading && (
            <div className="bg-secondary-container/60 p-5 sm:p-6 rounded-lg border border-white/10 text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-3">
              {insights}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-secondary-container hover:bg-white/10 border border-white/10 text-xs font-headline font-black uppercase tracking-widest text-primary-container flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Regenerate Insights
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSpeech}
              disabled={loading || !insights}
              className={`px-4 py-2.5 rounded-lg border text-xs font-headline font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer ${
                isSpeaking
                  ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                  : "bg-secondary-container hover:bg-white/10 border-white/10 text-white"
              }`}
              title={isSpeaking ? "Stop Voice Playback" : "Read Insights Aloud"}
            >
              <span className="material-symbols-outlined text-sm">
                {isSpeaking ? "volume_off" : "volume_up"}
              </span>
              {isSpeaking ? "Stop Reading" : "Read Aloud"}
            </button>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg bg-primary-container hover:bg-amber-400 text-black font-headline font-black uppercase tracking-widest text-xs transition-all cursor-pointer shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
