import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{
      height: "75px",
      display: "flex",
      alignItems: "center",
      background: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>

        <Link to="/" style={{
          fontFamily: "Playfair Display",
          fontSize: "22px",
          textDecoration: "none",
          color: "var(--text-dark)"
        }}>
          NativeHarvest
        </Link>

        <nav style={{ display: "flex", gap: "30px" }}>
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
