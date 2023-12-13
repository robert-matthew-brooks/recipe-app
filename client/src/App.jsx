import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Recipes from './components/Recipes';
import AuthLogin from './components/AuthLogin';
import AuthRegister from './components/AuthRegister';
import Footer from './components/Footer';

export default function App() {
  return (
    <div id="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to={{ pathname: '/recipes' }} />} />

        <Route path="/login" element={<AuthLogin />} />
        <Route path="/register" element={<AuthRegister />} />

        <Route path="/recipes" element={<Recipes />} />

        <Route path="*" element={<p>404 HERE</p>} />
      </Routes>

      <Footer />
    </div>
  );
}
