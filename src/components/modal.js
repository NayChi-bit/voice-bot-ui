import React from 'react';

function Modal({ isOpen, onClose }) {
  if (!isOpen) return null;
  alert("is open in modal compo : " + isOpen)

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>X</button>
        <div className="modal-content">
          {/* Modal content goes here */}
          <h2>Hello, this is a modal</h2>
          <p>This is a modal dialog created in Next.js</p>
        </div>
      </div>
    </div>
  );
}

export default Modal;
