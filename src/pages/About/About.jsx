import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faGlobe,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faXTwitter,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "./About.css";

const getSocialIcon = (platform) => {
  switch (platform?.toLowerCase()) {
    case "twitter":
    case "x":
      return faXTwitter;
    case "linkedin":
      return faLinkedinIn;
    case "instagram":
      return faInstagram;
    case "gmail":
    case "email":
      return faEnvelope;
    default:
      return faGlobe;
  }
};

export default function About({ initialData }) {
  const about = initialData;

  if (!about) return null;

  const socials = about.socials || [];

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-editorial-card">
          {/* Left Column: Portrait Card Animation */}
          <motion.div
            className="about-image-wrapper"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={about.portraitUrl}
              alt={`${about.name} portrait`}
              className="about-portrait-img"
            />
          </motion.div>

          {/* Right Column: Content Card Animation */}
          <motion.div
            className="about-text-card"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="about-category-label">About the Author</p>

            <h2 className="about-author-name">{about.name}</h2>

            {about.tagline && (
              <p className="about-author-tagline">{about.tagline}</p>
            )}

            {/* Location Tag */}
            {about.location && (
              <div className="about-location-badge">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="location-icon"
                />
                <span>{about.location}</span>
              </div>
            )}

            {/* Paragraph Content */}
            <div className="about-paragraphs">
              {Array.isArray(about.bioText) ? (
                about.bioText.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{about.bioText}</p>
              )}
            </div>

            {/* Social Links Row */}
            {socials.length > 0 && (
              <div className="about-social-row">
                {socials.map((social, index) => {
                  const isEmail =
                    social.platform?.toLowerCase() === "gmail" ||
                    social.platform?.toLowerCase() === "email";
                  const hrefUrl =
                    isEmail && !social.url.startsWith("mailto:")
                      ? `mailto:${social.url}`
                      : social.url;

                  return (
                    <a
                      key={social._id || index}
                      href={hrefUrl}
                      target={isEmail ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      className="social-item"
                    >
                      <FontAwesomeIcon icon={getSocialIcon(social.platform)} />
                      <span>{social.label || social.platform}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
