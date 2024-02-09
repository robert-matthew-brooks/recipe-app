import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollTopBtn from './components/nav/ScrollTopBtn';
import Navbar from './components/nav/Navbar';
import AuthRegister from './components/auth/AuthRegister';
import AuthLogin from './components/auth/AuthLogin';
import AuthLogout from './components/auth/AuthLogout';
import Recipes from './components/recipes/Recipes';
import Recipe from './components/recipe/Recipe';
import EditRecipe from './components/EditRecipe';
import RecipeDeleted from './components/RecipeDeleted';
import Todos from './components/Todos';
import ShoppingList from './components/ShoppingList';
import Profile from './components/profile/Profile';
import ProfileUpdated from './components/profile/ProfileUpdated';
import ProfileDeleted from './components/profile/ProfileDeleted';
import Footer from './components/Footer';
import Missing404 from './components/404';
import Error from './components/Error';
import './App.css';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <div id="App">
      <ScrollTopBtn />
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to={{ pathname: '/recipes' }} />} />

        <Route path="/register" element={<AuthRegister />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/logout" element={<AuthLogout />} />

        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:recipe_slug" element={<Recipe />} />
        <Route path="/edit-recipe" element={<EditRecipe />} />
        <Route path="/recipe-deleted" element={<RecipeDeleted />} />

        <Route path="meal-list" element={<Todos />} />
        <Route path="shopping-list" element={<ShoppingList />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-updated" element={<ProfileUpdated />} />
        <Route path="/profile-deleted" element={<ProfileDeleted />} />

        <Route path="/404" element={<Missing404 />} />
        <Route path="/Error" element={<Error />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>

      <Footer />
    </div>
  );
}
