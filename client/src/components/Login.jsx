import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    // TODO send to server call
  };

  return (
    <div id="Login">
      <form
        id="Login--inner"
        className="inner"
        onSubmit={(evt) => {
          handleSubmit(evt);
        }}
      >
        <h1 id="Login--title">Sign In</h1>
        <input
          id="Login--username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(evt) => {
            setUsername(evt.target.value);
          }}
        />
        <input
          id="Login--password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        />
        <input id="Login--submit" type="submit" value="Sign In" />
        <p id="Login--msg">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
