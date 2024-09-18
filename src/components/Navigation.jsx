import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import useAuth from "../utils/useAuth.js";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    console.log("Navigation component re-rendered, isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    setForceRender(prev => !prev); // Force re-render
  }

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        handleLogout();
      } else {
        const timeUntilExpiration = (decodedToken.exp - currentTime) * 1000;
        setTimeout(() => {
          handleLogout();
        }, timeUntilExpiration);
      }
    }
  }, []);

  return (
    <nav>
      {isAuthenticated ? (
        <>
              <Link to="/">New Freewrite</Link>
      <Link to="/journal">My Journal</Link>
        <button onClick={handleLogout}>Sign Out</button>
        </>
      ) : (
        <Link to="/auth">Sign In/Create an Account</Link>
      )}
    </nav>
  );
}
