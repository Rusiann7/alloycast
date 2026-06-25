"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "../../lib/supabase/client";

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [report, setReport] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const supabase = createClient();

  // Scroll to bottom when a new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetchLatestReport();
    }
  }, [isOpen]);

  const fetchLatestReport = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_reports")
        .select("summary")
        .order("report_date", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setReport(data.summary);
        setMessages([{ type: "ai", text: data.summary }]);
      } else {
        setMessages([{ type: "ai", text: "No reports available yet." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([{ type: "ai", text: "Failed to load report." }]);
    }
  };

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support text-to-speech!");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Jarvis will read the VERY LAST message in the chat
    const lastMessage = messages[messages.length - 1]?.text || report;
    const utterance = new SpeechSynthesisUtterance(lastMessage);

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.includes("en-GB") || v.lang.includes("en-US"),
    );
    if (englishVoice) utterance.voice = englishVoice;

    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText("");

    // Add user message to UI
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, reportContext: report }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [...prev, { type: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: "Sorry, I ran into an error connecting to my brain.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Network error. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[101] w-14 h-14 bg-primary-container text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <span className="material-symbols-outlined text-3xl">smart_toy</span>
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chatbox Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-80 sm:w-96 bg-secondary-container border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-input-field p-4 flex justify-between items-center border-b border-white/5 shrink-0">
            <h3 className="font-headline font-black uppercase text-primary-container tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined">smart_toy</span>
              AlloyDash AI
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.type === "user"
                      ? "bg-primary-container text-black rounded-tr-none"
                      : "bg-input-field text-white/90 border border-white/5 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-input-field text-white/50 border border-white/5 p-3 rounded-2xl rounded-tl-none text-sm animate-pulse">
                  AlloyDash AI is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Controls (Optional) */}
          <div className="bg-input-field p-2 border-t border-white/5 flex justify-center shrink-0">
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                isSpeaking
                  ? "bg-red-500/20 text-red-500 border border-red-500/50"
                  : "text-white/50 hover:text-primary-container hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSpeaking ? "stop_circle" : "volume_up"}
              </span>
              {isSpeaking ? "Stop Voice" : "Read Last Message"}
            </button>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={sendMessage}
            className="bg-input-field p-3 border-t border-white/5 flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask AlloyDash AI..."
              className="flex-1 bg-secondary-container text-white text-sm rounded-lg px-4 py-2 border border-white/5 focus:outline-none focus:border-primary-container/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-10 h-10 bg-primary-container text-black rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                send
              </span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
