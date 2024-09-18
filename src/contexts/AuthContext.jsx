import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Checks localStorage for token
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("User logged out");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  console.log("Providing context:", { isAuthenticated, logout });

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
