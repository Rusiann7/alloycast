"use client";

export default function TermsModal({ isOpen, onClose, onAgree }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-surface border border-white/10 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-reveal-up flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-primary-container/10 flex justify-between items-center">
          <h3 className="font-headline font-black uppercase italic tracking-widest text-primary-container">
            Terms of Service
          </h3>
          <button
            onClick={onClose}
            className="text-[#A8A8A0] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Dummy Content */}
        <div className="p-6 overflow-y-auto text-sm text-[#A8A8A0] space-y-4 leading-relaxed font-body">
          <p className="font-bold text-white uppercase italic">
            1. Acceptance of Terms
          </p>
          <p>
            By joining Alloycast, you agree to follow the rules of the hunt.
            This includes respecting fellow collectors and maintaining the
            integrity of our elite diecast community.
          </p>

          <p className="font-bold text-white uppercase italic">
            2. Account Responsibility
          </p>
          <p>
            You are responsible for keeping your vault credentials safe. Any
            actions taken through your account are your responsibility.
          </p>

          <p className="font-bold text-white uppercase italic">
            3. Reservation Policy
          </p>
          <p>
            Elite reservations are subject to availability. Abuse of our
            reservation system may result in account suspension established by
            the Diecast Vault authorities.
          </p>

          <p className="font-bold text-white uppercase italic">
            4. Code of Conduct
          </p>
          <p>
            No spamming, no sniping (unless it's an auction!), and no toxic
            behavior. Keep it professional, collector.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-surface-container-high flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg py-3 text-[10px] font-black uppercase tracking-widest text-white/90 border border-primary-container outline-none hover:bg-primary-container hover:text-black/90 transition-all"
          >
            Close
          </button>
          <button
            onClick={onAgree}
            className="flex-1 rounded-lg py-3 text-[10px] font-black uppercase tracking-widest bg-primary-container text-black/90 hover:bg-secondary-container hover:text-white/90 transition-all"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
