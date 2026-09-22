import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSignOutAlt,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faShieldHalved,
  faBookOpen,
  faFeather,
  faUserGear,
  faEnvelopeOpenText,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import AdminLogin from "./AdminLogin";
import AdminAPI from "../../services/AdminAPI";
import "./AdminDashboard.css";
import AdminContact from "../../Components/Admin/AdminContact";
import AboutAdmin from "../../Components/Admin/AboutAdmin";
import AdminSubscribers from "../../Components/Admin/AdminSubscriber";

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const accordionVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
  },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(
    localStorage.getItem("adminToken") || null,
  );
  const [activeEditSection, setActiveEditSection] = useState(null); // 'about', 'writing', 'books', 'contact', 'subscribers'
  const [bannerMessage, setBannerMessage] = useState(null);

  // Auto-hide success banner after 5 seconds
  useEffect(() => {
    if (bannerMessage) {
      const timer = setTimeout(() => setBannerMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [bannerMessage]);

  const handleLogout = () => {
    AdminAPI.logout();
    setToken(null);
    setActiveEditSection(null);
    navigate("/"); // Redirect to homepage
  };

  const handleSaveSuccess = (sectionTitle) => {
    setBannerMessage(
      `The "${sectionTitle}" section was modified successfully.`,
    );
    setActiveEditSection(null); // Collapse editor upon successful save
  };

  // Render Gatekeeper Modal if not authenticated
  if (!token) {
    return <AdminLogin onLoginSuccess={(newToken) => setToken(newToken)} />;
  }

  return (
    <div className="dash-fullscreen">
      {/* Decorative ambient background glows */}
      <div className="dash-glow-orb orb-1"></div>
      <div className="dash-glow-orb orb-2"></div>

      {/* Glass Navigation Bar */}
      <motion.header
        className="dash-topbar-glass"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="dash-brand-badge">
          <div className="dash-brand-icon">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <div className="dash-brand-text">
            <span>Portfolio Control Center</span>
            <small>Administrator Session</small>
          </div>
        </div>

        <motion.button
          onClick={handleLogout}
          className="dash-logout-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </motion.button>
      </motion.header>

      {/* Main Container */}
      <main className="dash-main-container">
        {/* Animated Banner Alert */}
        <AnimatePresence>
          {bannerMessage && (
            <motion.div
              className="dash-notification-banner"
              initial={{ opacity: 0, y: -15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -15, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="banner-icon" />
              <span>{bannerMessage}</span>
              <button
                onClick={() => setBannerMessage(null)}
                className="banner-close-btn"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <motion.div
          className="dash-hero-header"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1>Content Management</h1>
          <p>
            Modify site content, manage reader inquiries, and monitor
            subscribers directly from your admin panel
          </p>
        </motion.div>

        {/* Modular Sections List with Stagger Animation */}
        <motion.div
          className="dash-sections-stack"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 1. ABOUT SECTION */}
          <motion.div
            variants={cardVariants}
            className={`dash-section-card ${
              activeEditSection === "about" ? "expanded" : ""
            }`}
          >
            <div className="dash-card-header">
              <div className="dash-card-info">
                <div className="dash-card-icon-wrapper">
                  <FontAwesomeIcon icon={faUserGear} />
                </div>
                <div className="dash-card-title">
                  <h3>About Section</h3>
                  <p>
                    Bio paragraphs, tagline, location, and social media links
                  </p>
                </div>
              </div>

              <motion.button
                className="dash-edit-toggle-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setActiveEditSection(
                    activeEditSection === "about" ? null : "about",
                  )
                }
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>
                  {activeEditSection === "about"
                    ? "Cancel Edit"
                    : "Edit Section"}
                </span>
                <FontAwesomeIcon
                  icon={
                    activeEditSection === "about" ? faChevronUp : faChevronDown
                  }
                  className="chevron-icon"
                />
              </motion.button>
            </div>

            <AnimatePresence initial={false}>
              {activeEditSection === "about" && (
                <motion.div
                  key="editor-about"
                  variants={accordionVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  style={{ overflow: "hidden" }}
                >
                  <div className="dash-editor-wrapper">
                    <AboutAdmin
                      onSaveSuccess={() => handleSaveSuccess("About")}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 2. WRITING SECTION */}
          <motion.div
            variants={cardVariants}
            className={`dash-section-card ${
              activeEditSection === "writing" ? "expanded" : ""
            }`}
          >
            <div className="dash-card-header">
              <div className="dash-card-info">
                <div className="dash-card-icon-wrapper">
                  <FontAwesomeIcon icon={faFeather} />
                </div>
                <div className="dash-card-title">
                  <h3>Writing & Essays</h3>
                  <p>Published articles, featured essays, and external links</p>
                </div>
              </div>

              <motion.button
                className="dash-edit-toggle-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setActiveEditSection(
                    activeEditSection === "writing" ? null : "writing",
                  )
                }
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>
                  {activeEditSection === "writing"
                    ? "Cancel Edit"
                    : "Edit Section"}
                </span>
                <FontAwesomeIcon
                  icon={
                    activeEditSection === "writing"
                      ? faChevronUp
                      : faChevronDown
                  }
                  className="chevron-icon"
                />
              </motion.button>
            </div>

            <AnimatePresence initial={false}>
              {activeEditSection === "writing" && (
                <motion.div
                  key="editor-writing"
                  variants={accordionVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  style={{ overflow: "hidden" }}
                >
                  <div className="dash-editor-wrapper">
                    <p className="dash-placeholder-text">
                      Writing section editor will render here.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 3. BOOKS SECTION */}
          <motion.div
            variants={cardVariants}
            className={`dash-section-card ${
              activeEditSection === "books" ? "expanded" : ""
            }`}
          >
            <div className="dash-card-header">
              <div className="dash-card-info">
                <div className="dash-card-icon-wrapper">
                  <FontAwesomeIcon icon={faBookOpen} />
                </div>
                <div className="dash-card-title">
                  <h3>Books Section</h3>
                  <p>Published books, store purchase links, and excerpts</p>
                </div>
              </div>

              <motion.button
                className="dash-edit-toggle-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setActiveEditSection(
                    activeEditSection === "books" ? null : "books",
                  )
                }
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>
                  {activeEditSection === "books"
                    ? "Cancel Edit"
                    : "Edit Section"}
                </span>
                <FontAwesomeIcon
                  icon={
                    activeEditSection === "books" ? faChevronUp : faChevronDown
                  }
                  className="chevron-icon"
                />
              </motion.button>
            </div>

            <AnimatePresence initial={false}>
              {activeEditSection === "books" && (
                <motion.div
                  key="editor-books"
                  variants={accordionVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  style={{ overflow: "hidden" }}
                >
                  <div className="dash-editor-wrapper">
                    <p className="dash-placeholder-text">
                      Books section editor will render here.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 4. CONTACT & INQUIRIES SECTION */}
          <motion.div
            variants={cardVariants}
            className={`dash-section-card dash-about-card ${
              activeEditSection === "contact" ? "expanded" : ""
            }`}
          >
            <div className="dash-card-header">
              <div className="dash-card-info">
                <div className="dash-card-icon-wrapper">
                  <FontAwesomeIcon icon={faEnvelopeOpenText} />
                </div>
                <div className="dash-card-title">
                  <h3>Contact & Inquiries Inbox</h3>
                  <p>
                    Inquiry inbox, client messages, and dropdown options
                    settings
                  </p>
                </div>
              </div>

              <motion.button
                className="dash-edit-toggle-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setActiveEditSection(
                    activeEditSection === "contact" ? null : "contact",
                  )
                }
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>
                  {activeEditSection === "contact"
                    ? "Close Section"
                    : "Open Module"}
                </span>
                <FontAwesomeIcon
                  icon={
                    activeEditSection === "contact"
                      ? faChevronUp
                      : faChevronDown
                  }
                  className="chevron-icon"
                />
              </motion.button>
            </div>

            <AnimatePresence initial={false}>
              {activeEditSection === "contact" && (
                <motion.div
                  key="editor-contact"
                  variants={accordionVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  style={{ overflow: "hidden" }}
                >
                  <div className="dash-editor-wrapper">
                    <AdminContact />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 5. NEWSLETTER SUBSCRIBERS SECTION */}
          <motion.div
            variants={cardVariants}
            className={`dash-section-card ${
              activeEditSection === "subscribers" ? "expanded" : ""
            }`}
          >
            <div className="dash-card-header">
              <div className="dash-card-info">
                <div className="dash-card-icon-wrapper">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="dash-card-title">
                  <h3>Newsletter Subscribers</h3>
                  <p>
                    View dispatch subscribers, search emails, export CSV, and
                    manage status
                  </p>
                </div>
              </div>

              <motion.button
                className="dash-edit-toggle-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setActiveEditSection(
                    activeEditSection === "subscribers" ? null : "subscribers",
                  )
                }
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>
                  {activeEditSection === "subscribers"
                    ? "Close Section"
                    : "Open Module"}
                </span>
                <FontAwesomeIcon
                  icon={
                    activeEditSection === "subscribers"
                      ? faChevronUp
                      : faChevronDown
                  }
                  className="chevron-icon"
                />
              </motion.button>
            </div>

            <AnimatePresence initial={false}>
              {activeEditSection === "subscribers" && (
                <motion.div
                  key="editor-subscribers"
                  variants={accordionVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  style={{ overflow: "hidden" }}
                >
                  <div className="dash-editor-wrapper">
                    <AdminSubscribers />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
