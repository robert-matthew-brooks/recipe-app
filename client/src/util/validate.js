// this should match the SERVER file in server/util/get.jsErrors

export function getUsernameErr(username) {
  if (!username) {
    return 'Username required';
  } else if (username.length < 3) {
    return 'Username must have at least 3 characters';
  } else if (username.length > 20) {
    return 'Username must not have more than 20 characters';
  } else if (!/^[A-z\d]+$/.test(username)) {
    return 'Username must only use letters and numbers';
  } else if (!/^[A-z]/.test(username)) {
    return 'Username must start with a letter';
  } else {
    return null;
  }
}

export function getPasswordErr(password) {
  if (!password) {
    return 'Password required';
  } else if (password.length < 3) {
    return 'Password must have at least 3 characters';
  } else if (password.length > 20) {
    return 'Password must not have more than 20 characters';
  } else if (!/[A-z]/.test(password)) {
    return 'Password must contain a letter';
  } else if (!/\d/.test(password)) {
    return 'Password must contain a number';
  } else {
    return null;
  }
}
