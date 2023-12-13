import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

export default function AuthAuth() {
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

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
        <h1 id="Auth--title">Sign In</h1>
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
        <input id="Auth--submit" type="submit" value="Sign In" />
        <p id="Auth--msg">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
