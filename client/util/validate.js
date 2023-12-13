import axios from 'axios';

// this should match the SERVER file in server/util/validate.js

const api = axios.create({ baseURL: 'http://localhost:9090' });

export function isUsernameValid(username) {
  if (username) {
    if (username.length >= 3 && username.length <= 20) {
      if (/^[A-z\d]+$/.test(username) && /^[A-z]/.test(username)) {
        return true;
      }
    }
  }

  return false;
}

export function isPasswordValid(password) {
  if (password) {
    if (password.length >= 3 && password.length <= 20) {
      if (/[A-z]/.test(password) && /\d/.test(password)) {
        return true;
      }
    }
  }

  return false;
}

export async function isUsernameAvailable(username) {
  const data = await api.get('/recipes');
  console.log(data);
}
