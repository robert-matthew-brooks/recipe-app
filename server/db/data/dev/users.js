const users = [
  {
    username: 'Bob',
    password: 'password123!',
    favourites: ['chicken-leek-and-bacon-pie'],
    todos: ['chicken-leek-and-bacon-pie', 'penne-and-cheese', 'beef-kebab'],
    done: ['chicken-leek-and-bacon-pie'],
    ratings: [{ slug: 'penne-and-cheese', stars: 4 }],
  },
  {
    username: 'some_user',
    password: 'password123!',
    favourites: [],
    todos: [],
    done: [],
    ratings: [
      { slug: 'penne-and-cheese', stars: 3 },
      { slug: 'beef-meatballs-with-tomato-sauce-and-linguine', stars: 2 },
    ],
  },
  {
    username: 'another_user',
    password: 'password123!',
    favourites: [],
    todos: [],
    done: [],
    ratings: [
      { slug: 'penne-and-cheese', stars: 3 },
      { slug: 'beef-meatballs-with-tomato-sauce-and-linguine', stars: 5 },
    ],
  },
];

module.exports = users;
