import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
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
  filterIsFavourites,
  setFilterIsFavourites,
  filterIsVegetarian,
  setFilterIsVegetarian,
  setIsLoading,
}) {
  const { activeUser } = useContext(UserContext);
  const [allIngredients, setAllIngredients] = useState([]);
  const panelRef = useRef(null);
  const [isPanelHidden, setIsPanelHidden] = useState(true);
  const searchRef = useRef(null);
  const [searchBoxValue, setSearchBoxValue] = useState(filterName);
  const [isSignedInErr, setIsSignedInErr] = useState(false);

  useEffect(() => {
    (async () => {
      setAllIngredients(await getIngredients());
    })();
  }, []);

  const togglePanel = async () => {
    const panelDiv = panelRef.current;
    panelDiv.style.maxHeight = `${panelDiv.scrollHeight}px`; // set to absolute value, can't animate to zero from 'fit-content'
    panelDiv.offsetHeight; // wait for next animation frame

    if (isPanelHidden) {
      setIsPanelHidden(false);
    } else {
      panelDiv.style.maxHeight = '0px';
      setIsPanelHidden(true);
    }

    panelDiv.addEventListener(
      'transitionend',
      () => {
        if (panelDiv.offsetHeight > 0) {
          panelDiv.style.maxHeight = 'fit-content'; // allow content size to change if not closed
        }
      },
      { once: true }
    );
  };

  const handleFavouritesToggle = () => {
    if (!filterIsFavourites && !activeUser) {
      setIsSignedInErr(true);
    } else {
      setFilterIsFavourites(!filterIsFavourites);
    }
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

  const removeIngredientFromFilter = (which) => {
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
        data-test="filter-accordion"
        className={isPanelHidden ? '' : 'RecipeFilter__accordion--active'}
        onClick={togglePanel}
      >
        Search Options
      </div>

      <div id="RecipeFilter__panel__wrapper" ref={panelRef}>
        <div id="RecipeFilter__panel" data-test="filter-panel">
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
            <CrossBtn
              size={1.2}
              callback={clearSearchbox}
              hidden={!searchBoxValue}
            />
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

          {!isSignedInErr ? (
            <label
              data-test="filter-favourites"
              className="RecipeFilter__checkbox"
            >
              <input
                type="checkbox"
                checked={filterIsFavourites}
                onChange={handleFavouritesToggle}
              />
              <span></span>
              Favourites Only
            </label>
          ) : (
            <p data-test="favourites-err" className="err">
              <Link to="/login">Sign in</Link> to use favourites
            </p>
          )}

          <label
            data-test="filter-vegetarian"
            className="RecipeFilter__checkbox"
          >
            <input
              type="checkbox"
              checked={filterIsVegetarian}
              onChange={() => {
                setFilterIsVegetarian(!filterIsVegetarian);
              }}
            />
            <span></span>
            Vegetarian Only
          </label>

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
                    style="light"
                    size={1.1}
                    callback={() => {
                      removeIngredientFromFilter(i);
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
