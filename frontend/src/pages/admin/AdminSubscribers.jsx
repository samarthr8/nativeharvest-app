import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);
  
  // Email Blast State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const greenBtn = { background: "#2f6f4e", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "500", transition: "0.2s ease" };

  useEffect(() => { loadSubscribers(); }, []);

  const loadSubscribers = () => api.get("/admin/subscribers").then(res => setSubscribers(res.data)).catch(console.error);

  const sendBlast = async () => {
    if (!subject || !message) return alert("Subject and message are required.");
    if (!window.confirm(`Send this email to ${subscribers.length} subscribers?`)) return;

    setIsSending(true);
    try {
      const res = await api.post("/admin/subscribers/blast", { subject, message });
      alert(`✅ Email sent successfully to ${res.data.count} subscribers!`);
      setSubject("");
      setMessage("");
    } catch (err) {
      alert("Failed to send email blast.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f5f7f6", minHeight: "100vh" }}>
      <AdminNavbar />

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* --- SUBSCRIBER TABLE --- */}
        <div style={{ flex: "1 1 500px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h3>Subscriber List ({subscribers.length})</h3>
          
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#f0f4f2" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>#</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Source</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Date Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.slice(0, visibleCount).map((sub, i) => (
                <tr key={sub.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{i + 1}</td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{sub.email}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: "11px", background: sub.source === 'checkout' ? "#e3f2fd" : "#e8f3ee", color: sub.source === 'checkout' ? "#1565c0" : "#2e7d32", padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                      {sub.source}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#666" }}>{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {subscribers.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>No subscribers yet.</div>}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {visibleCount < subscribers.length && <button style={{ ...greenBtn, marginRight: "10px" }} onClick={() => setVisibleCount(prev => prev + 15)}>Load 15 More</button>}
            {visibleCount > 15 && <button style={{ ...greenBtn, background: "#777" }} onClick={() => setVisibleCount(15)}>Show Less</button>}
          </div>
        </div>

        {/* --- PROMOTIONAL EMAIL COMPOSER --- */}
        <div style={{ flex: "1 1 350px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h3>Send Promotional Email</h3>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>Blast a message to all {subscribers.length} subscribers at once.</p>

          <input 
            placeholder="Email Subject (e.g., Big Diwali Sale!)" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc" }}
          />

          <textarea 
            placeholder="Write your message here... (Line breaks will be preserved)" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "100%", padding: "10px", height: "150px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", fontFamily: "inherit" }}
          />

          <button 
            style={{ ...greenBtn, width: "100%", padding: "12px", background: isSending ? "#777" : "#2f6f4e" }} 
            onClick={sendBlast} 
            disabled={isSending || subscribers.length === 0}
          >
            {isSending ? "Sending Blast..." : `Send to ${subscribers.length} Subscribers`}
          </button>
        </div>

      </div>
    </div>
  );
}