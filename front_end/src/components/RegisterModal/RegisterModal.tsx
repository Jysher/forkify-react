import "./RegisterModal.css";

type RegisterModalProps = {
  showModal: boolean;
  setShowRegisterModal: (bool: boolean) => void;
  setShowLoginModal: (bool: boolean) => void;
  register: (formData: FormData) => void;
  registerError: string | null;
};

function RegisterModal({
  showModal,
  setShowRegisterModal,
  setShowLoginModal,
  register,
  registerError,
}: RegisterModalProps) {
  return (
    <>
      <div
        className={`overlay ${showModal ? "" : "hidden"}`}
        onClick={() => {
          setShowRegisterModal(false);
        }}></div>
      <div className={`login-window ${showModal ? "" : "hidden"}`}>
        <button
          className="btn--close-modal"
          onClick={() => {
            setShowRegisterModal(false);
          }}>
          &times;
        </button>
        <form className="register-form" action={register}>
          <div className="register-form__column">
            <h3 className="register-form__heading">Register</h3>
            <label>First Name</label>
            <input required name="first_name" type="text" />
            <label>Last Name</label>
            <input required name="last_name" type="text" />
            <label>Email</label>
            <input required name="email" type="email" />
            <label>Password</label>
            <input required name="password" type="password" minLength={8} />
          </div>

          {registerError && (
            <div className="register-form__error">
              <p>{registerError}</p>
            </div>
          )}

          <div className="register-form__btn">
            <button className="btn" type="submit">
              Register
            </button>
          </div>
        </form>
        <div className="register-container">
          <span className="register-text">Already have an account? </span>
          <button
            className="register__btn"
            onClick={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}

export default RegisterModal;
