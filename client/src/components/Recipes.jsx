import { useState } from 'react';
import Header from './Header';
import RecipeCards from './RecipeCards';
import RecipeFilter from './RecipeFilter';
import './Recipes.css';

export default function AllRecipes() {
  const [filterIngredients, setFilterIngredients] = useState([]);

  return (
    <>
      <Header title="Browse Recipes" />

      <section id="Recipes">
        <div id="Recipes--inner" className="inner">
          <RecipeFilter {...{ filterIngredients, setFilterIngredients }} />
          <RecipeCards {...{ filterIngredients }} />
        </div>
      </section>
    </>
  );
}
