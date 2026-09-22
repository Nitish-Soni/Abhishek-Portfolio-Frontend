import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInbox,
  faSliders,
  faTrash,
  faPlus,
  faEnvelope,
  faSpinner,
  faTimes,
  faCheckCircle,
  faReply,
  faExclamationTriangle,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import AdminAPI from "../../services/AdminAPI";
import "./AdminContact.css";

// Framer Motion Animation Variants
const tabContentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.2 },
  },
};

export default function AdminContact() {
  const [activeTab, setActiveTab] = useState("inbox"); // 'inbox' | 'settings'

  // Inbox State
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null); // Triggers detail modal
  const [inboxLoading, setInboxLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  // Settings State
  const [inquiryTypes, setInquiryTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Reply Modal State
  const [replyModal, setReplyModal] = useState({
    isOpen: false,
    inquiry: null,
    replyText: "",
    sending: false,
    error: "",
  });

  // Custom Delete Modal State
  const [deleteConfig, setDeleteConfig] = useState({
    isOpen: false,
    type: null, // 'inquiry' | 'option'
    id: null,
    title: "",
  });

  /* --- API CALLS --- */
  const fetchInquiries = useCallback(async () => {
    setInboxLoading(true);
    try {
      const data = await AdminAPI.getAllInquiries();
      if (Array.isArray(data)) {
        setInquiries(data);
      }
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setInboxLoading(false);
    }
  }, []);

  const fetchInquiryTypes = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const data = await AdminAPI.getInquiryTypes();
      if (Array.isArray(data)) {
        setInquiryTypes(data);
      }
    } catch (err) {
      console.error("Error loading inquiry types:", err);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
    fetchInquiryTypes();
  }, [fetchInquiries, fetchInquiryTypes]);

  // Update Status Helper
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const updated = await AdminAPI.updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? updated : item)),
      );
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry(updated);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Open Reply Modal
  const openReplyModal = (inquiry) => {
    setReplyModal({
      isOpen: true,
      inquiry,
      replyText: "",
      sending: false,
      error: "",
    });
  };

  // Submit Reply via Resend API
  const handleSendReply = async (e) => {
    e.preventDefault();
    const { inquiry, replyText } = replyModal;
    const trimmedReply = replyText.trim();
    if (!trimmedReply) return;

    setReplyModal((prev) => ({ ...prev, sending: true, error: "" }));

    try {
      const response = await AdminAPI.replyToInquiry(inquiry._id, trimmedReply);
      const updatedDate = new Date().toISOString();

      const updatedInquiry = response?.inquiry || {
        ...inquiry,
        status: "Replied",
        repliedMessage: trimmedReply,
        updatedAt: updatedDate,
      };

      setInquiries((prev) =>
        prev.map((item) =>
          item._id === inquiry._id ? { ...item, ...updatedInquiry } : item,
        ),
      );

      if (selectedInquiry && selectedInquiry._id === inquiry._id) {
        setSelectedInquiry((prev) => ({
          ...prev,
          ...updatedInquiry,
        }));
      }

      setReplyModal({
        isOpen: false,
        inquiry: null,
        replyText: "",
        sending: false,
        error: "",
      });
    } catch (err) {
      setReplyModal((prev) => ({
        ...prev,
        sending: false,
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to send email. Check backend logs.",
      }));
    }
  };

  // Add Dynamic Option
  const handleAddType = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    setErrorMessage("");

    try {
      const data = await AdminAPI.addInquiryType(newTypeName.trim());
      setInquiryTypes((prev) => [...prev, data]);
      setNewTypeName("");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || err.message || "Failed to add type",
      );
    }
  };

  // Trigger Custom Delete Confirmation Modal
  const promptDelete = (type, id, title) => {
    setDeleteConfig({
      isOpen: true,
      type,
      id,
      title,
    });
  };

  // Execute Confirmed Delete
  const confirmDelete = async () => {
    const { type, id } = deleteConfig;
    try {
      if (type === "option") {
        await AdminAPI.deleteInquiryType(id);
        setInquiryTypes((prev) => prev.filter((item) => item._id !== id));
      } else if (type === "inquiry") {
        await AdminAPI.deleteInquiry(id);
        setInquiries((prev) => prev.filter((item) => item._id !== id));
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error("Delete operation failed:", err);
    } finally {
      setDeleteConfig({ isOpen: false, type: null, id: null, title: "" });
    }
  };

  const filteredInquiries =
    filterStatus === "All"
      ? inquiries
      : inquiries.filter((item) => item.status === filterStatus);

  return (
    <div className="admin-contact-container">
      {/* Top Tab Navigation Bar */}
      <div className="admin-tab-nav">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`tab-btn ${activeTab === "inbox" ? "active" : ""}`}
          onClick={() => setActiveTab("inbox")}
        >
          <FontAwesomeIcon icon={faInbox} />
          <span>Inquiry Inbox</span>
          {inquiries.filter((i) => i.status === "New").length > 0 && (
            <span className="badge">
              {inquiries.filter((i) => i.status === "New").length}
            </span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <FontAwesomeIcon icon={faSliders} />
          <span>Dropdown Settings</span>
        </motion.button>
      </div>

      {/* Animated Tab Switcher */}
      <AnimatePresence mode="wait">
        {/* TAB 1: INQUIRIES INBOX */}
        {activeTab === "inbox" && (
          <motion.div
            key="tab-inbox"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="form-section"
          >
            <div className="section-header-row">
              <div>
                <h3>Inquiry Messages</h3>
                <p className="subtext">
                  Click any message to review details and take action
                </p>
              </div>

              {/* Filter Group */}
              <div className="filter-group">
                {["All", "New", "Read", "Replied"].map((st) => (
                  <motion.button
                    key={st}
                    whileTap={{ scale: 0.95 }}
                    className={`filter-btn ${
                      filterStatus === st ? "active" : ""
                    }`}
                    onClick={() => setFilterStatus(st)}
                  >
                    {st}
                  </motion.button>
                ))}
              </div>
            </div>

            {inboxLoading ? (
              <div className="admin-loading">
                <FontAwesomeIcon icon={faSpinner} spin /> Loading messages...
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="no-selection">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ fontSize: "2rem" }}
                />
                <p>No inquiries found under this category.</p>
              </div>
            ) : (
              <motion.div
                className="inbox-list"
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence mode="popLayout">
                  {filteredInquiries.map((item) => (
                    <motion.div
                      key={item._id}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      whileTap={{ scale: 0.99 }}
                      className={`inbox-card ${
                        item.status === "New" ? "unread" : ""
                      }`}
                      onClick={() => setSelectedInquiry(item)}
                    >
                      <div className="inbox-card-header">
                        <span className="sender-name">{item.name}</span>
                        <span className="inquiry-date">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="inbox-subject">{item.subject}</h4>
                      <p className="inbox-snippet">{item.message}</p>
                      <div className="inbox-card-footer">
                        <span className="type-pill">{item.inquiryType}</span>
                        <span
                          className={`status-pill status-${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* TAB 2: DROPDOWN OPTIONS SETTINGS */}
        {activeTab === "settings" && (
          <motion.div
            key="tab-settings"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="form-section"
          >
            <h3>Dropdown Options Settings</h3>
            <p className="subtext">
              Customize the "Nature of Inquiry" options presented on your public
              contact form
            </p>

            {errorMessage && (
              <div className="admin-alert error">{errorMessage}</div>
            )}

            <div className="form-grid">
              {/* Add New Type Form */}
              <div className="paragraph-item">
                <div className="paragraph-header">Add New Dropdown Option</div>
                <form onSubmit={handleAddType} className="add-type-form">
                  <div className="form-group">
                    <input
                      type="text"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      placeholder="e.g. Podcast Guest Request"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="add-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Option
                  </motion.button>
                </form>
              </div>

              {/* Current Active Types */}
              <div className="paragraph-item">
                <div className="paragraph-header">
                  Active Options ({inquiryTypes.length})
                </div>
                {settingsLoading ? (
                  <p className="subtext">Loading options...</p>
                ) : (
                  <ul className="types-list">
                    <AnimatePresence>
                      {inquiryTypes.map((type) => (
                        <motion.li
                          key={type._id}
                          className="type-item"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span>{type.name}</span>
                          <motion.button
                            onClick={() =>
                              promptDelete("option", type._id, type.name)
                            }
                            className="btn-delete-icon"
                            title="Remove Option"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </motion.button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: FULL INQUIRY OVERVIEW POPUP */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            className="modal-overlay"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setSelectedInquiry(null)}
          >
            <motion.div
              className="modal-card detail-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. FIXED HEADER */}
              <div className="pane-header">
                <div>
                  <h3>{selectedInquiry.subject}</h3>
                  <span
                    className={`status-pill status-${selectedInquiry.status?.toLowerCase()}`}
                    style={{ marginTop: "0.25rem", display: "inline-block" }}
                  >
                    Status: {selectedInquiry.status}
                  </span>
                </div>
                <motion.button
                  className="btn-delete-icon"
                  onClick={() => setSelectedInquiry(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </motion.button>
              </div>

              {/* 2. MIDDLE SCROLLABLE BODY */}
              <div className="modal-scroll-body">
                <div className="sender-meta">
                  <p>
                    <strong>From:</strong> {selectedInquiry.name} (
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      style={{ color: "#cc3a63" }}
                    >
                      {selectedInquiry.email}
                    </a>
                    )
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedInquiry.inquiryType}
                  </p>
                  <p>
                    <strong>Received:</strong>{" "}
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                  {selectedInquiry.status === "Replied" &&
                    selectedInquiry.updatedAt && (
                      <p className="replied-timestamp">
                        <strong>Replied On:</strong>{" "}
                        {new Date(selectedInquiry.updatedAt).toLocaleString()}
                      </p>
                    )}
                </div>

                <div className="section-label">User's Message</div>
                <textarea
                  className="message-body"
                  readOnly
                  value={selectedInquiry.message}
                />

                {selectedInquiry.status === "Replied" && (
                  <>
                    <div
                      className="section-label"
                      style={{ marginTop: "0.85rem" }}
                    >
                      Replied Message
                    </div>
                    <textarea
                      className="message-body replied-box"
                      readOnly
                      value={
                        selectedInquiry.repliedMessage ||
                        "No reply text recorded."
                      }
                    />
                  </>
                )}
              </div>

              {/* 3. FIXED FOOTER ACTIONS */}
              <div className="pane-actions">
                {selectedInquiry.status === "New" && (
                  <motion.button
                    className="btn-mark-read"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      handleStatusUpdate(selectedInquiry._id, "Read")
                    }
                  >
                    <FontAwesomeIcon icon={faCheckCircle} /> Mark as Read
                  </motion.button>
                )}

                {selectedInquiry.status !== "Replied" && (
                  <motion.button
                    className="btn-send-reply-primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openReplyModal(selectedInquiry)}
                  >
                    <FontAwesomeIcon icon={faReply} /> Reply via Email
                  </motion.button>
                )}

                <motion.button
                  className="delete-btn"
                  style={{ marginLeft: "auto" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    promptDelete(
                      "inquiry",
                      selectedInquiry._id,
                      selectedInquiry.subject,
                    )
                  }
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: AUTOMATED RESEND EMAIL REPLY MODAL */}
      <AnimatePresence>
        {replyModal.isOpen && replyModal.inquiry && (
          <motion.div
            className="modal-overlay"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() =>
              setReplyModal({
                isOpen: false,
                inquiry: null,
                replyText: "",
                sending: false,
                error: "",
              })
            }
          >
            <motion.div
              className="modal-card detail-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pane-header">
                <div>
                  <h3>Reply to {replyModal.inquiry.name}</h3>
                  <p className="subtext">
                    To: <strong>{replyModal.inquiry.email}</strong>
                  </p>
                </div>
                <motion.button
                  className="btn-delete-icon"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setReplyModal({
                      isOpen: false,
                      inquiry: null,
                      replyText: "",
                      sending: false,
                      error: "",
                    })
                  }
                >
                  <FontAwesomeIcon icon={faTimes} />
                </motion.button>
              </div>

              {replyModal.error && (
                <div className="admin-alert error">{replyModal.error}</div>
              )}

              <form onSubmit={handleSendReply} className="admin-form">
                <div className="form-group">
                  <label>Your Response Message</label>
                  <textarea
                    rows="8"
                    value={replyModal.replyText}
                    onChange={(e) =>
                      setReplyModal((prev) => ({
                        ...prev,
                        replyText: e.target.value,
                      }))
                    }
                    placeholder="Type your response here... It will be beautifully wrapped in dark glass branding and sent via Resend."
                    required
                  />
                </div>

                <div className="form-actions" style={{ marginTop: "1.5rem" }}>
                  <motion.button
                    type="button"
                    className="tab-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      setReplyModal({
                        isOpen: false,
                        inquiry: null,
                        replyText: "",
                        sending: false,
                        error: "",
                      })
                    }
                    disabled={replyModal.sending}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    className="btn-save"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={replyModal.sending}
                  >
                    {replyModal.sending ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin /> Dispatching
                        Email...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} /> Send Reply via
                        Resend
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CUSTOM CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfig.isOpen && (
          <motion.div
            className="modal-overlay"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() =>
              setDeleteConfig({
                isOpen: false,
                type: null,
                id: null,
                title: "",
              })
            }
          >
            <motion.div
              className="modal-card confirm-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  style={{ fontSize: "2.5rem", color: "#fca5a5" }}
                />
              </div>
              <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                Confirm Deletion
              </h3>
              <p
                className="subtext"
                style={{ textAlign: "center", marginBottom: "1.5rem" }}
              >
                Are you sure you want to delete{" "}
                <strong>"{deleteConfig.title}"</strong>? This action cannot be
                undone.
              </p>

              <div
                className="pane-actions"
                style={{ justifyContent: "center", gap: "1rem" }}
              >
                <motion.button
                  className="tab-btn"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    setDeleteConfig({
                      isOpen: false,
                      type: null,
                      id: null,
                      title: "",
                    })
                  }
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="delete-btn"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmDelete}
                >
                  Confirm Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
