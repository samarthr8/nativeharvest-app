const Footer = () => {
  return (
    <footer style={{
      background: "var(--green-dark)",
      color: "white",
      padding: "60px 0"
    }}>
      <div className="container" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
        gap: "40px"
      }}>

        <div>
          <h3>NativeHarvest</h3>
          <p>Premium farm-made traditional foods from rural India.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p>Home</p>
          <p>Products</p>
          <p>About</p>
          <p>Contact</p>
        </div>

        <div>
          <h4>Policies</h4>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>
        </div>

        <div>
          <h4>Our Store</h4>
          <p>Chhatarpur, Madhya Pradesh</p>
          <p>Email: nativeharvestindia@gmail.com</p>
        </div>

      </div>

      <div style={{
        textAlign: "center",
        marginTop: "40px",
        opacity: "0.7",
        fontSize: "14px"
      }}>
        © 2026 NativeHarvest India. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
