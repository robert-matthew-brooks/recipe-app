const users = [
  {
    username: 'user1',
    password: 'password1!',
    favourites: ['recipe-2', 'recipe-1'],
    list: ['recipe-5', 'recipe-3', 'recipe-4'],
    done: ['recipe-3'],
    likes: ['recipe-1', 'recipe-2', 'recipe-3'],
  },
  {
    username: 'user2',
    password: 'password2!',
    favourites: ['recipe-6-tag', 'recipe-7-tag'],
    list: ['recipe-1', 'recipe-8-tag', 'recipe-6-tag'],
    done: ['recipe-1', 'recipe-6-tag'],
    likes: ['recipe-3', 'recipe-4', 'recipe-5', 'recipe-6-tag', 'recipe-8-tag'],
  },
  {
    username: 'user3',
    password: 'password3!',
    favourites: ['recipe-7-tag', 'recipe-5', 'recipe-3'],
    list: ['recipe-4', 'recipe-2'],
    done: [],
    likes: ['recipe-7-tag', 'recipe-9-tag'],
  },
  {
    username: 'user4',
    password: 'password4!',
    favourites: [],
    list: [],
    done: [],
    likes: [],
  },
  {
    username: 'user5',
    password: 'password5!',
    favourites: ['recipe-8-tag'],
    list: ['recipe-5'],
    done: ['recipe-5'],
    likes: ['recipe-3', 'recipe-1', 'recipe-8-tag'],
  },
];

module.exports = users;
