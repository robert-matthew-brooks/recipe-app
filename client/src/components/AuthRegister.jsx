import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import {
  isPasswordValid,
  isUsernameAvailable,
  isUsernameValid,
} from '../../util/validate';

export default function AuthRegister() {
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    console.log(isUsernameValid(username), isPasswordValid(password));
    await isUsernameAvailable();

    // TODO send to server call
  };

  return (
    <div id="Auth">
      <form
        id="Auth--inner"
        className="inner"
        onSubmit={(evt) => {
          handleSubmit(evt);
        }}
      >
        <h1 id="Auth--title">Register</h1>
        <input
          id="Auth--username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(evt) => {
            setUsername(evt.target.value);
          }}
        />
        <input
          id="Auth--password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        />
        <input id="Auth--submit" type="submit" value="Register" />
        <p id="Auth--msg">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}
