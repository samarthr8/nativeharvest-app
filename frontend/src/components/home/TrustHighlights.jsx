export default function TrustHighlights() {
  return (
    <section 
      style={{ 
        background: "#f0f8f5", 
        padding: "40px 0", 
        borderBottom: "1px solid #e2eee8" 
      }}
    >
      <div 
        className="container" 
        style={{
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          textAlign: "center", 
          gap: "30px", 
          fontSize: "16px", 
          fontWeight: "600", 
          color: "#2f6f4e"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22v-7l-2-2"/><path d="M12 15l2-2"/><path d="M12 8a4 4 0 0 0-4-4 4 4 0 0 0-4 4c0 2 2 4 4 4h4z"/><path d="M12 8a4 4 0 0 1 4-4 4 4 0 0 1 4 4c0 2-2 4-4 4h-4z"/>
          </svg>
          Farm Fresh
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 4 13c0-3.5 3-7 8-11 5 4 8 7.5 8 11a7 7 0 0 1-7 7z"/><path d="M11 20v-6"/>
          </svg>
          No Preservatives
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Traditional Methods
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          Pan India Delivery
        </div>
      </div>
    </section>
  );
}