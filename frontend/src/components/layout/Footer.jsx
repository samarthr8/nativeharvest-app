import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/NH-Logo-Old-Transparent-Cropped-2.png";

const Footer = () => {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(
        "nativeharvestindia@gmail.com"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <footer
      style={{
        background: "var(--green-dark)",
        color: "white",
        padding: "60px 0"
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          gap: "40px"
        }}
      >
        {/* BRAND COLUMN */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "22px"
            }}
          >
            <img
              src={logo}
              alt="NativeHarvest India"
              style={{
                height: "60px",
                width: "auto",
                transition: "0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter =
                  "drop-shadow(0 0 8px rgba(255,255,255,0.35))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.filter = "none")
              }
            />
          </div>

          <p>
            Premium farm-made traditional foods from rural India.
          </p>
        </div>

        {/* QUICK LINKS (Track Order kept here for balance) */}
        <div>
          <h4 style={{ marginBottom: "16px" }}>Quick Links</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/" style={{ color: "white", opacity: 0.9, textDecoration: "none" }}>
              Home
            </Link>
            <Link to="/products" style={{ color: "white", opacity: 0.9, textDecoration: "none" }}>
              Products
            </Link>
            <Link to="/about" style={{ color: "white", opacity: 0.9, textDecoration: "none" }}>
              About
            </Link>
            <Link to="/track" style={{ color: "white", opacity: 0.9, textDecoration: "none" }}>
              Track Order
            </Link>
            <Link to="/contact" style={{ color: "white", opacity: 0.9, textDecoration: "none" }}>
              Contact
            </Link>
          </div>
        </div>

        {/* POLICIES (FAQs moved here for balance) */}
        <div>
          <h4 style={{ marginBottom: "16px" }}>Policies</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/privacy" style={{ color: "white", opacity: 0.9, textDecoration: "none" }}>
              Privacy Policy
            </Link>
            <Link to="/terms" style={{ color: "white", opacity: 0.9, textDecoration: "none" }}>
              Terms & Conditions
            </Link>
            <Link to="/faq" style={{ color: "white", opacity: 0.9, textDecoration: "none" }}>
              FAQs
            </Link>
          </div>
        </div>

        {/* STORE INFO */}
        <div>
          <h4 style={{ marginBottom: "16px" }}>Our Store</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ opacity: 0.9 }}>
              Madhya Pradesh
            </p>

            {/* Premium Email */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                position: "relative"
              }}
            >
              {/* Mail Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{ opacity: 0.8 }}
              >
                <path d="M4 4h16v16H4z" stroke="none" />
                <path d="M4 4l8 7 8-7" />
              </svg>

              {/* Email Link */}
              <a
                href="mailto:nativeharvestindia@gmail.com"
                onClick={handleCopy}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  color: "white",
                  textDecoration: "none",
                  position: "relative",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "0.3s ease",
                  filter: hovered
                    ? "drop-shadow(0 0 6px rgba(255,255,255,0.6))"
                    : "none"
                }}
              >
                nativeharvestindia@gmail.com

                {/* Animated Underline */}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: "-2px",
                    height: "1px",
                    width: hovered ? "100%" : "0%",
                    background: "white",
                    transition: "width 0.3s ease"
                  }}
                />
              </a>

              {/* Copy Icon */}
              <svg
                onClick={handleCopy}
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{
                  cursor: "pointer",
                  opacity: 0.7,
                  transition: "0.3s ease"
                }}
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>

              {/* Tooltip */}
              {(hovered || copied) && (
                <div
                  style={{
                    position: "absolute",
                    top: "-34px",
                    left: "0",
                    background: "rgba(0,0,0,0.85)",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    opacity: copied ? 1 : 0.9,
                    transform: copied
                      ? "translateY(-4px)"
                      : "translateY(0)",
                    transition: "all 0.25s ease"
                  }}
                >
                  {copied ? "✓ Copied to clipboard" : "Click to copy"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.15)",
          marginTop: "40px"
        }}
      />

      {/* COPYRIGHT */}
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          opacity: "0.7",
          fontSize: "14px"
        }}
      >
        © 2026 NativeHarvest India. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;