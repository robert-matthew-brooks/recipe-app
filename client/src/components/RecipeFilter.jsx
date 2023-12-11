import { useState } from 'react';
import closeImg from '../assets/close.svg';
import './RecipeFilter.css';

export default function RecipeFilter({
  filterIngredients,
  setFilterIngredients,
}) {
  const [allIngredients, setAllIngredients] = useState([
    { id: 1, name: 'Flour' },
    { id: 2, name: 'Sausages' },
    { id: 10, name: 'Corn' },
    { id: 29, name: 'Broccoli' },
  ]);

  const addIngredient = (ingredientId) => {
    const ingredientName = allIngredients.filter((el) => {
      return el.id === ingredientId;
    })[0].name;

    setFilterIngredients([
      ...filterIngredients,
      { id: ingredientId, name: ingredientName },
    ]);
  };

  const removeIngredient = (which) => {
    setFilterIngredients(
      filterIngredients.filter((_el, i) => {
        return which !== i;
      })
    );
  };

  return (
    <div id="RecipeFilter">
      <input
        className="RecipeFilter--search-box"
        type="text"
        placeholder="Recipe name..."
      />

      <div className="RecipeFilter--dropdown-wrapper">
        <select className="RecipeFilter--dropdown">
          <option value="">Newest First</option>
          <option value="">Top Rated</option>
          <option value="">My Favourites</option>
          <option value="">Alphabetical A-Z</option>
          <option value="">Alphabetical Z-A</option>
        </select>

        <select
          className="RecipeFilter--dropdown"
          defaultValue=""
          onChange={(evt) => {
            addIngredient(+evt.target.value);
            evt.target.selectedIndex = 0;
          }}
        >
          <option value="" disabled>
            Ingredients:
          </option>
          {allIngredients
            .filter((ingredient) => {
              return !filterIngredients
                .map((el) => el.id)
                .includes(ingredient.id);
            })
            .map((ingredient) => {
              return (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </option>
              );
            })}
        </select>
      </div>

      <ul
        id="RecipeFilter--ingredients-list"
        className={
          filterIngredients.length === 0
            ? 'RecipeFilter--ingredients-list__hidden'
            : undefined
        }
      >
        {filterIngredients.map((ingredient, i) => {
          return (
            <li key={i}>
              {ingredient.name}
              <button
                className="RecipeFilter--ingredients-list--remove-btn"
                onClick={() => {
                  removeIngredient(i);
                }}
              >
                <img src={closeImg} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
