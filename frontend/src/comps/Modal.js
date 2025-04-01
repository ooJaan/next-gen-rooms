import React, { useEffect } from "react";
import "../css/Modal.css";
import "../css/App.css";

const Modal = ({ content, closed, onClose }) => {
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

    if (closed) return null;

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