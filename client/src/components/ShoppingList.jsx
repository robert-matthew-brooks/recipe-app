import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Header from './Header';
import SimpleMsg from './SimpleMsg';
import { getShoppingList } from '../util/api';
import './ShoppingList.css';

export default function ShoppingList() {
  const { activeUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([1]);
  const [isLoading, setIsLoading] = useState(false);

  const handleIngredientToggle = (i) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[i].isChecked = !updatedIngredients[i].isChecked;
    setIngredients(updatedIngredients);

    const checkedIngredientsStr = JSON.stringify(
      updatedIngredients
        .filter((ingredient) => ingredient.isChecked === true)
        .map((ingredient) => ({
          name: ingredient.name,
          amount: ingredient.amount,
        }))
    );

    localStorage.setItem('checked-ingredients', checkedIngredientsStr);
  };

  useEffect(() => {
    (async () => {
      if (activeUser?.token) {
        const fetchedIngredients = await getShoppingList(activeUser.token);

        // put ingredients into a list and add up amounts with same name
        const ingredients = [];
        fetchedIngredients.forEach((ingredient) => {
          if (
            !ingredients
              .map((ingredient) => ingredient.name)
              .includes(ingredient.name)
          ) {
            ingredients.push({
              name: ingredient.name,
              amount: ingredient.amount,
              units: ingredient.units,
              isChecked: false,
            });
          } else {
            ingredients.find((el) => el.name === ingredient.name).amount +=
              ingredient.amount;
          }
        });

        // check localstorage to see if they are already ticked off
        const checkedIngredients =
          JSON.parse(localStorage.getItem('checked-ingredients')) || [];

        ingredients.forEach((ingredient) => {
          const ingredientToFind = {
            name: ingredient.name,
            amount: ingredient.amount,
          };

          for (const checkedIngredient of checkedIngredients)
            if (
              ingredient.name === checkedIngredient.name &&
              ingredient.amount <= checkedIngredient.amount
            ) {
              ingredient.isChecked = true;
              break;
            }
        });

        setIngredients(ingredients);
      }
    })();
  }, [activeUser]);

  if (!activeUser)
    return (
      <SimpleMsg
        title="My Shopping List"
        msg="Please sign in to see your shopping list"
        linkText="OK, Sign Me In!"
        linkHref="/login"
      />
    );
  else if (!ingredients.length > 0) {
    return (
      <SimpleMsg
        title="My Shopping List"
        msg="Empty... add some recipes to your meal list!"
        linkText="Browse Recipes"
        linkHref="/recipes"
      />
    );
  } else
    return (
      <>
        <Header title="My Shopping List" />

        <section id="ShoppingList">
          <div id="ShoppingList__inner" className="inner">
            <section id="ShoppingList__ingredients">
              <ul>
                {ingredients.map((ingredient, i) => {
                  return (
                    <li key={`ingredient${i}`}>
                      <input
                        type="checkbox"
                        id={`ingredient${i}`}
                        checked={ingredient.isChecked || false}
                        onChange={() => {
                          handleIngredientToggle(i);
                        }}
                      />
                      <label htmlFor={`ingredient${i}`}>
                        {ingredient.name} -{' '}
                        <span className="bold">
                          {ingredient.amount}
                          {ingredient.units}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </section>
      </>
    );
}
