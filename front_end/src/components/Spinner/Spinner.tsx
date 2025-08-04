import icons from '/icons.svg';
import './Spinner.css';

function Spinner() {
  return (
    <div className="spinner">
      <svg>
        <use href={`${icons}#icon-loader`}></use>
      </svg>
    </div>
  );
}

export default Spinner;
