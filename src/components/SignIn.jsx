import { useState } from "react";
import useAuth from "../utils/useAuth.js";
import axios from "axios";
import "../pages/AuthPage/AuthPage.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("/api/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Saves the token in localStorage
        login();
        // Redirect to journal
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response.data.errors[0].msg);
      console.error("Error logging in:", error);
      alert(
        "Sign-in was unsuccessful. Try using a different email or password, or create a new account."
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign In</h2>
        <div>
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </>
  );
}
