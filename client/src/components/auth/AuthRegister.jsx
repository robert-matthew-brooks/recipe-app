import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { checkUsernameAvailability, register } from '../../util/api';
import { getUsernameErr, getPasswordErr } from '../../util/validate';
import loadingImg from '../../assets/loading.svg';
import './Auth.css';

export default function AuthRegister() {
  const { setActiveUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      const user = await checkUsernameAvailability(username);
      if (!user.isAvailable) {
        setUsernameErr('Username not available');
      } else {
        try {
          const user = await register(username, password);

          localStorage.setItem('user', JSON.stringify(user));
          setActiveUser(user);
          navigate('/recipes');
        } catch (err) {
          console.log(err);
          setApiErr('Something went wrong, please try again');
        }
      }
    }

    if (!isValidateOnChange) setIsValidateOnChange(true);

    setIsLoading(false);
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
            onChange={(evt) => {
              handleUsernameChange(evt);
            }}
            placeholder="Username"
            className={usernameErr ? 'Auth--username__err' : undefined}
            disabled={isLoading}
          />
          <p className={`Auth--err ${!usernameErr && 'Auth--err__hidden'}`}>
            &#9888; {usernameErr}
          </p>
        </div>

        <div>
          <input
            id="Auth--password"
            type="password"
            value={password}
            onChange={(evt) => {
              handlePasswordChange(evt);
            }}
            placeholder="Password"
            className={passwordErr ? 'Auth--password__err' : undefined}
            disabled={isLoading}
          />
          <p className={`Auth--err ${!passwordErr && 'Auth--err__hidden'}`}>
            &#9888; {passwordErr}
          </p>
        </div>

        <button id="Auth--submit" type="submit" disabled={isLoading}>
          {!isLoading ? 'Register' : <img src={loadingImg} />}
        </button>
        <p id="Auth--msg">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        <p className={`Auth--err ${!apiErr && 'Auth--err__hidden'}`}>
          &#9888; {apiErr}
        </p>
      </form>
    </div>
  );
}
