import React, { useEffect } from "react";
import "../css/Modal.css"; // Import CSS for styling

const Modal = ({ content, modalData, onClose }) => {

    // Close modal on "Esc" key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    if (!modalData) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={onClose}>
                    &times;
                </span>
                {content}
            </div>
        </div>
    );
};

export default Modal;