import { Link } from "react-router-dom";
import logo from "../../assets/NH-Logo-Old-Transparent-Cropped-2.png";

const Footer = () => {
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

            {/* ✅ Properly aligned single-line email */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                opacity: 0.9,
                flexWrap: "nowrap"
              }}
            >
              <span>Email:</span>
              <span
                style={{
                  whiteSpace: "nowrap",
                  wordBreak: "keep-all"
                }}
              >
                nativeharvestindia@gmail.com
              </span>
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
