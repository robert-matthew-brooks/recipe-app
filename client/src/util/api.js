import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:9090' });

export async function checkUsernameAvailability(username) {
  const { data } = await api.get(`/users/availability/${username}`);

  const user = {
    username: data.user.username,
    isAvailable: data.user.is_available,
  };

  return user;
}

export async function register(username, password) {
  const { data } = await api.post('/auth/register', { username, password });
  return data.user;
}

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data.user;
}

export async function getIngredients() {
  const { data } = await api.get('/ingredients');
  return data.ingredients;
}

export async function getRecipes(
  searchTerm,
  orderBy,
  ingredients,
  isFavourites,
  isVegetarian,
  limit,
  page
) {
  const params = {
    search_term: searchTerm,
    ingredient_ids: JSON.stringify(ingredients.map((el) => el.id)),
    is_favourites: isFavourites || null,
    is_vegetarian: isVegetarian || null,
    sort: orderBy || null,
    limit,
    page,
  };

  // remove empty params
  Object.keys(params).forEach((key) => {
    [null, '', '[]'].includes(params[key]) && delete params[key];
  });

  const { data } = await api.get('/recipes', { params });

  const recipes = data.recipes.map((recipe) => {
    recipe.imgUrl = recipe.img_url;
    delete recipe.img_url;
    return recipe;
  });

  return { recipes, totalRecipes: data.total_recipes };
}
