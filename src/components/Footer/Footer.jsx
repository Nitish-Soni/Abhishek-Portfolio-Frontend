import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faLinkedinIn,
  faInstagram,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import {
  faNewspaper,
  faArrowUp,
  faGlobe,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import PublicAPI from "../../services/PublicAPI";
import "./Footer.css";

const getSocialIcon = (platform = "") => {
  const normalized = platform.toLowerCase();
  if (normalized.includes("twitter") || normalized.includes("x"))
    return faXTwitter;
  if (normalized.includes("linkedin")) return faLinkedinIn;
  if (normalized.includes("instagram")) return faInstagram;
  if (normalized.includes("gmail") || normalized.includes("google"))
    return faGoogle;
  return faGlobe;
};

const HARDCODED_NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Footer() {
  const [authorData, setAuthorData] = useState({
    name: "Abhishek Kabra",
    footerBio:
      "Writer, essayist, and researcher exploring culture, literature, and technology.",
    socials: {},
  });

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    PublicAPI.fetchAboutData()
      .then((data) => {
        if (data) {
          setAuthorData({
            name: data.name || "Abhishek Kabra",
            footerBio:
              data.footerBio ||
              "Writer, essayist, and researcher exploring culture, literature, and technology.",
            socials: data.socials || {},
          });
        }
      })
      .catch((err) => {
        console.warn("Using fallback footer info:", err.message);
      });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setErrorMessage("");
    setLoading(true);

    try {
      const data = await PublicAPI.subscribeNewsletter(email);

      setSubscriptionMessage(
        data.message || "Thank you for subscribing to the newsletter!",
      );
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getSocialList = () => {
    const rawSocials = authorData.socials;
    if (!rawSocials) return [];

    if (Array.isArray(rawSocials)) {
      return rawSocials
        .map((item) => {
          if (typeof item === "string") return { platform: "globe", url: item };
          return {
            platform: item?.platform || item?.name || "globe",
            url: item?.url || "",
          };
        })
        .filter((item) => item.url && item.url.trim() !== "");
    }

    if (typeof rawSocials === "object") {
      return Object.entries(rawSocials)
        .map(([key, val]) => {
          const url = typeof val === "string" ? val : val?.url || "";
          return { platform: key, url };
        })
        .filter((item) => item.url && item.url.trim() !== "");
    }

    return [];
  };

  const socialList = getSocialList();

  return (
    <footer className="footer">
      <motion.div
        className="footer-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
      >
        {/* About Column */}
        <motion.div className="footer-col footer-about" variants={itemVariants}>
          <h3 className="footer-logo">{authorData.name}</h3>
          <p className="footer-bio">{authorData.footerBio}</p>

          <div className="footer-socials">
            {socialList.map(({ platform, url }, index) => {
              const formattedUrl = /^https?:\/\//i.test(url)
                ? url
                : `https://${url}`;

              return (
                <motion.a
                  key={index}
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  title={platform}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={getSocialIcon(platform)} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation Column */}
        <motion.div className="footer-col footer-links" variants={itemVariants}>
          <h4>Navigation</h4>
          <ul>
            {HARDCODED_NAV_LINKS.map((link, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <a href={link.href}>{link.label}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter Column */}
        <motion.div
          className="footer-col footer-newsletter"
          variants={itemVariants}
        >
          <h4>
            <FontAwesomeIcon icon={faNewspaper} className="newsletter-icon" />
            Dispatch / Newsletter
          </h4>
          <p>
            Receive occasional essays, reading recommendations, and updates on
            new publications directly in your inbox.
          </p>

          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="newsletter-success"
              >
                {subscriptionMessage}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubscribe}
                className="newsletter-form"
              >
                {errorMessage && (
                  <p
                    style={{
                      color: "#fca5a5",
                      fontSize: "0.8rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {errorMessage}
                  </p>
                )}

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        viewport={{ amount: 0.2 }}
      >
        <p>
          &copy; {new Date().getFullYear()} {authorData.name}. All rights
          reserved.
        </p>

        <motion.button
          onClick={scrollToTop}
          className="back-to-top-btn"
          aria-label="Back to top"
          title="Scroll back to top"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faArrowUp} />
          <span>Back to Top</span>
        </motion.button>
      </motion.div>
    </footer>
  );
}
