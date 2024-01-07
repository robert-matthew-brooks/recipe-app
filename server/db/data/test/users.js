const users = [
  {
    username: 'user1',
    password: 'password1!',
    favourites: ['recipe-2', 'recipe-1'],
    todo: ['recipe-5', 'recipe-3', 'recipe-4'],
    done: ['recipe-3'],
    ratings: [
      { slug: 'recipe-1', stars: 5 },
      { slug: 'recipe-2', stars: 4 },
      { slug: 'recipe-3', stars: 1 },
    ],
  },
  {
    username: 'user2',
    password: 'password2!',
    favourites: ['recipe-6-tag', 'recipe-7-tag'],
    todo: ['recipe-1', 'recipe-8-tag', 'recipe-6-tag'],
    done: ['recipe-1', 'recipe-6-tag'],
    ratings: [
      { slug: 'recipe-3', stars: 5 },
      { slug: 'recipe-4', stars: 5 },
      { slug: 'recipe-5', stars: 3 },
      { slug: 'recipe-6-tag', stars: 2 },
      { slug: 'recipe-8-tag', stars: 3 },
    ],
  },
  {
    username: 'user3',
    password: 'password3!',
    favourites: ['recipe-7-tag', 'recipe-5', 'recipe-3'],
    todo: ['recipe-4', 'recipe-2'],
    done: [],
    ratings: [
      { slug: 'recipe-7-tag', stars: 3 },
      { slug: 'recipe-9-tag', stars: 4 },
    ],
  },
  {
    username: 'user4',
    password: 'password4!',
    favourites: [],
    todo: [],
    done: [],
    ratings: [],
  },
  {
    username: 'user5',
    password: 'password5!',
    favourites: ['recipe-8-tag'],
    todo: ['recipe-5'],
    done: ['recipe-5'],
    ratings: [
      { slug: 'recipe-3', stars: 4 },
      { slug: 'recipe-1', stars: 1 },
      { slug: 'recipe-8-tag', stars: 2 },
    ],
  },
];

module.exports = users;
