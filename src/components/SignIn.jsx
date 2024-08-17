import { useState } from "react";
import useAuth from '../utils/useAuth.js';
import axios from "axios";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Saves the token in localStorage
        login();
        // Redirect to journal
        window.location.href = "/journal";
      }
    } catch (err) {
      setError(err.response.data.errors[0].msg);
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign In</h2>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {error && <p>{error}</p>}
    </>
  );
}
