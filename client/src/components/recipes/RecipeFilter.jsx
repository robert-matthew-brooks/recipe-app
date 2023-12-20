import { useEffect, useRef, useState } from 'react';
import { getIngredients } from '../../util/api';
import CrossBtn from '../CrossBtn';
import './RecipeFilter.css';

export default function RecipeFilter({
  setFilterName,
  filterOrderBy,
  setFilterOrderBy,
  filterIngredients,
  setFilterIngredients,
  setIsLoading,
}) {
  const [allIngredients, setAllIngredients] = useState([]);
  const filterRef = useRef(null);
  const [isFilterHidden, setIsFilterHidden] = useState(true);
  const searchRef = useRef(null);
  const [searchBoxValue, setSearchBoxValue] = useState('');

  useEffect(() => {
    (async () => {
      setAllIngredients(await getIngredients());
    })();
  }, []);

  const toggleFilter = async () => {
    const filterDiv = filterRef.current;
    filterDiv.style.maxHeight = `${filterDiv.scrollHeight}px`; // set to absolute value, can't animate to zero from 'fit-content'
    filterDiv.offsetHeight; // wait for next animation frame

    if (isFilterHidden) {
      setIsFilterHidden(false);
    } else {
      filterDiv.style.maxHeight = '0px';
      setIsFilterHidden(true);
    }

    filterDiv.addEventListener(
      'transitionend',
      () => {
        if (filterDiv.offsetHeight > 0) {
          filterDiv.style.maxHeight = 'fit-content'; // allow content size to change if not closed
        }
      },
      { once: true }
    );
  };

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

  const clearSearchbox = () => {
    setSearchBoxValue('');
    searchRef.current.focus();
  };

  const addIngredientToFilter = (ingredientId) => {
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
      <div
        id="RecipeFilter--accordion"
        className={isFilterHidden ? '' : 'RecipeFilter--accordion--active'}
        onClick={toggleFilter}
      >
        Filter
      </div>

      <div id="RecipeFilter--panel--wrapper" ref={filterRef}>
        <div id="RecipeFilter--panel">
          <div id="RecipeFilter--search-box--wrapper">
            <input
              id="RecipeFilter--search-box"
              ref={searchRef}
              type="text"
              value={searchBoxValue}
              onChange={(evt) => {
                setSearchBoxValue(evt.target.value);
              }}
              placeholder="Recipe name..."
            />
            <CrossBtn
              size="1.2rem"
              cb={clearSearchbox}
              hidden={!searchBoxValue}
            />
          </div>

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
            <option value="az">Alphabetical A-Z</option>
            <option value="za">Alphabetical Z-A</option>
          </select>

          <select
            className="RecipeFilter--dropdown"
            defaultValue=""
            onChange={(evt) => {
              addIngredientToFilter(+evt.target.value);
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
                  <CrossBtn
                    light="true"
                    size="1.1rem"
                    cb={() => {
                      removeIngredient(i);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
