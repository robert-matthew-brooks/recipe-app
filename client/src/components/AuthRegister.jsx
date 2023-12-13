import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import {
  validateUsername as getUsernameErrors,
  validatePassword as getPasswordErrors,
  checkUsernameAvailability,
} from '../../util/validate';

export default function AuthRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const usernameErrors = getUsernameErrors(username);
    const passwordErrors = getPasswordErrors(password);

    // check username is available only if format is valid
    if (usernameErrors.length === 0) {
      const { user } = await checkUsernameAvailability(username);
      if (!user.isAvailable) {
        usernameErrors.push('Username not available');
      }
    }

    if ([...usernameErrors, ...passwordErrors].length === 0) {
      console.log('TODO register');
    }

    setUsernameErrors(usernameErrors);
    setPasswordErrors(passwordErrors);
  };

  return (
    <div id="Auth">
      <form
        id="Auth--inner"
        className="inner"
        onSubmit={async (evt) => {
          await handleSubmit(evt);
        }}
      >
        <h1 id="Auth--title">Register</h1>
        <input
          id="Auth--username"
          type="text"
          value={username}
          placeholder="Username"
          className={
            usernameErrors.length > 0 ? 'Auth--username__error' : undefined
          }
          onChange={(evt) => {
            setUsername(evt.target.value);
          }}
        />
        <input
          id="Auth--password"
          type="password"
          value={password}
          placeholder="Password"
          className={
            passwordErrors.length > 0 ? 'Auth--password__error' : undefined
          }
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        />
        <input id="Auth--submit" type="submit" value="Register" />
        <p id="Auth--msg">
          Already have an account? <Link to="/login">Login here</Link>
        </p>

        <p
          id="Auth--errors"
          className={
            [...usernameErrors, ...passwordErrors].length === 0
              ? 'Auth--errors__hidden'
              : undefined
          }
        >
          {[...usernameErrors, ...passwordErrors].map((error, i) => {
            return <div key={i}>&#9888; {error}</div>;
          })}
        </p>
      </form>
    </div>
  );
}
