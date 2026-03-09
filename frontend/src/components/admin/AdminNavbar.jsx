import { Link, useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const location = useLocation();

  const greenBtn = {
    background: "#2f6f4e", color: "white", border: "none", padding: "8px 14px",
    borderRadius: "8px", cursor: "pointer", fontWeight: "500", transition: "0.2s ease"
  };

  const glow = (e, on) => e.target.style.boxShadow = on ? "0 0 10px #2f6f4e" : "none";

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Add Product", path: "/admin/add-product" },
    { name: "Products", path: "/admin/products" },
    { name: "Promotions", path: "/admin/promotions" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Subscribers", path: "/admin/subscribers" }, // <-- Add this new link here
  ];

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
      <div>
        <h1 style={{ fontSize: "30px", fontWeight: "600", letterSpacing: "0.6px", marginBottom: "6px", color: "#1f2d2a" }}>
          Admin Dashboard
        </h1>
        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              style={{
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "15px",
                paddingBottom: "4px",
                borderBottom: location.pathname === link.path ? "3px solid #2f6f4e" : "3px solid transparent",
                color: location.pathname === link.path ? "#2f6f4e" : "#555"
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <button style={greenBtn} onMouseOver={(e)=>glow(e,true)} onMouseOut={(e)=>glow(e,false)} onClick={logout}>
        Logout
      </button>
    </div>
  );
}