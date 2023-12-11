const users = [
  {
    name: 'user-1',
    password: 'password-1',
    favourites: ['recipe-2', 'recipe-1'],
    list: ['recipe-5', 'recipe-3', 'recipe-4'],
    likes: ['recipe-1', 'recipe-2', 'recipe-3'],
  },
  {
    name: 'user-2',
    password: 'password-2',
    favourites: ['recipe-6-tag', 'recipe-7-tag'],
    list: ['recipe-1', 'recipe-8-tag', 'recipe-6-tag'],
    likes: ['recipe-3', 'recipe-4', 'recipe-5', 'recipe-6-tag', 'recipe-8-tag'],
  },
  {
    name: 'user-3',
    password: 'password-3',
    favourites: ['recipe-7-tag', 'recipe-5', 'recipe-3'],
    list: ['recipe-4', 'recipe-2'],
    likes: ['recipe-7-tag', 'recipe-9-tag'],
  },
  {
    name: 'user-4',
    password: 'password-4',
    favourites: [],
    list: [],
    likes: [],
  },
  {
    name: 'user-5',
    password: 'password-5',
    favourites: ['recipe-8-tag'],
    list: ['recipe-5'],
    likes: ['recipe-3', 'recipe-1', 'recipe-8-tag'],
  },
];

module.exports = users;
