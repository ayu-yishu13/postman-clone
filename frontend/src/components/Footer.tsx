import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bottom-footer">
      <div className="footer-section">
        <div className="footer-item">
          <span>Connect Git</span>
        </div>
        <div className="footer-item">
          <span>Console</span>
        </div>
        <div className="footer-item">
          <span>Terminal</span>
        </div>
      </div>
      <div className="footer-section">
        <div className="footer-item">
          <span>Cloud Agent</span>
        </div>
        <div className="footer-item">
          <span>Globals</span>
        </div>
        <div className="footer-item">
          <span>Vault</span>
        </div>
        <div className="footer-item">
          <span>Tools</span>
        </div>
      </div>
    </footer>
  );
};
