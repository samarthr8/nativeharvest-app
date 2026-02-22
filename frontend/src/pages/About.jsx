export default function About() {
  return (
    <div
      style={{
        padding: "60px 20px",
        background: "#f5f7f6",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "50px",
          borderRadius: "14px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
        }}
      >

        <h1
          style={{
            fontSize: "32px",
            fontWeight: "600",
            marginBottom: "25px",
            color: "#2f6f4e",
            letterSpacing: "0.5px"
          }}
        >
          Our Story
        </h1>

        <p style={{ lineHeight: "1.8", marginBottom: "20px", fontSize: "15px" }}>
          NativeHarvest was born in the heart of <strong>Bundelkhand</strong>,
          surrounded by the timeless beauty of <strong>Khajuraho</strong> and the
          untouched forests of <strong>Panna</strong>. In these rural landscapes,
          food is not just nourishment — it is tradition, patience, and pride.
        </p>

        <p style={{ lineHeight: "1.8", marginBottom: "20px", fontSize: "15px" }}>
          Growing up in this region, we witnessed how families prepared
          pickles under the sun, pressed mustard oil using age-old wooden
          methods, and ground grains on traditional stones. Every recipe was
          passed down through generations — untouched by shortcuts,
          chemicals, or mass production.
        </p>

        <p style={{ lineHeight: "1.8", marginBottom: "20px", fontSize: "15px" }}>
          NativeHarvest was created with one simple mission:
          <strong> to bring authentic rural Indian flavors directly to modern homes.</strong>
          We work closely with small-batch producers from nearby villages,
          ensuring that every product reflects purity, tradition, and honesty.
        </p>

        <p style={{ lineHeight: "1.8", marginBottom: "20px", fontSize: "15px" }}>
          From sun-ripened mango pickles to cold-pressed mustard oil and
          stone-ground sattu, each item carries the essence of the soil,
          forests, and farming culture of Madhya Pradesh.
        </p>

        <div
          style={{
            marginTop: "35px",
            padding: "25px",
            background: "#f0f4f2",
            borderRadius: "10px",
            fontStyle: "italic",
            fontSize: "15px",
            lineHeight: "1.7"
          }}
        >
          “We believe food should travel from farm to home — not factory to shelf.”
        </div>

      </div>
    </div>
  );
}