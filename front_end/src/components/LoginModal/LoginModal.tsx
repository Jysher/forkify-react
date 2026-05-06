import "./LoginModal.css";

type LoginModalProps = {
  showModal: boolean;
  setShowLoginModal: (bool: boolean) => void;
  setShowRegisterModal: (bool: boolean) => void;
  login: (formData: FormData) => void;
  loginError: string | null;
};

function LoginModal({
  showModal,
  setShowLoginModal,
  setShowRegisterModal,
  login,
  loginError,
}: LoginModalProps) {
  return (
    <>
      <div
        className={`overlay ${showModal ? "" : "hidden"}`}
        onClick={() => {
          setShowLoginModal(false);
        }}></div>
      <div className={`login-window ${showModal ? "" : "hidden"}`}>
        <button
          className="btn--close-modal"
          onClick={() => {
            setShowLoginModal(false);
          }}>
          &times;
        </button>
        <form className="login-form" action={login}>
          <div className="login-form__column">
            <h3 className="login-form__heading">Login</h3>
            <label>Email</label>
            <input required name="email" type="email" />
            <label>Password</label>
            <input required name="password" type="password" />
          </div>

          {loginError && (
            <div className="login-form__error">
              <p>{loginError}</p>
            </div>
          )}
          <div className="login-form__btn">
            <button type="submit" className="btn">
              Login
            </button>
          </div>
        </form>
        <div className="register-container">
          <span className="register-text">
            Don't have an account? Register{" "}
          </span>
          <button
            className="register__btn"
            onClick={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}>
            here
          </button>
        </div>
      </div>
    </>
  );
}

export default LoginModal;
