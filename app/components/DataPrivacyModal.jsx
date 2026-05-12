"use client";

export default function DataPrivacyModal({ isOpen, onClose, onAgree }) {
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
            Data Privacy Notice
          </h3>
          <button
            onClick={onClose}
            className="text-[#A8A8A0] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-sm text-[#A8A8A0] space-y-4 leading-relaxed font-body">
          <p className="text-white font-bold uppercase italic border-b border-white/5 pb-2">
            Data Privacy Act of 2012 (RA 10173)
          </p>
          
          <p>
            In compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines, 
            Alloycast is committed to protecting your personal information and ensuring your privacy.
          </p>

          <p className="font-bold text-white uppercase italic">
            1. Collection of Information
          </p>
          <p>
            We collect personal data such as your name, email address, gender, and date of birth 
            solely for the purpose of account creation, order processing, and providing 
            personalized services within our diecast community.
          </p>

          <p className="font-bold text-white uppercase italic">
            2. Purpose and Use
          </p>
          <p>
            Your information is processed following the principles of transparency, 
            legitimate purpose, and proportionality. We use your data to maintain 
            your collector vault and facilitate elite reservations.
          </p>

          <p className="font-bold text-white uppercase italic">
            3. Data Subject Rights
          </p>
          <p>
            Under RA 10173, you have the right to be informed, to access, to object, 
            to erasure or blocking, to damages, to file a complaint, to rectify, 
            and to data portability.
          </p>

          <p className="font-bold text-white uppercase italic">
            4. Security Measures
          </p>
          <p>
            We implement appropriate organizational, physical, and technical security 
            measures to protect your personal data against unauthorized access, 
            accidental loss, or destruction.
          </p>

          <p className="font-bold text-white uppercase italic">
            5. Consent
          </p>
          <p>
            By clicking "I Agree" and checking the Data Privacy box, you explicitly 
            consent to the collection and processing of your personal data for the 
            stated purposes.
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
