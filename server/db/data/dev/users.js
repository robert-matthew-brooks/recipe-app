const users = [
  {
    username: 'Bob',
    password: 'password123!',
    favourites: [1],
    todos: [1, 2, 3],
    ratings: [{ slug: 2, stars: 4 }],
  },
  {
    username: 'some_user',
    password: 'password123!',
    favourites: [],
    todos: [],
    ratings: [
      { slug: 2, stars: 3 },
      { slug: 6, stars: 2 },
    ],
  },
  {
    username: 'another_user',
    password: 'password123!',
    favourites: [],
    todos: [],
    ratings: [
      { slug: 2, stars: 3 },
      { slug: 6, stars: 5 },
    ],
  },
];

module.exports = users;
