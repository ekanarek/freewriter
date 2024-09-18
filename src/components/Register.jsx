import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "/api/register",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
      // Handle successful registration with redirect
      console.log("User registered:", response.data);
      alert("You've created an account! You can now sign in.");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.errors?.[0]?.msg || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Account</button>
    </form>
  );
};

export default Register;
