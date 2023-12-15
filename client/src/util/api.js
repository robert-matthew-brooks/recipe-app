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

export async function getRecipes() {
  const { data } = await api.get('/recipes');
  // TODO set max 6

  const recipes = data.recipes.map((recipe) => {
    recipe.imgUrl = recipe.img_url;
    delete recipe.img_url;
    return recipe;
  });

  return recipes;
}
