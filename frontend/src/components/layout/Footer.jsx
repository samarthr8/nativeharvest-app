import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/NH-Logo-Old-Transparent-Cropped-2.png";

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault(); // prevent immediate mailto trigger
    try {
      await navigator.clipboard.writeText(
        "nativeharvestindia@gmail.com"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
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
              onMouseEnter={(e) => {
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 8px rgba(255,255,255,0.35))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
              }}
            />
          </div>

          <p>
            Premium farm-made traditional foods from rural India.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 style={{ marginBottom: "16px" }}>Quick Links</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/" style={{ color: "white", opacity: 0.9 }}>
              Home
            </Link>
            <Link to="/products" style={{ color: "white", opacity: 0.9 }}>
              Products
            </Link>
            <Link to="/about" style={{ color: "white", opacity: 0.9 }}>
              About
            </Link>
            <Link to="/contact" style={{ color: "white", opacity: 0.9 }}>
              Contact
            </Link>
          </div>
        </div>

        {/* POLICIES */}
        <div>
          <h4 style={{ marginBottom: "16px" }}>Policies</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ opacity: 0.9 }}>Privacy Policy</p>
            <p style={{ opacity: 0.9 }}>Terms & Conditions</p>
          </div>
        </div>

        {/* STORE INFO */}
        <div>
          <h4 style={{ marginBottom: "16px" }}>Our Store</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ opacity: 0.9 }}>
              Chhatarpur, Madhya Pradesh
            </p>

            {/* Premium Email Interaction */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: 0.9
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

              <a
                href="mailto:nativeharvestindia@gmail.com"
                onClick={handleCopy}
                style={{
                  color: "white",
                  textDecoration: "none",
                  position: "relative",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter =
                    "drop-shadow(0 0 6px rgba(255,255,255,0.5))";
                  e.currentTarget.querySelector("span").style.width = "100%";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "none";
                  e.currentTarget.querySelector("span").style.width = "0%";
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
                    width: "0%",
                    background: "white",
                    transition: "width 0.3s ease"
                  }}
                />
              </a>

              {/* Copied Feedback */}
              {copied && (
                <span
                  style={{
                    fontSize: "12px",
                    opacity: 0.8,
                    marginLeft: "6px",
                    transition: "0.3s ease"
                  }}
                >
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thin Divider */}
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
