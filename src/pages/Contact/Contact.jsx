import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPaperPlane,
  faBuildingColumns,
  faUserGroup,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import PublicAPI from "../../services/PublicAPI";
import "./Contact.css";

const DEFAULT_INQUIRY_TYPES = [
  "Editorial / Writing Assignment",
  "Literary Agent / Book Rights",
  "Speaking & Panel Engagement",
  "Press & Media Interview",
  "Reader Note / General Inquiry",
];

const AUTHOR_INFO = {
  agentName: "Sarah Jenkins",
  agentAgency: "Apex Literary Agency",
  agentEmail: "s.jenkins@apexliterary.com",
  contactEmail: "abhishek@abhishekkabra.com",
};

// Advanced Motion Variants
const headerVariants = {
  hidden: { opacity: 0, y: -25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardStaggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardChildVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const formContainerVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function Contact() {
  const [inquiryOptions, setInquiryOptions] = useState(DEFAULT_INQUIRY_TYPES);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: DEFAULT_INQUIRY_TYPES[0],
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    PublicAPI.getInquiryTypes()
      .then((data) => {
        let options = [];
        if (Array.isArray(data)) {
          options = data.map((item) => item.name || item);
        } else if (data && Array.isArray(data.inquiryTypes)) {
          options = data.inquiryTypes.map((item) => item.name || item);
        }

        if (options.length > 0) {
          setInquiryOptions(options);
          setFormData((prev) => ({
            ...prev,
            inquiryType: options[0],
          }));
        }
      })
      .catch((err) => {
        console.warn("Using default inquiry options:", err.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await PublicAPI.submitInquiry(formData);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit inquiry. Please check your network connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Animated Header */}
        <motion.header
          className="contact-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          variants={headerVariants}
        >
          <motion.p
            className="contact-label"
            initial={{ opacity: 0, letterSpacing: "0.05em" }}
            animate={{ opacity: 1, letterSpacing: "0.15em" }}
            transition={{ duration: 1 }}
          >
            Get in Touch
          </motion.p>
          <h2 className="contact-title">Contact & Inquiries</h2>
          <p className="contact-subtitle">
            For editorial assignments, literary agent queries, speaking
            engagements, or general commentary, please reach out using the form
            below.
          </p>
        </motion.header>

        <div className="contact-grid">
          {/* Left Column: Interactive Cards Stagger */}
          <motion.div
            className="contact-info-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.1 }}
            variants={cardStaggerVariants}
          >
            <motion.div
              className="info-card representation-card"
              variants={cardChildVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
                borderColor: "rgba(204, 58, 99, 0.4)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="card-icon-wrapper">
                <FontAwesomeIcon
                  icon={faBuildingColumns}
                  className="card-icon"
                />
              </div>
              <h3 className="info-card-title">Literary Representation</h3>
              <p className="info-card-text">
                For book rights, translation inquiries, or manuscript
                representation, please contact my agent directly:
              </p>
              <div className="agent-details">
                <p className="agent-name">{AUTHOR_INFO.agentName}</p>
                <p className="agent-agency">{AUTHOR_INFO.agentAgency}</p>
                <a
                  href={`mailto:${AUTHOR_INFO.agentEmail}`}
                  className="agent-email"
                >
                  {AUTHOR_INFO.agentEmail}
                </a>
              </div>
            </motion.div>

            <motion.div
              className="info-card direct-card"
              variants={cardChildVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
                borderColor: "rgba(204, 58, 99, 0.4)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="card-icon" />
              </div>
              <h3 className="info-card-title">Direct Contact</h3>
              <p className="info-card-text">
                For articles, interviews, speaking engagements, or personal
                reader correspondence:
              </p>
              <a
                href={`mailto:${AUTHOR_INFO.contactEmail}`}
                className="direct-email-link"
              >
                {AUTHOR_INFO.contactEmail}
              </a>
            </motion.div>

            <motion.div
              className="info-card guidelines-card"
              variants={cardChildVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
                borderColor: "rgba(204, 58, 99, 0.4)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h4 className="guidelines-title">
                <FontAwesomeIcon
                  icon={faUserGroup}
                  className="guidelines-icon"
                />
                Response Times
              </h4>
              <p className="guidelines-text">
                I read all messages and attempt to respond to editorial and
                rights inquiries within 48 hours. Reader correspondence is
                always cherished!
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Animated Form Fields */}
          <motion.div
            className="contact-form-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.1 }}
            variants={formContainerVariants}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success-box"
                  className="form-success-box"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <motion.div
                    className="success-icon-wrapper"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                      delay: 0.15,
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} className="success-icon" />
                  </motion.div>
                  <h3>Message Sent Successfully</h3>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. Your inquiry
                    has been received.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        inquiryType:
                          inquiryOptions[0] || DEFAULT_INQUIRY_TYPES[0],
                        subject: "",
                        message: "",
                      });
                    }}
                    className="reset-btn"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  className="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {errorMessage && (
                    <motion.div
                      className="form-error-banner"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  <div className="form-row">
                    <motion.div
                      className="form-group"
                      variants={formItemVariants}
                    >
                      <label htmlFor="name" className="label">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Jane Doe"
                        required
                      />
                    </motion.div>

                    <motion.div
                      className="form-group"
                      variants={formItemVariants}
                    >
                      <label htmlFor="email" className="label">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. jane@example.com"
                        required
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    className="form-group"
                    variants={formItemVariants}
                  >
                    <label htmlFor="inquiryType" className="label">
                      Nature of Inquiry
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                    >
                      {inquiryOptions.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    className="form-group"
                    variants={formItemVariants}
                  >
                    <label htmlFor="subject" className="label">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief title of your inquiry"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="form-group"
                    variants={formItemVariants}
                  >
                    <label className="label" htmlFor="message">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please share details about your commission, event, or inquiry..."
                      required
                    ></textarea>
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                    variants={formItemVariants}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="submit-icon"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faPaperPlane}
                          className="submit-icon"
                        />
                        Send Inquiry
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
