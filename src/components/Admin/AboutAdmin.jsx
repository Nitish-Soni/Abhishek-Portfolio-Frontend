import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faSave,
  faSpinner,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import PublicAPI from "../../services/PublicAPI";
import AdminAPI from "../../services/AdminAPI";
import "./AboutAdmin.css";

// Framer Motion Variants
const formContainerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const paragraphVariants = {
  hidden: { opacity: 0, height: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    height: "auto",
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.96,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export default function AboutAdmin({ onSaveSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    location: "",
    footerBio: "",
    portraitUrl: "",
    bioText: [""],
    socials: [
      { platform: "twitter", label: "Twitter", url: "" },
      { platform: "linkedin", label: "LinkedIn", url: "" },
      { platform: "instagram", label: "Instagram", url: "" },
      { platform: "gmail", label: "Gmail", url: "" },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    PublicAPI.fetchAboutData()
      .then((data) => {
        if (data) {
          setFormData({
            name: data.name || "",
            tagline: data.tagline || "",
            location: data.location || "",
            footerBio: data.footerBio || "",
            portraitUrl: data.portraitUrl || "",
            bioText:
              Array.isArray(data.bioText) && data.bioText.length > 0
                ? data.bioText
                : [""],
            socials:
              data.socials && data.socials.length > 0
                ? data.socials
                : formData.socials,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load about data:", err);
        setMessage({
          type: "error",
          text: "Failed to load current About data.",
        });
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBioChange = (index, value) => {
    const updatedBio = [...formData.bioText];
    updatedBio[index] = value;
    setFormData((prev) => ({ ...prev, bioText: updatedBio }));
  };

  const handleAddParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      bioText: [...prev.bioText, ""],
    }));
  };

  const handleRemoveParagraph = (index) => {
    if (formData.bioText.length === 1) {
      alert("At least one bio paragraph is required.");
      return;
    }
    const updatedBio = formData.bioText.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, bioText: updatedBio }));
  };

  const handleSocialChange = (index, field, value) => {
    const updatedSocials = [...formData.socials];
    updatedSocials[index][field] = value;
    setFormData((prev) => ({ ...prev, socials: updatedSocials }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await AdminAPI.updateAboutData(formData);

      // Trigger top banner notification in parent
      if (typeof onSaveSuccess === "function") {
        onSaveSuccess();
      } else {
        setMessage({
          type: "success",
          text: "About section updated successfully!",
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage({
        type: "error",
        text: "Failed to save changes. Please verify credentials.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <FontAwesomeIcon icon={faSpinner} spin /> Loading About details...
      </div>
    );
  }

  return (
    <motion.div
      className="admin-about-container"
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {message.text && (
          <motion.div
            className={`admin-alert ${message.type}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {message.type === "success" && <FontAwesomeIcon icon={faCheck} />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Section 1: Basic Details */}
        <motion.div className="form-section" variants={sectionVariants}>
          <h3>Basic Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Abhishek Kabra"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="New Delhi, India"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tagline / Subtitle</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Author, philosopher, modern spiritual seeker."
            />
          </div>

          <div className="form-group">
            <label>Footer Bio</label>
            <input
              type="text"
              name="footerBio"
              value={formData.footerBio}
              onChange={handleChange}
              placeholder="Writer, essayist, and researcher exploring culture, literature, and technology."
            />
          </div>

          <div className="form-group">
            <label>Portrait Image URL</label>
            <input
              type="text"
              name="portraitUrl"
              value={formData.portraitUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
        </motion.div>

        {/* Section 2: Dynamic Bio Array */}
        <motion.div className="form-section" variants={sectionVariants}>
          <div className="section-header-row">
            <div>
              <h3>Bio Paragraphs</h3>
              <p className="subtext">
                Each entry creates a distinct paragraph item in your bio array.
              </p>
            </div>
            <motion.button
              type="button"
              className="btn-add"
              onClick={handleAddParagraph}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Paragraph
            </motion.button>
          </div>

          <div className="paragraphs-list">
            <AnimatePresence initial={false}>
              {formData.bioText.map((paragraph, index) => (
                <motion.div
                  key={index}
                  className="paragraph-item"
                  variants={paragraphVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <div className="paragraph-header">
                    <span>Paragraph #{index + 1}</span>
                    {formData.bioText.length > 1 && (
                      <motion.button
                        type="button"
                        className="btn-delete-icon"
                        onClick={() => handleRemoveParagraph(index)}
                        title="Remove paragraph"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </motion.button>
                    )}
                  </div>
                  <textarea
                    rows="4"
                    value={paragraph}
                    onChange={(e) => handleBioChange(index, e.target.value)}
                    placeholder={`Write text for paragraph ${index + 1}...`}
                    required
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Section 3: Social Links */}
        <motion.div className="form-section" variants={sectionVariants}>
          <h3>Social Links</h3>
          <div className="socials-grid">
            {formData.socials.map((social, index) => (
              <div key={index} className="social-input-row">
                <span className="social-platform-badge">{social.platform}</span>
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) =>
                    handleSocialChange(index, "url", e.target.value)
                  }
                  placeholder="URL or email address"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Footer Action */}
        <motion.div className="form-actions" variants={sectionVariants}>
          <motion.button
            type="submit"
            className="btn-save"
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {saving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} /> Save Changes
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
