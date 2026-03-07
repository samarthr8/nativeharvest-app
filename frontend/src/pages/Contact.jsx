import SEO from "../components/SEO";

export default function Contact() {
  return (
    <div
      style={{
        padding: "60px 20px",
        background: "#f5f7f6",
        minHeight: "100vh"
      }}
    >
      <SEO
        title="Contact Us | NativeHarvest India"
        description="Get in touch with NativeHarvest India for orders, queries, or wholesale inquiries. We'd love to hear from you."
      />
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          padding: "50px",
          borderRadius: "14px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
        }}
      >

        <h1
          style={{
            fontSize: "30px",
            fontWeight: "600",
            marginBottom: "15px",
            color: "#2f6f4e",
            letterSpacing: "0.5px"
          }}
        >
          Contact Us
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.8",
            marginBottom: "35px",
            color: "#555"
          }}
        >
          We’re always happy to help. Whether you have a question about your
          order, our products, or simply want to know more about NativeHarvest —
          feel free to reach out.
        </p>

        {/* Contact Info Blocks */}

        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#2f6f4e"
            }}
          >
            📧 Email
          </h3>
          <p style={{ fontSize: "15px", color: "#333" }}>
            nativeharvestindia@gmail.com
          </p>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#2f6f4e"
            }}
          >
            📱 WhatsApp
          </h3>
          <p style={{ fontSize: "15px", color: "#333" }}>
            94070XXXXX
          </p>
        </div>

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f0f4f2",
            borderRadius: "10px",
            fontSize: "14px",
            lineHeight: "1.7",
            color: "#444"
          }}
        >
          We usually respond within 24 hours.
          <br />
          Thank you for supporting small-batch rural producers 🌾
        </div>

      </div>
    </div>
  );
}