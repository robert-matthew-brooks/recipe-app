import './App.css';
import Navbar from './components/Navbar';
import Header from './components/Header';
import AllRecipes from './components/AllRecipes';
import Footer from './components/Footer';

export default function App() {
  return (
    <div id="App">
      <Navbar />

      <Header title="Browse Recipes" />
      <AllRecipes />

      <Footer />
    </div>
  );
}
