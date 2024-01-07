import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { login } from '../../util/api';
import { getUsernameErr, getPasswordErr } from '../../util/validate';
import loadingImg from '../../assets/loading.svg';
import './Auth.css';

export default function AuthLogin() {
  const { setActiveUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('bob'); // TODO remove these when finished dev testing
  const [password, setPassword] = useState('password123!');
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [apiErr, setApiErr] = useState('');

  const [isValidateOnChange, setIsValidateOnChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    const isValidUsername = validateUsername(username);
    const isValidPassword = validatePassword(password);

    if (isValidUsername && isValidPassword) {
      try {
        const user = await login(username, password);
        localStorage.setItem('user', JSON.stringify(user));
        setActiveUser(user);
        navigate('/recipes');
      } catch (err) {
        console.log(err);
        setApiErr(
          err.response?.data?.msg || 'Something went wrong, please try again'
        );
      }
    }

    if (!isValidateOnChange) setIsValidateOnChange(true);

    setIsLoading(false);
  };

  return (
    <div id="Auth">
      <form
        id="Auth__inner"
        className="inner"
        onSubmit={async (evt) => {
          await handleFormSubmit(evt);
        }}
      >
        <h1 id="Auth__title">Sign In</h1>

        <div>
          <input
            id="Auth__username"
            data-test="username-box"
            type="text"
            value={username}
            onChange={(evt) => {
              handleUsernameChange(evt);
            }}
            placeholder="Username"
            className={usernameErr ? 'Auth__username__err' : undefined}
            disabled={isLoading}
          />
          <p className={`err ${!usernameErr && 'err--hidden'}`}>
            {usernameErr}
          </p>
        </div>

        <div>
          <input
            id="Auth__password"
            data-test="password-box"
            type="password"
            value={password}
            onChange={(evt) => {
              handlePasswordChange(evt);
            }}
            placeholder="Password"
            className={passwordErr ? 'Auth__password__err' : undefined}
            disabled={isLoading}
          />
          <p className={`err ${!passwordErr && 'err--hidden'}`}>
            {passwordErr}
          </p>
        </div>

        <button
          id="Auth__submit"
          data-test="login-btn"
          type="submit"
          disabled={isLoading}
        >
          {!isLoading ? 'Sign In' : <img src={loadingImg} />}
        </button>
        <p id="Auth__msg">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p
          data-test="login-err-msg"
          className={`err ${!apiErr && 'err--hidden'}`}
        >
          {apiErr}
        </p>
      </form>
    </div>
  );
}
