import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={nav}>
      <h2>NativeHarvest</h2>
      <div style={links}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

const nav = {
  background: "#1b5e20",
  color: "white",
  padding: "16px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const links = {
  display: "flex",
  gap: "24px",
  fontWeight: 500
};