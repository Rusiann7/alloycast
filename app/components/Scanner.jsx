"use client";
import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner({ scannerOpen, scannerClose, onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerOpen) return;

    // barcode
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    //scanning
    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (onScan) onScan(decodedText);
          },
        );
      } catch (err) {
        console.error("Scanner error:", err);
      }
    };

    startScanner();

    //fail
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current.clear())
          .catch((err) => console.error("Failed to stop scanner:", err));
      }
    };
  }, [scannerOpen, onScan]);

  if (!scannerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
      onClick={scannerClose}
    >
      <div
        className="relative w-full max-w-md aspect-square bg-zinc-950 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* scanner camera */}
        <div id="reader" className="w-full h-full [&>video]:object-cover"></div>

        {/* Scanning Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="mt-10 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
            <p className="text-[10px] font-headline font-black uppercase tracking-[0.3em] text-white/70">
              Align Barcode in Frame
            </p>
          </div>
        </div>

        {/* Header/Close */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30">
          <div className="flex items-center gap-2"></div>
          <button
            onClick={scannerClose}
            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/5 active:scale-90"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
