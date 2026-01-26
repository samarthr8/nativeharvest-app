import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="NativeHarvest | Premium Farm Fresh Food from Rural India"
        description="Buy premium farm-made pickles, sattu, mustard oil and traditional rural delicacies directly from NativeHarvest."
      />

      <section style={heroSection}>
        <div style={heroOverlay}>
          <h1>From Our Farms to Your Home</h1>
          <p>
            Premium rural delicacies, crafted in small batches using
            traditional methods.
          </p>
          <a className="btn" href="/products">
            Explore Our Products
          </a>
        </div>
      </section>

      <section className="container">
        <h2>Why NativeHarvest?</h2>
        <div style={featuresGrid}>
          <div style={featureCard}>
            🌾 <strong>Farm Fresh</strong>
            <p>Made directly on farms, not factories.</p>
          </div>
          <div style={featureCard}>
            🥭 <strong>Traditional Recipes</strong>
            <p>Age-old methods preserved with care.</p>
          </div>
          <div style={featureCard}>
            🧡 <strong>Premium Quality</strong>
            <p>No shortcuts. No mass production.</p>
          </div>
        </div>
      </section>
    </>
  );
}

const heroSection = {
  backgroundImage:
    "url(https://images.unsplash.com/photo-1506806732259-39c2d0268443)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "70vh",
  display: "flex",
  alignItems: "center"
};

const heroOverlay = {
  backgroundColor: "rgba(0,0,0,0.55)",
  color: "white",
  padding: "60px",
  maxWidth: "600px",
  marginLeft: "40px"
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "30px"
};

const featureCard = {
  background: "#f1f8e9",
  padding: "20px",
  borderRadius: "8px"
};

