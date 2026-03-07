import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
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
          <h1 style={{ color: "#2f6f4e", marginBottom: "16px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#555", marginBottom: "24px", maxWidth: "400px" }}>
            We're sorry for the inconvenience. Please try refreshing the page or go back to the homepage.
          </p>
          <a
            href="/"
            style={{
              background: "#2f6f4e",
              color: "white",
              padding: "12px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Go to Homepage
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
