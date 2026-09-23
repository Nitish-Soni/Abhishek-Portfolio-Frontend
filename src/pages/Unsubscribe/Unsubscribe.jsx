import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PublicAPI from "../../services/PublicAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [status, setStatus] = useState("processing"); // 'processing' | 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email) {
      setStatus("error");
      setMessage("No email address provided in link.");
      return;
    }

    PublicAPI.unsubscribe(email)
      .then(() => {
        setStatus("success");
        setMessage(`Successfully unsubscribed ${email} from The Dispatch.`);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Failed to process unsubscribe request.",
        );
      });
  }, [email]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "var(--bg-primary, #0b0c0e)",
        color: "var(--text-primary, #ffffff)",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#131418",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        {status === "processing" && (
          <>
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              size="2x"
              style={{ color: "#cc3a63", marginBottom: "16px" }}
            />
            <h2>Unsubscribing...</h2>
            <p style={{ color: "#9ca3af" }}>
              Processing your request for {email}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="3x"
              style={{ color: "#10b981", marginBottom: "16px" }}
            />
            <h2>Unsubscribed</h2>
            <p style={{ color: "#d1d5db", margin: "16px 0 24px 0" }}>
              {message}
            </p>
            <Link
              to="/"
              style={{ color: "#cc3a63", textDecoration: "underline" }}
            >
              Return to Home
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              size="3x"
              style={{ color: "#ef4444", marginBottom: "16px" }}
            />
            <h2>Notice</h2>
            <p style={{ color: "#d1d5db", margin: "16px 0 24px 0" }}>
              {message}
            </p>
            <Link
              to="/"
              style={{ color: "#cc3a63", textDecoration: "underline" }}
            >
              Return to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
