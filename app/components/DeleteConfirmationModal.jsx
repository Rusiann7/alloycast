import React from "react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
  itemType = "Item",
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-modal-background rounded-lg p-2  shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-error-container/10 border border-error-container/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-error-container text-2xl">
              warning
            </span>
          </div>
          <div>
            <h4 className="text-2xl text-on-primary font-black font-headline uppercase tracking-wider">
              Delete {itemType}
            </h4>
            <p className="text-md text-font-color mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 bg-secondary-container drop-shadow-lg/30 rounded-lg">
          <p className="text-white/90 text-md leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-primary-container">
              "{itemName}"
            </span>
            ?
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex gap-3 justify-end bg-background">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-secondary-container text-white/90 hover:scale-105  transition-all disabled:opacity-50"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary-container hover:scale-105 text-black/90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
                DELETING...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">
                  delete
                </span>
                DELETE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
