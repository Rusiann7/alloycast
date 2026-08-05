"use client";

export default function TermsModal({ isOpen, onClose, onAgree }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-background drop-shadow-lg/30 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-reveal-up flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6  bg-input-field flex justify-between items-center">
          <h3 className="font-headline font-black uppercase italic tracking-widest text-primary-container">
            Terms of Service
          </h3>
          <button
            onClick={onClose}
            className="text-white/90  transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Dummy Content */}
        <div className="p-6 overflow-y-auto text-sm bg-secondary-container text-white/90 space-y-4 leading-relaxed font-body">
          <p className="font-bold  text-primary-container uppercase italic">
            1. Acceptance of Terms
          </p>
          <p>
            By joining AlloyDash, you agree to follow the rules of the hunt.
            This includes respecting fellow collectors and maintaining the
            integrity of our elite diecast community.
          </p>

          <p className="font-bold  text-primary-container uppercase italic">
            2. Account Responsibility
          </p>
          <p>
            You are responsible for keeping your vault credentials safe. Any
            actions taken through your account are your responsibility.
          </p>

          <p className="font-bold text-primary-container uppercase italic">
            3. Order Policy
          </p>
          <ul className="list-disc list-inside ">
            <li>
              For Pickup Orders with Cash/Online Payment. Orders must be paid
              and pickup within 48hrs. Failure to follow withing 48hrs will
              result to Order Failure status.
            </li>
            <li>
              For Door-to-Door Delivery with Online Payment. Orders must be paid
              within 48hrs. Failure to follow withing 48hrs will result to Order
              Failure status and your payment will be refunded by the Admin
            </li>
            <li>
              For Local LBC branch pickup with Cash Payment . Orders must be
              paid within 48hrs. Failure to follow withing 48hrs will result to
              Order Failure status.
            </li>
          </ul>

          <p className="font-bold  text-primary-container uppercase italic">
            4. Code of Conduct
          </p>
          <p>
            No spamming, no sniping unless It&apos;s an auction!, and no toxic
            behavior. Keep it professional, collector.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-input-field flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg py-3 text-xs font-black uppercase tracking-widest text-white/90 border border-primary-container outline-none hover:scale-105 transition-all"
          >
            Close
          </button>
          <button
            onClick={onAgree}
            className="flex-1 rounded-lg py-3 text-xs font-black uppercase tracking-widest bg-primary-container text-black/90 hover:scale-105 transition-all"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
