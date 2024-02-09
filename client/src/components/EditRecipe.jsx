import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { PromptContext } from './context/PromptContext';
import Header from './Header';
import TextBtn from './TextBtn';
import {
  createRecipe,
  deleteRecipe,
  getIngredients,
  getRecipe,
  patchRecipe,
} from '../util/api';
import './EditRecipe.css';
import CrossBtn from './CrossBtn';

export default function EditRecipe() {
  const { activeUser } = useContext(UserContext);
  const { createPrompt } = useContext(PromptContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allIngredients, setAllIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErr, setFormErr] = useState('');

  // new recipe variables
  const [name, setName] = useState('');
  const [slug, setSlug] = useState(''); // current slug, new one generated server side
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState(['']);

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
    if (isFormValid()) {
      try {
        const updateData = [
          name,
          ingredients // existing ingredients
            .filter((el) => el.id)
            .map((el) => {
              const { id, amount } = el;
              return { id, amount };
            }),
          ingredients // new ingredients
            .filter((el) => !el.id)
            .map((el) => {
              const { name, units, amount } = el;
              return { name, units, amount };
            }),
          steps,
          activeUser?.token,
        ];

        const recipe = slug
          ? await patchRecipe(slug, ...updateData)
          : await createRecipe(...updateData);
        navigate(`/recipes/${recipe.slug}`);
      } catch (err) {
        console.log(err);
        setFormErr('Something went wrong');
      }
    }
  };

  const removeRecipe = async () => {
    try {
      await deleteRecipe(slug, activeUser?.token);
      navigate('/recipe-deleted');
    } catch (err) {
      console.log(err);
      setFormErr('Something went wrong');
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        setAllIngredients(await getIngredients());

        const slug = searchParams.get('slug');
        if (slug) {
          setSlug(slug);
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
              placeholder="Recipe name..."
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
                    <CrossBtn size={1.1} callback={() => removeIngredient(i)} />
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
                    <CrossBtn size={1.1} callback={() => removeIngredient(i)} />
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
                callback={() => addIngredient()}
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
                  placeholder={`Step ${i + 1}...`}
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
                callback={() => setSteps([...steps, ''])}
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

          <div className="EditRecipe__input-section">
            <h3 className="EditRecipe__section-title">File:</h3>
            <div className="EditRecipe__button-row">
              <TextBtn
                text="Save..."
                size="2"
                callback={async () => {
                  await saveRecipe();
                }}
              />
              {slug && (
                <TextBtn
                  text="Delete..."
                  style="danger"
                  size="2"
                  callback={() => {
                    createPrompt({
                      message: 'Really delete this recipe?',
                      positiveText: 'Delete',
                      positiveStyle: 'danger',
                      negativeText: 'Cancel',
                      cb: async () => {
                        await removeRecipe();
                      },
                    });
                  }}
                />
              )}
            </div>
            <p className={`err ${!formErr && 'err--hidden'}`}>{formErr}</p>
          </div>
        </div>
      </section>
    </>
  );
}
