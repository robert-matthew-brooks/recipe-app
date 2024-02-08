const users = [
  {
    username: 'user1',
    password: 'password1!',
    favourites: [2, 1],
    todos: [5, 3, 4],
    ratings: [
      { recipeId: 1, stars: 5 },
      { recipeId: 2, stars: 4 },
      { recipeId: 3, stars: 1 },
    ],
  },
  {
    username: 'user2',
    password: 'password2!',
    favourites: [6, 7],
    todos: [1, 8, 6],
    ratings: [
      { recipeId: 3, stars: 5 },
      { recipeId: 4, stars: 5 },
      { recipeId: 5, stars: 3 },
      { recipeId: 6, stars: 2 },
      { recipeId: 8, stars: 3 },
    ],
  },
  {
    username: 'user3',
    password: 'password3!',
    favourites: [7, 5, 3],
    todos: [4, 2],
    ratings: [
      { recipeId: 7, stars: 3 },
      { recipeId: 9, stars: 4 },
    ],
  },
  {
    username: 'user4',
    password: 'password4!',
    favourites: [],
    todos: [],
    ratings: [],
  },
  {
    username: 'user5',
    password: 'password5!',
    favourites: [8],
    todos: [5],
    ratings: [
      { recipeId: 3, stars: 4 },
      { recipeId: 1, stars: 1 },
      { recipeId: 8, stars: 2 },
    ],
  },
];

module.exports = users;
