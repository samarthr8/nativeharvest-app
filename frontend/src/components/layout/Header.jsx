import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import logo from "../../assets/NH-Logo-Old-Transparent-Cropped-2.png";

export default function Header() {

  const location = useLocation();
  const { cart } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [showMega, setShowMega] = useState(false);

  const closeTimeoutRef = useRef(null);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  /* ---------------- SCROLL EFFECT ---------------- */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- HOVER HANDLERS ---------------- */

  const handleMouseEnter = () => {

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    setShowMega(true);
  };

  const handleMouseLeave = () => {

    closeTimeoutRef.current = setTimeout(() => {
      setShowMega(false);
    }, 200); // 200ms buffer prevents flicker
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products", mega: true },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <header
      style={{
        height: "75px",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)",
        background: scrolled
          ? "rgba(255,255,255,0.96)"
          : "rgba(255,255,255,0.75)",
        boxShadow: scrolled
          ? "0 2px 12px rgba(0,0,0,0.06)"
          : "none"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative"
        }}
      >

        {/* LEFT BRAND */}
        <Link
          to="/"
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "28px",
            fontWeight: "600",
            letterSpacing: "1px",
            color: "var(--green-dark)",
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            lineHeight: "1.1"
          }}
        >
          NativeHarvest
          <span
            style={{
              fontSize: "13px",
              letterSpacing: "4px",
              fontWeight: "500",
              marginTop: "2px",
              color: "#8b6f5c"
            }}
          >
            INDIA
          </span>
        </Link>

        {/* CENTER LOGO */}
        <Link
          to="/"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center"
          }}
        >
          <img
            src={logo}
            alt="NativeHarvest Logo"
            style={{
              height: "70px",
              width: "auto",
              transition: "0.3s ease",
              cursor: "pointer"
            }}
          />
        </Link>

        {/* RIGHT NAVIGATION */}
        <nav
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
            position: "relative"
          }}
        >
          {navItems.map((item) => {

            const isActive = location.pathname === item.path;

            if (item.mega) {
              return (
                <div
                  key={item.name}
                  style={{ position: "relative" }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.path}
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      color: isActive
                        ? "var(--green-dark)"
                        : "#1e1e1e",
                      textDecoration: "none",
                      position: "relative",
                      paddingBottom: "6px"
                    }}
                  >
                    {item.name}
                  </Link>

                  {showMega && (
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        position: "absolute",
                        top: "35px", // reduced gap
                        left: "-100px",
                        width: "400px",
                        background: "white",
                        padding: "30px",
                        borderRadius: "16px",
                        boxShadow:
                          "0 15px 40px rgba(0,0,0,0.08)",
                        display: "grid",
                        gap: "10px",
                        zIndex: 999
                      }}
                    >
                      <Link to="/products#royal">Pickles</Link>
                      <Link to="/products#orchard">Preserves</Link>
                      <Link to="/products#cold">Oils and Essentials</Link>
                      <Link to="/products#heritage">Heritage Staples</Link>
                      <Link to="/products#indulgence">Healthy Snacks</Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                  color: isActive
                    ? "var(--green-dark)"
                    : "#1e1e1e",
                  textDecoration: "none"
                }}
              >
                {item.name}
              </Link>
            );
          })}

          {/* CART */}
          <Link
            to="/cart"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center"
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              style={{ color: "#1e1e1e" }}
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>

            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-8px",
                  background: "var(--green-dark)",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600"
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

        </nav>

      </div>
    </header>
  );
}