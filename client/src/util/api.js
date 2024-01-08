import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:9090' });

export async function checkUsernameAvailability(username) {
  const { data } = await api.get(`/users/availability/${username}`);

  const user = { ...data.user };
  user.isAvailable = user.is_available;
  delete user.is_available;

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
  token,
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
    ingredient_ids:
      ingredients.length > 0
        ? JSON.stringify(ingredients.map((el) => el.id))
        : null,
    is_favourites: isFavourites ? 'true' : null,
    is_vegetarian: isVegetarian ? 'true' : null,
    sort: orderBy || null,
    limit,
    page,
  };

  // remove empty params
  Object.keys(params).forEach((key) => {
    [null, '', '[]'].includes(params[key]) && delete params[key];
  });

  const { data } = await api.get('/recipes', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  const recipes = data.recipes.map((recipe) => {
    recipe.imgUrl = recipe.img_url;
    delete recipe.img_url;
    return recipe;
  });

  return { recipes, totalRecipes: data.total_recipes };
}

export async function getRecipe(slug) {
  const { data } = await api.get(`/recipes/${slug}`);

  const recipe = { ...data.recipe };
  recipe.imgUrl = recipe.img_url;
  delete recipe.img_url;
  recipe.isVegetarian = recipe.is_vegetarian;
  delete recipe.is_vegetarian;
  recipe.createdAt = recipe.created_at;
  delete recipe.created_at;

  return recipe;
}

export async function getRating(token, slug) {
  const { data } = await api.get(`/ratings/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.rating;
}

export async function putRating(token, slug, rating) {
  await api.put(
    `/ratings/${slug}`,
    { rating },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function deleteRating(token, slug) {
  await api.delete(`/ratings/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getFavourites(token) {
  const { data } = await api.get('/favourites', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.favourites;
}

export async function putFavourite(token, slug) {
  await api.put(
    `/favourites/${slug}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
