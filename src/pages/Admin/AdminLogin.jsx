import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faSpinner,
  faUser,
  faKey,
  faShieldHalved,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import AdminAPI from "../../services/AdminAPI";
import "./AdminLogin.css";

export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    navigate("/"); // Redirect to homepage
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await AdminAPI.login(credentials);

      if (data.success || data.token) {
        onLoginSuccess(data.token);
      } else {
        setError(data.error || "Invalid username or password.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Server connection failed. Please ensure backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-fullscreen">
      {/* Decorative ambient background glows */}
      <div className="login-glow-orb orb-1"></div>
      <div className="login-glow-orb orb-2"></div>

      <div className="admin-login-glass-card">
        {/* Close Button to return Home */}
        <button
          type="button"
          className="login-close-btn"
          onClick={handleClose}
          aria-label="Close and return to homepage"
          title="Return to Home"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="login-header">
          <div className="login-icon-badge">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <h2>Control Center</h2>
          <p>Sign in to manage your portfolio content</p>
        </div>

        {error && <div className="login-error-banner">{error}</div>}

        <form onSubmit={handleLogin} className="login-form-body">
          {/* Username Field */}
          <div className="login-field-group">
            <label htmlFor="username">Username</label>
            <div className="login-input-wrapper">
              <FontAwesomeIcon
                style={{ color: "black" }}
                icon={faUser}
                className="input-icon"
              />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter admin username"
                value={credentials.username}
                onChange={handleChange}
                required
                autoFocus
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="login-field-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <FontAwesomeIcon
                style={{ color: "black" }}
                icon={faKey}
                className="input-icon"
              />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter admin password"
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faLock} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer-text">
          <span>Protected System • Unauthorized Access Prohibited</span>
        </div>
      </div>
    </div>
  );
}
