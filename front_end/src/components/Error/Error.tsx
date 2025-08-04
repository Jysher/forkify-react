import icons from '/icons.svg';
import './Error.css';

function Error({ message }: { message: string }) {
  return (
    <div className="error">
      <div>
        <svg>
          <use href={`${icons}#icon-alert-triangle`}></use>
        </svg>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default Error;
