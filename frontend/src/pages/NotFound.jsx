import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "72px", color: "#2f6f4e", marginBottom: "8px" }}>404</h1>
      <h2 style={{ color: "#333", marginBottom: "16px" }}>Page Not Found</h2>
      <p style={{ color: "#555", marginBottom: "28px", maxWidth: "400px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          background: "#2f6f4e",
          color: "white",
          padding: "12px 28px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
