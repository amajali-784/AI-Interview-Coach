import React, { useState } from 'react';
import './DataPreviewPopup.css'; // Optional, for styling the popup

const DataPreviewPopup = ({ data, onClose, onConfirm }) => {
  const [confirmed, setConfirmed] = useState(false);

  // Handle confirmation
  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm(data); // Call the onConfirm function passed as a prop to handle the data submission
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3 className="popup-title">Review Your Parsed Data</h3>
        <div className="popup-content">
          <ul className="popup-list">
            {Object.entries(data).map(([key, value]) => (
              <li key={key} className="popup-item">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> 
                {Array.isArray(value) ? (value.length ? value.join(', ') : "No data") : (value || "Not Provided")}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="popup-actions">
          {!confirmed ? (
            <>
              <button className="popup-btn confirm-btn" onClick={handleConfirm}>Confirm and Save</button>
              <button className="popup-btn close-btn" onClick={onClose}>Close</button>
            </>
          ) : (
            <button className="popup-btn confirmed-btn" disabled>Data Confirmed</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPreviewPopup;
