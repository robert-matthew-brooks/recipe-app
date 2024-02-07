import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Header from './Header';
import TextBtn from './TextBtn';
import { getIngredients, getRecipe } from '../util/api';
import './EditRecipe.css';
import CrossBtn from './CrossBtn';

export default function EditRecipe() {
  const { activeUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allIngredients, setAllIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // new recipe variables
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);

  const handleNameChange = (name) => {
    setName(name);
    setSlug(
      name
        .replace(/[^a-zA-Z\s]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
    );
  };

  const removeIngredient = (id) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        setAllIngredients(await getIngredients());

        const recipe = await getRecipe(searchParams.get('slug'));
        handleNameChange(recipe.name);
        setIngredients(recipe.ingredients);
        setSteps(recipe.steps);
      } catch (err) {
        console.log(err);
        navigate('/error');
      }
      setIsLoading(false);
    })();
  }, []);

  // get recipe name from URL

  // SERVER to provide ingredient ID in recipe

  // STYLE delete button to have RED background
  // instead of light=true, have style=light, style=danger

  // validate inputs, one error message at bottom
  // generate slug??? if not already existing
  // check recipe name/slug doesn't exist (add 2, 3 etc to end of slug)

  return (
    <>
      <Header title="Edit Recipe" />
      <section id="EditRecipe">
        <div id="EditRecipe__inner" className="inner">
          <div className="EditRecipe__input-section">
            <h3 className="EditRecipe__section-title">Name:</h3>
            <input
              type="text"
              value={name}
              onChange={(evt) => {
                handleNameChange(evt.target.value);
              }}
              className="EditRecipe__input"
              disabled={isLoading}
            />
            <p>{`/${slug}`}</p>
          </div>

          <div className="EditRecipe__input-section">
            <h3 className="EditRecipe__section-title">TODO image:</h3>
          </div>

          <div className="EditRecipe__input-section">
            <h3 className="EditRecipe__section-title">Ingredients:</h3>
            <ul className="EditRecipe__ingredients-list">
              {ingredients.map((ingredient, i) => {
                return (
                  <li key={i}>
                    {ingredient.name}
                    {ingredient.units && ` (${ingredient.units})`}:
                    <div className="EditRecipe__ingredients-list__spacer">
                      &nbsp;
                    </div>
                    <input
                      value={ingredient.amount}
                      className="EditRecipe__input EditRecipe__input--small"
                    />{' '}
                    <CrossBtn
                      size={1.1}
                      callback={() => {
                        removeIngredient(ingredient.id);
                      }}
                    />
                  </li>
                );
              })}
            </ul>

            <select className="EditRecipe__dropdown">
              <option value="" disabled>
                Ingredients:
              </option>
              {allIngredients
                .filter((ingredient) => {
                  return !ingredients
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
            <div className="EditRecipe__button-row">
              <TextBtn
                text="Create New"
                size="2"
                callback={() => {
                  alert('todo');
                }}
              />
            </div>
          </div>

          <div className="EditRecipe__input-section">
            <h3 className="EditRecipe__section-title">Steps:</h3>
            {steps.map((step, i) => {
              return (
                <textarea
                  key={i}
                  value={step}
                  className="EditRecipe__input EditRecipe__input--textarea"
                />
              );
            })}
            <div className="EditRecipe__button-row">
              <TextBtn
                text="Add"
                size="2"
                callback={() => {
                  alert('todo');
                }}
              />
              <TextBtn
                text="Remove"
                size="2"
                callback={() => {
                  alert('todo');
                }}
              />
            </div>
          </div>

          <hr style={{ width: '100%' }} />

          <div className="EditRecipe__input-section">
            <div className="EditRecipe__button-row">
              <TextBtn
                text="Save"
                size="2"
                callback={() => {
                  alert('todo');
                }}
              />
              <TextBtn
                text="Delete"
                light={true}
                size="2"
                callback={() => {
                  alert('todo');
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
