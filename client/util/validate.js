import axios from 'axios';

// this should match the SERVER file in server/util/validate.js

const api = axios.create({ baseURL: 'http://localhost:9090' });

export function validateUsername(username) {
  const errors = [];

  if (!username) {
    errors.push('Username required');
  } else {
    if (username.length < 3) {
      errors.push('Username must have at least 3 characters');
    }
    if (username.length > 20) {
      errors.push('Username must not have more than 20 characters');
    }
    if (!/^[A-z\d]+$/.test(username)) {
      errors.push('Username must only use letters and numbers');
    }
    if (!/^[A-z]/.test(username)) {
      errors.push('Username must start with a letter');
    }
  }

  return errors;
}

export function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push('Password required');
  } else {
    if (password.length < 3) {
      errors.push('Password must have at least 3 characters');
    }
    if (password.length > 20) {
      errors.push('Password must not have more than 20 characters');
    }
    if (!/[A-z]/.test(password)) {
      errors.push('Password must contain a letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain a number');
    }
  }

  return errors;
}

export async function checkUsernameAvailability(username) {
  const { data } = await api.get('/users/availability/hey');

  const user = {
    username: data.user.username,
    isAvailable: data.user.is_available,
  };

  return { user };
}
