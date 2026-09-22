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

// Motion Variants with explicit slide-up & fade transition
const slideUpVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: customDelay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
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
          variants={slideUpVariant}
          custom={0}
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
          {/* Left Column: Cards with ordered sequence */}
          <div className="contact-info-col">
            {/* 1. Literary Representation (Slides Up First) */}
            <motion.div
              className="info-card representation-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2 }}
              variants={slideUpVariant}
              custom={0} // No delay: comes first
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

            {/* 2. Direct Contact (Slides Up Second) */}
            <motion.div
              className="info-card direct-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2 }}
              variants={slideUpVariant}
              custom={0.25} // Delay 0.25s: comes after Literary Representation
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

            {/* 3. Response Times (Slides Up Last) */}
            <motion.div
              className="info-card guidelines-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2 }}
              variants={slideUpVariant}
              custom={0.45} // Delay 0.45s: comes last on left side
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
          </div>

          {/* Right Column: Form Container and Elements */}
          <div className="contact-form-col">
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
                <form onSubmit={handleSubmit} className="contact-form">
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

                  {/* Form Field Row: Name & Email */}
                  <div className="form-row">
                    <motion.div
                      className="form-group"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ amount: 0.2 }}
                      variants={slideUpVariant}
                      custom={0.1} // Starts sliding alongside Literary Representation
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
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ amount: 0.2 }}
                      variants={slideUpVariant}
                      custom={0.2} // Follows slightly after Name
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

                  {/* Inquiry Type Field */}
                  <motion.div
                    className="form-group"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={slideUpVariant}
                    custom={0.3}
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

                  {/* Subject Field */}
                  <motion.div
                    className="form-group"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={slideUpVariant}
                    custom={0.4}
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

                  {/* Message Field */}
                  <motion.div
                    className="form-group"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={slideUpVariant}
                    custom={0.5}
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

                  {/* Submit Button */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={slideUpVariant}
                    custom={0.6}
                  >
                    <motion.button
                      type="submit"
                      className="submit-btn"
                      disabled={loading}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
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
                  </motion.div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
