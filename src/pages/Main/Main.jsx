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
import Unsubscribe from "../Unsubscribe/Unsubscribe";

// Helper function to force the browser to preload the image asset completely

function MainContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [aboutRes] = await Promise.all([
          PublicAPI.fetchAboutData(),
          PublicAPI.getInquiryTypes(),
        ]);

        if (isMounted) {
          setAboutData(aboutRes);
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
    /* ... existing spinner ... */
  }

  if (error) {
    /* ... existing maintenance screen ... */
  }

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        // 1. Fetch API data first
        const [aboutData] = await Promise.all([
          PublicAPI.fetchAboutData(),
          PublicAPI.getInquiryTypes(),
        ]);

        // 2. Preload profile image if a URL exists in the response
        if (
          aboutData?.imageUrl ||
          aboutData?.profileImage ||
          aboutData?.image
        ) {
          const imageUrl =
            aboutData.imageUrl || aboutData.profileImage || aboutData.image;
          await preloadImage(imageUrl);
        }

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
        <About initialData={aboutData} />
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
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
