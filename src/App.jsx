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
        {isAuthenticated && <Navigation />}
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Freewriter /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/entries/:entryId?"
            element={
              isAuthenticated ? <Freewriter /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/journal"
            element={
              isAuthenticated ? <Journal /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/auth"
            element={
              !isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </Router>
  );
}

export default App;
