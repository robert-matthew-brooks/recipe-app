import { useEffect, useRef, useState } from 'react';
import { getIngredients } from '../../util/api';
import CrossBtn from '../CrossBtn';
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
  const filterRef = useRef(null);
  const [isFilterHidden, setIsFilterHidden] = useState(true);
  const searchRef = useRef(null);
  const [searchBoxValue, setSearchBoxValue] = useState(filterName);

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
        id="RecipeFilter__accordion"
        data-test="RecipeFilter-accordion"
        className={isFilterHidden ? '' : 'RecipeFilter__accordion--active'}
        onClick={toggleFilter}
      >
        Filter
      </div>

      <div id="RecipeFilter__panel__wrapper" ref={filterRef}>
        <div id="RecipeFilter__panel" data-test="RecipeFilter-panel">
          <div id="RecipeFilter__search-box__wrapper">
            <input
              id="RecipeFilter__search-box"
              data-test="filter-search"
              ref={searchRef}
              type="text"
              value={searchBoxValue}
              onChange={(evt) => {
                setSearchBoxValue(evt.target.value);
              }}
              placeholder="Recipe name..."
            />
            <CrossBtn size={1.2} cb={clearSearchbox} hidden={!searchBoxValue} />
          </div>

          <select
            data-test="filter-sort-dropdown"
            className="RecipeFilter__dropdown"
            value={filterOrderBy}
            onChange={(evt) => {
              setFilterOrderBy(
                evt.target.options[evt.target.selectedIndex].value
              );
            }}
          >
            <option value="new">Newest First</option>
            <option value="top">Top Rated</option>
            <option value="az">Alphabetical A-Z</option>
            <option value="za">Alphabetical Z-A</option>
          </select>

          <select
            data-test="filter-ingredients-dropdown"
            className="RecipeFilter__dropdown"
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
            id="RecipeFilter__ingredients-list"
            data-test="filter-ingredients-list"
            className={
              filterIngredients.length === 0
                ? 'RecipeFilter__ingredients-list--hidden'
                : undefined
            }
          >
            {filterIngredients.map((ingredient, i) => {
              return (
                <li key={i}>
                  {ingredient.name}
                  <CrossBtn
                    light={true}
                    size={1.1}
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
