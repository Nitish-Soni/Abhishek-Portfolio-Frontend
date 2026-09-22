import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import About from "../About/About";
import Contact from "../Contact/Contact";
import Footer from "../../components/Footer/Footer";
import { ThemeProvider } from "../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PublicAPI from "../../services/PublicAPI";
import AdminDashboard from "../Admin/AdminDashboard";
import "./Main.css";

function MainContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch essential initial public data together before revealing the page
    const loadInitialData = async () => {
      try {
        await Promise.all([
          PublicAPI.fetchAboutData(),
          PublicAPI.getInquiryTypes(),
        ]);
        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading initial portfolio data:", err);
        if (isMounted) {
          setError(
            err.response?.status
              ? `HTTP ${err.response.status}`
              : err.message || "Failed to establish database link",
          );
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
          gap: "1rem",
        }}
      >
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p style={{ fontFamily: "Merriweather, serif" }}>
          Loading Publication Archive...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="maintenance-wrapper">
        {/* Ambient Glows */}
        <div className="maintenance-glow orb-1"></div>
        <div className="maintenance-glow orb-2"></div>

        <div className="maintenance-glass-card">
          <div className="maintenance-status-badge">
            <span className="status-dot"></span>
            <span>Temporary Maintenance</span>
          </div>

          <h1 className="maintenance-title">Site Down for Upgrades</h1>

          <p className="maintenance-description">
            The portfolio is currently undergoing scheduled updates or temporary
            database maintenance. We will be back online shortly.
          </p>

          {error && (
            <div className="maintenance-error-details">
              <code>Error Code: {error}</code>
            </div>
          )}

          <button
            className="maintenance-retry-btn"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<MainContent />} />

            {/* Admin Portal Route */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
