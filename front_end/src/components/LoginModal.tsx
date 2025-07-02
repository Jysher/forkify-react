import icons from '/icons.svg';
import './LoginModal.css';

type LoginModalProps = {
  showModal: boolean;
  hideModal: (bool: boolean) => void;
};

function LoginModal({ showModal, hideModal }: LoginModalProps) {
  return (
    <>
      <div
        className={`overlay ${showModal ? '' : 'hidden'}`}
        onClick={() => {
          hideModal(false);
        }}
      ></div>
      <div className={`login-window ${showModal ? '' : 'hidden'}`}>
        <button
          className="btn--close-modal"
          onClick={() => {
            hideModal(false);
          }}
        >
          &times;
        </button>
        <form className="login-form">
          <div className="login-form__column">
            <h3 className="login-form__heading">Login</h3>
            <label>Email</label>
            <input required name="email" type="email" />
            <label>Password</label>
            <input required name="password" type="password" />
          </div>

          <div className="login-form__btn">
            <button className="btn login-form__btn">
              <svg>
                <use href={`${icons}#icon-upload-cloud`}></use>
              </svg>
              <span>Login</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginModal;
