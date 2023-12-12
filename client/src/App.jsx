import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import NavbarLogin from './components/NavbarLogin';
import Header from './components/Header';
import AllRecipes from './components/AllRecipes';
import Login from './components/Login';
import Footer from './components/Footer';

export default function App() {
  return (
    <div id="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Header title="Browse Recipes" />
              <AllRecipes />
              <Footer />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <NavbarLogin />
              <Login />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
