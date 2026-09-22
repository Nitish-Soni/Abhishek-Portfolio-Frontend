import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext";
import { fetchAboutData } from "../../services/PublicAPI";
import "./Navbar.css";

// Animation Variants
const navbarVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    y: -15,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeIn" },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const menuItemVariants = {
  closed: { opacity: 0, x: -10 },
  open: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tagline, setTagline] = useState("Author & Essayist");
  const [name, setName] = useState("Abhishek Kabra");
  const navRef = useRef(null);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact", isCta: true },
  ];

  useEffect(() => {
    fetchAboutData()
      .then((data) => {
        if (data && data.tagline && data.name) {
          setTagline(data.tagline);
          setName(data.name);
        }
      })
      .catch((err) => console.error("Error fetching tagline for Navbar:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.nav
      className="navbar"
      ref={navRef}
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Brand & Logo */}
      <div className="navbar-brand">
        <motion.a
          href="#home"
          className="navbar-logo"
          onClick={() => setIsMenuOpen(false)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {name}
        </motion.a>
        <span className="navbar-tagline" style={{ display: "block" }}>
          {tagline}
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="navbar-right desktop-only">
        <ul className="navbar-links">
          {navLinks.map((link, index) => (
            <motion.li
              key={index}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href={link.href} className={link.isCta ? "nav-cta" : ""}>
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Mobile Drawer Navigation (Animated with AnimatePresence) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="navbar-right open"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <ul className="navbar-links">
              {navLinks.map((link, index) => (
                <motion.li key={index} variants={menuItemVariants}>
                  <a
                    href={link.href}
                    className={link.isCta ? "nav-cta" : ""}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Controls */}
      <div className="navbar-controls">
        <motion.button
          className="theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
          whileHover={{ scale: 1.15, rotate: 15 }}
          whileTap={{ scale: 0.85, rotate: -30 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
        </motion.button>

        <motion.button
          className="hamburger-btn"
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
        </motion.button>
      </div>
    </motion.nav>
  );
}
