import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUserSlash,
  faTrashCan,
  faDownload,
  faSpinner,
  faUsers,
  faCheckCircle,
  faTimesCircle,
  faRefresh,
  faExclamationTriangle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import AdminAPI from "../../services/AdminAPI";
import PublicAPI from "../../services/PublicAPI";
import "./AdminSubscriber.css";

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
};

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'unsubscribe' | 'delete'
    item: null, // subscriber object
  });

  const fetchSubscribers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await AdminAPI.getSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error("Fetch subscribers error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to retrieve subscribers.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && confirmModal.isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmModal.isOpen]);

  const openUnsubscribeModal = (sub) => {
    setConfirmModal({
      isOpen: true,
      type: "unsubscribe",
      item: sub,
    });
  };

  const openDeleteModal = (sub) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      item: sub,
    });
  };

  const closeModal = () => {
    if (actionLoadingId) return; // Prevent closing while API request in flight
    setConfirmModal({ isOpen: false, type: null, item: null });
  };

  // Unsubscribe Request Handler
  const handleUnsubscribeConfirm = async () => {
    const sub = confirmModal.item;
    if (!sub) return;

    setActionLoadingId(sub.email);
    try {
      await PublicAPI.unsubscribeNewsletter(sub.email);

      setSubscribers((prev) =>
        prev.map((item) =>
          item.email === sub.email ? { ...item, isActive: false } : item,
        ),
      );
      closeModal();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Error setting subscriber status.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // Permanent Delete Request Handler
  const handleDeleteConfirm = async () => {
    const sub = confirmModal.item;
    if (!sub) return;

    setActionLoadingId(sub._id);
    try {
      await AdminAPI.deleteSubscriber(sub._id);

      setSubscribers((prev) => prev.filter((item) => item._id !== sub._id));
      closeModal();
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Error deleting record.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());

    if (statusFilter === "active") return matchesSearch && sub.isActive;
    if (statusFilter === "unsubscribed") return matchesSearch && !sub.isActive;
    return matchesSearch;
  });

  const exportToCSV = () => {
    if (subscribers.length === 0) return;

    const headers = ["Email,Status,Subscribed Date\n"];
    const rows = filteredSubscribers.map((sub) => {
      const date = new Date(
        sub.subscribedAt || sub.createdAt,
      ).toLocaleDateString();
      const status = sub.isActive ? "Active" : "Unsubscribed";
      return `"${sub.email}",${status},"${date}"`;
    });

    const blob = new Blob([headers.concat(rows.join("\n")).join("")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `subscribers_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const unsubscribedCount = subscribers.filter((s) => !s.isActive).length;

  return (
    <motion.div
      className="admin-subscribers-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Header */}
      <motion.div className="admin-sub-header" variants={itemVariants}>
        <div>
          <h2>Subscriber Management</h2>
          <p>Monitor dispatch subscriptions, status, and mailing analytics.</p>
        </div>
        <div className="admin-sub-actions">
          <motion.button
            onClick={fetchSubscribers}
            className="btn-secondary"
            title="Refresh List"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FontAwesomeIcon icon={faRefresh} spin={loading} /> Refresh
          </motion.button>
          <motion.button
            onClick={exportToCSV}
            className="btn-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FontAwesomeIcon icon={faDownload} /> Export CSV
          </motion.button>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div className="sub-metrics-grid" variants={itemVariants}>
        <motion.div
          className="metric-card"
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <FontAwesomeIcon icon={faUsers} className="metric-icon" />
          <div>
            <h3>{subscribers.length}</h3>
            <span>Total Readers</span>
          </div>
        </motion.div>

        <motion.div
          className="metric-card active-card"
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="metric-icon green" />
          <div>
            <h3>{activeCount}</h3>
            <span>Active Subscriptions</span>
          </div>
        </motion.div>

        <motion.div
          className="metric-card unsub-card"
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <FontAwesomeIcon icon={faTimesCircle} className="metric-icon red" />
          <div>
            <h3>{unsubscribedCount}</h3>
            <span>Opted Out</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div className="admin-sub-toolbar" variants={itemVariants}>
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter-buttons">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={statusFilter === "all" ? "active" : ""}
            onClick={() => setStatusFilter("all")}
          >
            All ({subscribers.length})
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={statusFilter === "active" ? "active" : ""}
            onClick={() => setStatusFilter("active")}
          >
            Active ({activeCount})
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={statusFilter === "unsubscribed" ? "active" : ""}
            onClick={() => setStatusFilter("unsubscribed")}
          >
            Unsubscribed ({unsubscribedCount})
          </motion.button>
        </div>
      </motion.div>

      {/* Error Feedback */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="admin-sub-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscribers Data Table */}
      <motion.div className="table-responsive-wrapper" variants={itemVariants}>
        <table className="subscribers-table">
          <thead>
            <tr>
              <th>Email Address</th>
              <th>Status</th>
              <th>Subscribed On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="table-loading">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="spinner-icon"
                  />
                  Loading subscribers...
                </td>
              </tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan="4" className="table-empty">
                  No subscribers match your current query or filter.
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredSubscribers.map((sub) => (
                  <motion.tr
                    key={sub._id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <td className="email-cell">{sub.email}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          sub.isActive ? "status-active" : "status-inactive"
                        }`}
                      >
                        {sub.isActive ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(
                        sub.subscribedAt || sub.createdAt,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="actions-cell">
                      {sub.isActive && (
                        <motion.button
                          className="action-btn opt-out-btn"
                          title="Unsubscribe Reader"
                          onClick={() => openUnsubscribeModal(sub)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FontAwesomeIcon icon={faUserSlash} />
                          <span>Unsubscribe</span>
                        </motion.button>
                      )}

                      <motion.button
                        className="action-btn delete-btn"
                        title="Permanently Delete Record"
                        onClick={() => openDeleteModal(sub)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                        <span>Delete</span>
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Website Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="modal-close-btn"
                onClick={closeModal}
                disabled={Boolean(actionLoadingId)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </motion.button>

              <div className="modal-header">
                <div
                  className={`modal-icon-badge ${
                    confirmModal.type === "delete" ? "danger" : "warning"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      confirmModal.type === "delete"
                        ? faTrashCan
                        : faExclamationTriangle
                    }
                  />
                </div>
                <h3>
                  {confirmModal.type === "delete"
                    ? "Delete Subscriber"
                    : "Unsubscribe Reader"}
                </h3>
              </div>

              <div className="modal-body">
                <p>
                  Are you sure you want to{" "}
                  <strong>
                    {confirmModal.type === "delete"
                      ? "permanently delete"
                      : "unsubscribe"}
                  </strong>{" "}
                  <span className="highlight-email">
                    {confirmModal.item?.email}
                  </span>
                  ?
                </p>
                {confirmModal.type === "delete" ? (
                  <span className="modal-warning-text">
                    This action will remove the record completely from your
                    MongoDB cluster and cannot be undone.
                  </span>
                ) : (
                  <span className="modal-warning-text">
                    This will set the subscriber status to inactive. You can
                    re-subscribe them later if needed.
                  </span>
                )}
              </div>

              <div className="modal-footer">
                <motion.button
                  className="btn-modal-cancel"
                  onClick={closeModal}
                  disabled={Boolean(actionLoadingId)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={`btn-modal-confirm ${
                    confirmModal.type === "delete"
                      ? "btn-danger"
                      : "btn-warning"
                  }`}
                  disabled={Boolean(actionLoadingId)}
                  onClick={
                    confirmModal.type === "delete"
                      ? handleDeleteConfirm
                      : handleUnsubscribeConfirm
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {actionLoadingId ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Processing...
                    </>
                  ) : confirmModal.type === "delete" ? (
                    "Yes, Delete Record"
                  ) : (
                    "Yes, Unsubscribe"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
