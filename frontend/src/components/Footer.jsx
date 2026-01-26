export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} NativeHarvest</p>
      <p>Farm fresh. Pure. Honest.</p>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "60px",
    padding: "30px",
    background: "#F1F8E9",
    textAlign: "center"
  }
};

