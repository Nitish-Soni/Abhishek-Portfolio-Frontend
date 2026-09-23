import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import PublicAPI from "../../services/PublicAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Fallback email extractor if React Router hooks fail
  const rawQuery = new URLSearchParams(
    location.search || window.location.search,
  );
  const email = searchParams.get("email") || rawQuery.get("email");

  const [status, setStatus] = useState("processing"); // 'processing' | 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!email) {
      if (isMounted) {
        setStatus("error");
        setMessage("No email address provided in the unsubscribe link.");
      }
      return;
    }

    console.log("🔍 Triggering unsubscribe for:", email);

    PublicAPI.unsubscribeNewsletter(email)
      .then((res) => {
        if (isMounted) {
          setStatus("success");
          setMessage(
            res?.data?.message ||
              `Successfully unsubscribed ${email} from The Dispatch.`,
          );
        }
      })
      .catch((err) => {
        console.error("❌ Unsubscribe API Error:", err);
        if (isMounted) {
          setStatus("error");
          setMessage(
            err.response?.data?.message ||
              err.message ||
              "Failed to process unsubscribe request.",
          );
        }
      });

    return () => {
      isMounted = false;
    };
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
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Georgia', serif",
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
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
            <h2 style={{ fontSize: "20px", margin: "0 0 8px 0" }}>
              Unsubscribing...
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
              Processing request for{" "}
              <strong style={{ color: "#fff" }}>
                {email || "your address"}
              </strong>
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
            <h2 style={{ fontSize: "22px", margin: "0 0 12px 0" }}>
              Subscription Cancelled
            </h2>
            <p
              style={{
                color: "#d1d5db",
                margin: "0 0 24px 0",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              {message}
            </p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                color: "#cc3a63",
                textDecoration: "underline",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Return to The Dispatch
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
            <h2 style={{ fontSize: "22px", margin: "0 0 12px 0" }}>Notice</h2>
            <p
              style={{
                color: "#d1d5db",
                margin: "0 0 24px 0",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              {message}
            </p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                color: "#cc3a63",
                textDecoration: "underline",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Return to The Dispatch
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
