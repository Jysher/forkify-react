import icons from "/icons.svg";
import "./Navbar.css";
import type { User } from "../../types/types";

type NavbarProps = {
  onAddRecipeClick: () => void;
  onLoginClick: () => void;
  user: User | null;
};

function Navbar({ onAddRecipeClick, onLoginClick, user }: NavbarProps) {
  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__item">
          <button
            className="nav__btn nav__btn--add-recipe"
            onClick={onAddRecipeClick}>
            <svg className="nav__icon">
              <use href={`${icons}#icon-edit`}></use>
            </svg>
            <span>Add recipe</span>
          </button>
        </li>

        {user && (
          <li className="nav__item">
            <button className="nav__btn nav__btn--bookmarks">
              <svg className="nav__icon">
                <use href={`${icons}#icon-bookmark`}></use>
              </svg>
              <span>Bookmarks</span>
            </button>
            <div className="bookmarks">
              <ul className="bookmarks__list">
                <div className="message">
                  <div>
                    <svg>
                      <use href={`${icons}#icon-smile`}></use>
                    </svg>
                  </div>
                  <p>No bookmarks yet. Find a nice recipe and bookmark it :)</p>
                </div>

                <li className="preview">
                  <a className="preview__link" href="#23456">
                    <figure className="preview__fig">
                      <img src="src/img/test-1.jpg" alt="Test" />
                    </figure>
                    <div className="preview__data">
                      <h4 className="preview__name">
                        Pasta with Tomato Cream ...
                      </h4>
                      <p className="preview__publisher">The Pioneer Woman</p>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        )}

        {user ? (
          <li className="nav__item">
            <button className="nav__btn nav__btn--user">
              <span>Hi {user.first_name}!</span>
              <figure className="preview__fig">
                <img src={user.photo} alt="Test" />
              </figure>
            </button>
            <div className="user">
              <ul className="user__list">
                <li className="logout-btn">
                  <button
                    className="nav__btn nav__btn--logout"
                    onClick={() => {}}>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </li>
        ) : (
          <li className="nav__item">
            <button className="nav__btn nav__btn--login" onClick={onLoginClick}>
              <svg className="nav__icon">
                <use href={`${icons}#icon-user`}></use>
              </svg>
              <span>Login</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
