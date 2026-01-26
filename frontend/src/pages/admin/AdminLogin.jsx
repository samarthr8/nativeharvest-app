import { useState } from "react";
import api from "../../services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/admin/login", {
        email,
        password
      });

      // store token on successful login
      localStorage.setItem("adminToken", res.data.token);

      window.location.href = "/admin/dashboard";
    } catch (err) {
      // IMPORTANT: clear any existing token
      localStorage.removeItem("adminToken");
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h1>Admin Login</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button className="btn" onClick={login}>
        Login
      </button>
    </div>
  );
}

