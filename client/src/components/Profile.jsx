import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Header from './Header';
import SimpleMsg from './SimpleMsg';
import TextBtn from './TextBtn';
import { checkUsernameAvailability } from '../util/api';
import { getUsernameErr, getPasswordErr } from '../util/validate';
import './Profile.css';

export default function Profile() {
  const { activeUser, activateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
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

  const validatePassword = (password, passwordToMatch) => {
    let currentPasswordErr = getPasswordErr(password);
    if (!currentPasswordErr && password !== passwordToMatch) {
      currentPasswordErr = 'Passwords must match';
    }
    setPasswordErr(currentPasswordErr);

    return currentPasswordErr === null;
  };

  const handleUsernameChange = (evt) => {
    const value = evt.target.value;
    setUsername(value);
    if (isValidateOnChange) validateUsername(value);
  };

  const handlePasswordChange = (evt, passwordSetter, passwordToMatch) => {
    const value = evt.target.value;
    passwordSetter(value);
    if (isValidateOnChange) validatePassword(value, passwordToMatch);
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);

    const isValidUsername = validateUsername(username);
    const isValidPassword = validatePassword(password1, password2);

    if (isValidUsername && isValidPassword) {
      const user = await checkUsernameAvailability(username);
      if (!user.isAvailable) {
        setUsernameErr('Username not available');
      } else {
        try {
          // const user = await login(username, password1);
          // const userStr = JSON.stringify(user);
          // localStorage.setItem('user', userStr);
          // await activateUser(userStr);
          navigate('/profile-updated');
        } catch (err) {
          console.log(err);
          setApiErr('Something went wrong, please try again');
        }
      }
    }

    if (!isValidateOnChange) setIsValidateOnChange(true);

    setIsLoading(false);
  };

  if (!activeUser)
    return (
      <SimpleMsg
        title="Your Account"
        msg="Please sign in to access your account!"
        linkText="OK, Sign Me In!"
        linkHref="/login"
      />
    );
  else
    return (
      <>
        <Header title="Your Account" />

        <section id="Profile">
          <div id="Profile__inner" className="inner">
            <div className="Profile__input-section">
              <p>Update Your Details:</p>
              <input
                type="text"
                value={username}
                onChange={(evt) => {
                  handleUsernameChange(evt);
                }}
                className="Profile__input"
                placeholder="New Username"
                disabled={isLoading}
              />
              <p className={`err ${!usernameErr && 'err--hidden'}`}>
                {usernameErr}
              </p>
              <input
                type="password"
                value={password1}
                onChange={(evt) => {
                  handlePasswordChange(evt, setPassword1, password2);
                }}
                className="Profile__input"
                placeholder="New Password"
                disabled={isLoading}
              />
              <input
                type="password"
                value={password2}
                onChange={(evt) => {
                  handlePasswordChange(evt, setPassword2, password1);
                }}
                className="Profile__input"
                placeholder="Confirm New Password"
                disabled={isLoading}
              />
              <p className={`err ${!passwordErr && 'err--hidden'}`}>
                {passwordErr}
              </p>
              <div className="Profile__button-row">
                <TextBtn
                  text="Update"
                  size="2"
                  callback={async () => {
                    await handleFormSubmit();
                  }}
                />
              </div>
              <p className={`err ${!apiErr && 'err--hidden'}`}>{apiErr}</p>
            </div>

            <div className="Profile__input-section">
              <div>Edit Your Recipes:</div>
              <select
                className="Profile__dropdown"
                defaultValue=""
                onChange={() => {
                  alert('todo');
                }}
              >
                <option value="" disabled>
                  Choose Recipe:
                  {/* TODO test for no user recipes, show different message */}
                </option>
              </select>
              <div className="Profile__button-row">
                <TextBtn
                  text="Create New..."
                  size="2"
                  callback={() => {
                    alert('todo');
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </>
    );
}
