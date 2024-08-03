import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Freewriter from './pages/Freewriter.jsx';
import Journal from './pages/Journal.jsx';
import SignIn from './pages/SignIn.jsx';
import Navigation from './components/Navigation.jsx';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Freewriter />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  )
}

export default App;
