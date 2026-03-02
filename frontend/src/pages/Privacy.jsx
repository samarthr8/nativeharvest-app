const Privacy = () => {
  return (
    <div style={{ background: "#f5f7f6", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        padding: "50px 40px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        color: "#333"
      }}>
        
        <h1 style={{ color: "#2f6f4e", marginBottom: "20px", fontSize: "32px" }}>
          Privacy Policy
        </h1>
        
        <p style={{ opacity: 0.6, fontSize: "14px", marginBottom: "30px" }}>
          Last Updated: March 2026
        </p>

        <div style={{ lineHeight: "1.7", fontSize: "15px", color: "#444", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <p>
            At NativeHarvest India LLP, we value your trust and respect your privacy. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.
          </p>

          <h3 style={{ color: "#1e1e1e", marginTop: "10px" }}>1. Information We Collect</h3>
          <p>
            When you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, email address, and phone number. We refer to this information as "Order Information."
          </p>

          <h3 style={{ color: "#1e1e1e", marginTop: "10px" }}>2. Payment Security</h3>
          <p>
            <strong>We do not store your credit card or UPI details.</strong> All payment transactions are processed through Razorpay, a secure and encrypted third-party payment gateway that complies with the highest industry standards for security.
          </p>

          <h3 style={{ color: "#1e1e1e", marginTop: "10px" }}>3. How We Use Your Information</h3>
          <p>
            We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to communicate with you and screen our orders for potential risk or fraud.
          </p>

          <h3 style={{ color: "#1e1e1e", marginTop: "10px" }}>4. Sharing Your Personal Information</h3>
          <p>
            We share your Personal Information only with third parties necessary to fulfill your order, such as our shipping and courier partners. We may also share your Personal Information to comply with applicable laws and regulations, or to respond to a lawful request for information we receive. We will never sell your personal data to marketing agencies.
          </p>

          <h3 style={{ color: "#1e1e1e", marginTop: "10px" }}>5. Contact Us</h3>
          <p>
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by email at <strong>nativeharvestindia@gmail.com</strong> or by mail at NativeHarvest India LLP, Chhatarpur, Madhya Pradesh, India.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Privacy;