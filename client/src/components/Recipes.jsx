import { useEffect, useState } from 'react';
import { getRecipes } from '../util/api';
import Header from './Header';
import RecipeCards from './RecipeCards';
import RecipeFilter from './RecipeFilter';
import './Recipes.css';

const tempRecipes = [
  {
    name: 'Penne & Cheese',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/free-photo/tasty-restaurant-appetizers-big-company-including-goldy-chicken-nuggets-fried-potatoes-green-salad-leaves-fresh-cucumbers-standing-white-table-looking-delicious-mouthwatering_132075-13080.jpg?t=st=1702305034~exp=1702305634~hmac=2e187914366dcaad3b00cf9840281b72aef3767093f44f3d5e1de5c0fb98fe3d',
  },
  {
    name: 'Beef Kebab',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?w=740&t=st=1702310054~exp=1702310654~hmac=24ecbba032124cb1010b449af8669e15a1946c82ce3e19f62f283be54ff47944',
  },
  {
    name: 'Tuna Salad',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/free-photo/tuna-salad-with-lettuce-olives-corn-tomatoes-top-view_114579-8281.jpg?w=740&t=st=1702310100~exp=1702310700~hmac=f7990a47a98cab758e060d780a08b7a7d90424a84274850de99f1662e98d95c2',
  },
  {
    name: 'Crispy Chicken Spicy Burgers',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/premium-photo/healthy-food-assortment-buddha-bowl-black-background-top-view-free-space-your-text_187166-245.jpg?w=740',
  },
  {
    name: 'Penne & Cheese',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/free-photo/tasty-restaurant-appetizers-big-company-including-goldy-chicken-nuggets-fried-potatoes-green-salad-leaves-fresh-cucumbers-standing-white-table-looking-delicious-mouthwatering_132075-13080.jpg?t=st=1702305034~exp=1702305634~hmac=2e187914366dcaad3b00cf9840281b72aef3767093f44f3d5e1de5c0fb98fe3d',
  },
  {
    name: 'Beef Kebab',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?w=740&t=st=1702310054~exp=1702310654~hmac=24ecbba032124cb1010b449af8669e15a1946c82ce3e19f62f283be54ff47944',
  },
  {
    name: 'Tuna Salad',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/free-photo/tuna-salad-with-lettuce-olives-corn-tomatoes-top-view_114579-8281.jpg?w=740&t=st=1702310100~exp=1702310700~hmac=f7990a47a98cab758e060d780a08b7a7d90424a84274850de99f1662e98d95c2',
  },
  {
    name: 'Crispy Chicken Spicy Burgers',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/premium-photo/healthy-food-assortment-buddha-bowl-black-background-top-view-free-space-your-text_187166-245.jpg?w=740',
  },
  {
    name: 'Penne & Cheese',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/free-photo/tasty-restaurant-appetizers-big-company-including-goldy-chicken-nuggets-fried-potatoes-green-salad-leaves-fresh-cucumbers-standing-white-table-looking-delicious-mouthwatering_132075-13080.jpg?t=st=1702305034~exp=1702305634~hmac=2e187914366dcaad3b00cf9840281b72aef3767093f44f3d5e1de5c0fb98fe3d',
  },
  {
    name: 'Beef Kebab',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?w=740&t=st=1702310054~exp=1702310654~hmac=24ecbba032124cb1010b449af8669e15a1946c82ce3e19f62f283be54ff47944',
  },
  {
    name: 'Tuna Salad',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/free-photo/tuna-salad-with-lettuce-olives-corn-tomatoes-top-view_114579-8281.jpg?w=740&t=st=1702310100~exp=1702310700~hmac=f7990a47a98cab758e060d780a08b7a7d90424a84274850de99f1662e98d95c2',
  },
  {
    name: 'Crispy Chicken Spicy Burgers',
    author: 'Bob',
    slug: 'link-goes-here',
    imgUrl:
      'https://img.freepik.com/premium-photo/healthy-food-assortment-buddha-bowl-black-background-top-view-free-space-your-text_187166-245.jpg?w=740',
  },
];

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filterIngredients, setFilterIngredients] = useState([]);

  useEffect(() => {
    (async () => {
      const { recipes } = await getRecipes();
      setRecipes(recipes);
    })();
  }, []);

  return (
    <>
      <Header title="Browse Recipes" />

      <section id="Recipes">
        <div id="Recipes--inner" className="inner">
          <RecipeFilter {...{ filterIngredients, setFilterIngredients }} />
          <RecipeCards {...{ recipes }} />
        </div>
      </section>
    </>
  );
}
