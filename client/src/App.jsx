import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Recipes from './components/Recipes';
import AuthRegister from './components/AuthRegister';
import AuthLogin from './components/AuthLogin';
import AuthLogout from './components/AuthLogout';
import Footer from './components/Footer';

export default function App() {
  return (
    <div id="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to={{ pathname: '/recipes' }} />} />

        <Route path="/register" element={<AuthRegister />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/logout" element={<AuthLogout />} />

        <Route path="/recipes" element={<Recipes />} />

        <Route path="*" element={<p>&#9785; 404 HERE</p>} />
      </Routes>

      <Footer />
    </div>
  );
}
