import React from "react";

interface LoginViewProps {
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  onQuickSignIn: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  onQuickSignIn,
}) => {
  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-logo">Postman API Platform</div>
        <div className="login-title">Sign in to Postman</div>
        
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="name@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" className="login-btn">Sign in</button>

        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "11px", borderTop: "1px solid var(--border-color)", paddingTop: "12px", marginTop: "4px" }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: "100%", padding: "6px", fontSize: "11px", marginTop: "8px" }}
            onClick={onQuickSignIn}
          >
            Quick Sign In (Ayush Kumar Rai)
          </button>
        </div>
      </form>
    </div>
  );
};
