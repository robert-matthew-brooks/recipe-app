import { useEffect, useState } from 'react';
import { getIngredients } from '../../util/api';
import closeImg from '../../assets/close.svg';
import './RecipeFilter.css';

export default function RecipeFilter({
  filterName,
  setFilterName,
  filterOrderBy,
  setFilterOrderBy,
  filterIngredients,
  setFilterIngredients,
  setIsLoading,
}) {
  const [allIngredients, setAllIngredients] = useState([]);
  const [searchBoxValue, setSearchBoxValue] = useState('');

  useEffect(() => {
    (async () => {
      setAllIngredients(await getIngredients());
    })();
  }, []);

  useEffect(() => {
    // debounce search box input
    // update typed value immediately
    // but wait a bit (for user to stop typing)
    // before updating the value that triggers api call in Recipes.jsx

    setIsLoading(true);

    const filterNameDebounce = setTimeout(() => {
      setFilterName(searchBoxValue);
    }, 1000);

    return () => {
      clearTimeout(filterNameDebounce);
    };
  }, [searchBoxValue]);

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
        value={searchBoxValue}
        onChange={(evt) => {
          setSearchBoxValue(evt.target.value);
        }}
        placeholder="Recipe name..."
      />

      <div className="RecipeFilter--dropdown-wrapper">
        <select
          value={filterOrderBy}
          onChange={(evt) => {
            setFilterOrderBy(
              evt.target.options[evt.target.selectedIndex].value
            );
          }}
          className="RecipeFilter--dropdown"
        >
          <option value="new">Newest First</option>
          <option value="top">Top Rated</option>
          <option value="fav">My Favourites</option>
          <option value="az">Alphabetical A-Z</option>
          <option value="za">Alphabetical Z-A</option>
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
