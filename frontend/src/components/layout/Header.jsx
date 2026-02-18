import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  /* Detect scroll for transparency effect */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
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
          ? "rgba(255,255,255,0.95)"
          : "rgba(255,255,255,0.75)",
        boxShadow: scrolled
          ? "0 2px 10px rgba(0,0,0,0.06)"
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
          alignItems: "center"
        }}
      >
        {/* BRAND LOGO (Micro animation) */}
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
            lineHeight: "1.1",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
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

        {/* NAVIGATION */}
        <nav
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center"
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

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
                  textDecoration: "none",
                  position: "relative",
                  paddingBottom: "6px",
                  transition: "color 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--green-main)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive
                    ? "var(--green-dark)"
                    : "#1e1e1e";
                }}
              >
                {item.name}

                {/* Animated underline */}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: isActive ? "100%" : "0%",
                    height: "2px",
                    background: "var(--green-dark)",
                    transition: "width 0.3s ease"
                  }}
                  className="nav-underline"
                />
              </Link>
            );
          })}

          {/* CART ICON */}
          <Link
            to="/cart"
            style={{
              fontSize: "20px",
              color: "#1e1e1e",
              textDecoration: "none",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.color = "var(--green-main)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#1e1e1e";
            }}
          >
            🛒
          </Link>
        </nav>
      </div>
    </header>
  );
}
