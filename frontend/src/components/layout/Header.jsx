import { Link } from "react-router-dom";
import logo from "../../assets/logo-horizontal.png";

const Header = () => {
  return (
    <header style={{
      background: "#ffffff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        height: "75px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="NativeHarvest"
            style={{ height: "42px" }}
          />
        </Link>

        {/* Navigation */}
        <nav style={{
          display: "flex",
          gap: "32px",
          fontSize: "16px",
          fontWeight: "500"
        }}>
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/products">Products</Link>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/contact">Contact</Link>
          <Link className="nav-link" to="/cart">Cart</Link>
        </nav>

      </div>
    </header>
  );
};

export default Header;
