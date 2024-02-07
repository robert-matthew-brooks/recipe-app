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
  const [formErr, setFormErr] = useState('');

  // new recipe variables
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState(['']);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        setAllIngredients(await getIngredients());

        const slug = searchParams.get('slug');
        if (slug) {
          const recipe = await getRecipe(slug);
          setName(recipe.name);
          setIngredients(recipe.ingredients);
          setSteps(recipe.steps);
        }
      } catch (err) {
        console.log(err);
        navigate('/error');
      }
      setIsLoading(false);
    })();
  }, []);

  // TODO
  // STYLE delete button to have RED background
  // instead of light=true, have style=light, style=danger

  // validate inputs, one error message at bottom
  // generate slug??? if not already existing
  // check recipe name/slug doesn't exist (add 2, 3 etc to end of slug)

  const addIngredient = (id) => {
    if (id) {
      const { name, units } = allIngredients.find(
        (ingredient) => ingredient.id === id
      );

      setIngredients([
        ...ingredients,
        {
          id,
          name,
          units,
          amount: '',
        },
      ]);
    } else {
      setIngredients([
        ...ingredients,
        {
          id: null,
          name: '',
          units: '',
          amount: '',
        },
      ]);
    }
  };

  const removeIngredient = (i) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(i, 1);
    setIngredients(newIngredients);
  };

  const updateIngredient = (i, ingredient) => {
    const newIngredients = [...ingredients];
    for (const key in ingredient) {
      newIngredients[i][key] = ingredient[key];
    }
    setIngredients(newIngredients);
  };

  const updateStep = (i, step) => {
    const newSteps = [...steps];
    newSteps[i] = step;
    setSteps(newSteps);
  };

  const isFormValid = () => {
    if (name.replace(/[^a-zA-Z]/g, '').length === 0) {
      setFormErr('Recipe name cannot be blank');
    } else if (name.length > 50) {
      setFormErr('Recipe name too long');
    } else if (!ingredients.length) {
      setFormErr('Ingredients list cannot be empty');
    } else if (ingredients.filter((el) => !el.name).length > 0) {
      setFormErr('Ingredient name cannot be blank');
    } else if (ingredients.filter((el) => !el.amount).length > 0) {
      setFormErr('Ingredient amount cannot be blank');
    } else if (steps.filter((el) => el.length === 0).length > 0) {
      setFormErr('Step cannot be blank');
    } else {
      setFormErr('');
      return true;
    }
  };

  const saveRecipe = async () => {
    const slug = name
      .replace('&', 'and')
      .replace(/[^a-zA-Z\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    if (isFormValid()) {
      try {
        console.log({
          name,
          slug,
          ingredients: ingredients.filter((el) => el.id),
          newIngredients: ingredients.filter((el) => !el.id),
          steps,
          token: activeUser?.token,
        });
      } catch (err) {
        console.log(err);
        setFormErr('Something went wrong');
      }
    }
  };

  const deleteRecipe = async () => {
    try {
    } catch (err) {
      console.log(err);
      setFormErr('Something went wrong');
    }
  };

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
                setName(evt.target.value);
              }}
              className="EditRecipe__input"
              disabled={isLoading}
            />
          </div>

          <div className="EditRecipe__input-section">
            <h3 className="EditRecipe__section-title">TODO image:</h3>
          </div>

          <div className="EditRecipe__input-section">
            <h3 className="EditRecipe__section-title">Ingredients:</h3>
            <ul className="EditRecipe__ingredients-list">
              {ingredients.map((ingredient, i) => {
                return ingredient.id ? (
                  <li key={i}>
                    {ingredient.name}
                    {ingredient.units && ` (${ingredient.units})`}:
                    <div className="EditRecipe__ingredients-list__spacer">
                      &nbsp;
                    </div>
                    <input
                      value={ingredient.amount}
                      onChange={(evt) => {
                        updateIngredient(i, {
                          amount: evt.target.value.replace(/\D/g, ''),
                        });
                      }}
                      className="EditRecipe__input EditRecipe__input--small"
                    />
                    <CrossBtn
                      size={1.1}
                      callback={() => {
                        removeIngredient(i);
                      }}
                    />
                  </li>
                ) : (
                  <li key={i}>
                    <input
                      value={ingredient.name}
                      onChange={(evt) => {
                        updateIngredient(i, { name: evt.target.value });
                      }}
                      placeholder="ingredient"
                      className="EditRecipe__input EditRecipe__input--medium"
                    />
                    (
                    <input
                      value={ingredient.units}
                      onChange={(evt) => {
                        updateIngredient(i, { units: evt.target.value });
                      }}
                      placeholder="unit"
                      className="EditRecipe__input EditRecipe__input--small"
                    />
                    ):
                    <div className="EditRecipe__ingredients-list__spacer">
                      &nbsp;
                    </div>
                    <input
                      value={ingredient.amount}
                      onChange={(evt) => {
                        updateIngredient(i, {
                          amount: evt.target.value.replace(/\D/g, ''),
                        });
                      }}
                      className="EditRecipe__input EditRecipe__input--small"
                    />
                    <CrossBtn
                      size={1.1}
                      callback={() => {
                        removeIngredient(i);
                      }}
                    />
                  </li>
                );
              })}
            </ul>

            <select
              className="EditRecipe__dropdown"
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
                  addIngredient();
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
                  onChange={(evt) => {
                    updateStep(i, evt.target.value);
                  }}
                  className="EditRecipe__input EditRecipe__input--textarea"
                />
              );
            })}
            <div className="EditRecipe__button-row">
              <TextBtn
                text="Add"
                size="2"
                callback={() => {
                  setSteps([...steps, '']);
                }}
              />
              <TextBtn
                text="Remove"
                size="2"
                callback={() => {
                  if (steps.length > 1) setSteps(steps.slice(0, -1));
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
                  saveRecipe();
                }}
              />{' '}
              <TextBtn
                text="Cancel"
                size="2"
                callback={() => {
                  navigate('/profile');
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
            <p className={`err ${!formErr && 'err--hidden'}`}>{formErr}</p>
          </div>
        </div>
      </section>
    </>
  );
}
