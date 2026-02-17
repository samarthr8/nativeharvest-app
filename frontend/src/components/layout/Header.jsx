import { Link } from "react-router-dom";
import logo from "../../assets/logo-horizontal.png"; 
// 👆 Put your horizontal logo inside:
// src/assets/logo-horizontal.png

const Header = () => {
  return (
    <header
      style={{
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        height: "75px",
        display: "flex",
        alignItems: "center"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* LOGO */}
        <Link to="/">
          <img
            src={logo}
            alt="NativeHarvest"
            style={{
              height: "46px",   // 👈 bigger logo
              objectFit: "contain"
            }}
          />
        </Link>

        {/* NAVIGATION */}
        <nav
          style={{
            display: "flex",
            gap: "32px",
            fontWeight: 500
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cart">Cart</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

