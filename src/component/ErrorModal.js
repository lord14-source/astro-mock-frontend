
import "./ErrorModal.css";

export default function ErrorModal({ message, onClose }) {

  if (!message) return null;

  return (
    <div className="error-overlay">
      <div className="error-modal">
        <h2>⚠️ Error</h2>
        <p>{message}</p>

        <button onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}