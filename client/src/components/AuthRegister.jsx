import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import { getUsernameErr, getPasswordErr } from '../util/validate';
import { checkUsernameAvailability } from '../util/api';

export default function AuthRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [isValidateOnChange, setIsValidateOnChange] = useState(false);

  const validateUsername = (username) => {
    let currentUsernameErr = getUsernameErr(username);
    setUsernameErr(currentUsernameErr);

    return currentUsernameErr === null;
  };

  const validatePassword = (password) => {
    const currentPasswordErr = getPasswordErr(password);
    setPasswordErr(currentPasswordErr);

    return currentPasswordErr === null;
  };

  const handleUsernameChange = (evt) => {
    const value = evt.target.value;
    setUsername(value);
    if (isValidateOnChange) validateUsername(value);
  };

  const handlePasswordChange = (evt) => {
    const value = evt.target.value;
    setPassword(value);
    if (isValidateOnChange) validatePassword(value);
  };

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();

    const isValidUsername = await validateUsername(username);
    const isValidPassword = validatePassword(password);

    if (isValidUsername && isValidPassword) {
      const { user } = await checkUsernameAvailability(username);
      if (!user.isAvailable) {
        setUsernameErr('Username not available');
      } else {
        console.log('Tregister');
        // TODO register
        // lock input boxes/button
        // loading wheel on button
        // update localstorgae, context, and redirect on response
      }
    } else if (!isValidateOnChange) {
      setIsValidateOnChange(true);
    }
  };

  return (
    <div id="Auth">
      <form
        id="Auth--inner"
        className="inner"
        onSubmit={async (evt) => {
          await handleFormSubmit(evt);
        }}
      >
        <h1 id="Auth--title">Register</h1>

        <div>
          <input
            id="Auth--username"
            type="text"
            value={username}
            placeholder="Username"
            className={usernameErr ? 'Auth--username__error' : undefined}
            onChange={(evt) => {
              handleUsernameChange(evt);
            }}
          />
          <p
            className={`Auth--errors ${!usernameErr && 'Auth--errors__hidden'}`}
          >
            &#9888; {usernameErr}
          </p>
        </div>

        <div>
          <input
            id="Auth--password"
            type="password"
            value={password}
            placeholder="Password"
            className={passwordErr ? 'Auth--password__error' : undefined}
            onChange={(evt) => {
              handlePasswordChange(evt);
            }}
          />
          <p
            className={`Auth--errors ${!passwordErr && 'Auth--errors__hidden'}`}
          >
            &#9888; {passwordErr}
          </p>
        </div>

        <input id="Auth--submit" type="submit" value="Register" />
        <p id="Auth--msg">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}
