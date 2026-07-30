import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  box: {
    background: "#fff",
    padding: "24px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "90%",
  },
  gotItBtn: {
    marginTop: "16px",
  },
};

function Modal({ isOpen, onClose, children }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div style={styles.overlay}>
      <div style={styles.box} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {children}
        <button ref={closeButtonRef} onClick={onClose} style={styles.gotItBtn}>
          Got it
        </button>
      </div>
    </div>,
    document.body
  );
}

export default Modal;