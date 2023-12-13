const users = [
  {
    username: 'user-1',
    password: 'password-1',
    favourites: ['recipe-2', 'recipe-1'],
    list: ['recipe-5', 'recipe-3', 'recipe-4'],
    done: ['recipe-3'],
    likes: ['recipe-1', 'recipe-2', 'recipe-3'],
  },
  {
    username: 'user-2',
    password: 'password-2',
    favourites: ['recipe-6-tag', 'recipe-7-tag'],
    list: ['recipe-1', 'recipe-8-tag', 'recipe-6-tag'],
    done: ['recipe-1', 'recipe-6-tag'],
    likes: ['recipe-3', 'recipe-4', 'recipe-5', 'recipe-6-tag', 'recipe-8-tag'],
  },
  {
    username: 'user-3',
    password: 'password-3',
    favourites: ['recipe-7-tag', 'recipe-5', 'recipe-3'],
    list: ['recipe-4', 'recipe-2'],
    done: [],
    likes: ['recipe-7-tag', 'recipe-9-tag'],
  },
  {
    username: 'user-4',
    password: 'password-4',
    favourites: [],
    list: [],
    done: [],
    likes: [],
  },
  {
    username: 'user-5',
    password: 'password-5',
    favourites: ['recipe-8-tag'],
    list: ['recipe-5'],
    done: ['recipe-5'],
    likes: ['recipe-3', 'recipe-1', 'recipe-8-tag'],
  },
];

module.exports = users;
