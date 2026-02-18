import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Cart", path: "/cart" }
  ];

  return (
    <header
      style={{
        height: "75px",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        position: "sticky",
        top: 0,
        zIndex: 1000
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
        {/* PREMIUM TEXT LOGO */}
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
              fontSize: "14px",
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
                  paddingBottom: "4px",
                  transition: "0.2s ease"
                }}
              >
                {item.name}

                {/* Underline Animation */}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: isActive ? "100%" : "0%",
                    height: "2px",
                    background: "var(--green-dark)",
                    transition: "0.3s ease"
                  }}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
