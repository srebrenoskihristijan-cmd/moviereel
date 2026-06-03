import { X } from "lucide-react";
// Reusable popup modal component (Part 4: all popups use this).
export default function Modal({ title, sub, onClose, children, maxWidth = 460 }) {
  return (
    <div className="mr-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mr-modal" style={{ maxWidth }}>
        <button className="mr-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        {title && <h2>{title}</h2>}
        {sub && <div className="sub">{sub}</div>}
        {children}
      </div>
    </div>
  );
}
