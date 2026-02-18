import { Link } from "react-router-dom";

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
        {/* BRAND SECTION */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px"
            }}
          >
            {/* Inline SVG Logo */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                stroke="white"
                strokeWidth="3"
              />
              <path
                d="M25 55C35 45 65 45 75 55"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M25 65C40 55 60 55 75 65"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="50" cy="40" r="6" fill="white" />
            </svg>

            <h3
              style={{
                margin: 0,
                fontFamily: "Playfair Display, serif"
              }}
            >
              NativeHarvest
            </h3>
          </div>

          <p>
            Premium farm-made traditional foods from rural India.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4>Quick Links</h4>
          <p><Link to="/">Home</Link></p>
          <p><Link to="/products">Products</Link></p>
          <p><Link to="/about">About</Link></p>
          <p><Link to="/contact">Contact</Link></p>
        </div>

        {/* POLICIES */}
        <div>
          <h4>Policies</h4>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>
        </div>

        {/* STORE INFO */}
        <div>
          <h4>Our Store</h4>
          <p>Chhatarpur, Madhya Pradesh</p>
          <p>Email: nativeharvestindia@gmail.com</p>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
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
