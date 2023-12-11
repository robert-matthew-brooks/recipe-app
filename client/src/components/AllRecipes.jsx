import { useState } from 'react';
import RecipeCards from './RecipeCards';
import './AllRecipes.css';
import RecipeFilter from './RecipeFilter';

export default function AllRecipes() {
  const [filterIngredients, setFilterIngredients] = useState([]);

  return (
    <section id="AllRecipes">
      <div id="AllRecipes--inner" className="inner">
        <RecipeFilter {...{ filterIngredients, setFilterIngredients }} />
        <RecipeCards {...{ filterIngredients }} />
      </div>
    </section>
  );
}
