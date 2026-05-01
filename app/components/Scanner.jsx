"use client";
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Scanner({ scannerOpen, scannerClose }) {
  useEffect(() => {
    if (!scannerOpen) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    function onScanSuccess(decodedText, decodedResult) {
      console.log(`Code matched = ${decodedText}`, decodedResult);
    }

    function onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
    }

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      html5QrcodeScanner.clear().catch((err) => {
        console.error("Failed to clear scanner:", err);
      });
    };
  }, [scannerOpen]);

  if (!scannerOpen) return null;

  const toggleScanner = scannerClose;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={scannerClose}
    >
      <div
        className="relative w-full max-w-[500px] h-[400px] bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div id="reader" width="600px"></div>

        <div className="absolute top-5 px-4 py-2 bg-black/60 backdrop-blur-md text-white text-sm rounded-full z-20">
          Align barcode within the frame
        </div>
        <button
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full z-30 transition-colors"
          onClick={toggleScanner}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="relative w-[250px] h-[250px] border-2 border-white/30 rounded-[20px] shadow-[0_0_0_1000px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center">
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
        </div>
      </div>
    </div>
  );
}
