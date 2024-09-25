import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Freewriter from "./pages/Freewriter.jsx";
import Journal from "./pages/Journal.jsx";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import Navigation from "./components/Navigation.jsx";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext.jsx";

function App() {
  console.log("App component rendering");
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navigation className="navigation" />}
        <div className="content">
          <Routes>
            {/* Root path "/" */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Freewriter />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />

            {/* Route for journal entries */}
            <Route
              path="/entries/:entryId?"
              element={
                isAuthenticated ? (
                  <Freewriter />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />

            {/* Journal route */}
            <Route
              path="/journal"
              element={
                isAuthenticated ? <Journal /> : <Navigate to="/auth" replace />
              }
            />

            {/* Auth route for sign-in/sign-up */}
            <Route
              path="/auth"
              element={
                !isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />
              }
            />

            {/* Fallback route for unmatched paths */}
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/" : "/auth"} replace />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
