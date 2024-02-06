import Header from './Header';
import './Profile.css';
import TextBtn from './TextBtn';

export default function Profile() {
  return (
    <>
      <Header title="Your Account" />

      <section id="Profile">
        <div id="Profile__inner" className="inner">
          <div className="Profile__input-section">
            <p>Change Username:</p>
            <input className="Profile__input" type="text" />
            <div className="Profile__button-row">
              <TextBtn
                text="Update"
                size="2"
                callback={() => {
                  alert('todo');
                }}
              />
            </div>
          </div>

          <div className="Profile__input-section">
            <p>Change Password:</p>
            <input className="Profile__input" type="password" />
            <input className="Profile__input" type="password" />
            <div className="Profile__button-row">
              <TextBtn
                text="Update"
                size="2"
                callback={() => {
                  alert('todo');
                }}
              />
            </div>
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
