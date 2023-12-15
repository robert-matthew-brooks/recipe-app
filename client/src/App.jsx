import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Recipes from './components/Recipes';
import AuthRegister from './components/AuthRegister';
import AuthLogin from './components/AuthLogin';
import SimpleMsg from './components/SimpleMsg';
import Footer from './components/Footer';

export default function App() {
  return (
    <div id="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to={{ pathname: '/recipes' }} />} />

        <Route path="/register" element={<AuthRegister />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route
          path="/logout"
          element={
            <SimpleMsg
              title="Signed Out"
              msg="Hope to see you again soon!"
              linkText="Back to Recipes"
              linkHref="/recipes"
            />
          }
        />

        <Route path="/recipes" element={<Recipes />} />

        <Route
          path="*"
          element={
            <SimpleMsg
              title="Oops!"
              msg="Sorry, the page you're looking for doesn't exist! &#9785;"
              linkText="Back to Recipes"
              linkHref="/recipes"
            />
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}
