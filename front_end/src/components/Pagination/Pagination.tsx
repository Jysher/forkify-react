import icons from '/icons.svg';
import './Pagination.css';

type PaginationProps = {
  page: number;
  totalPages: number;
  prevPage: () => void;
  nextPage: () => void;
};

function Pagination({ page, totalPages, prevPage, nextPage }: PaginationProps) {
  if (page === 1 && totalPages > 1) {
    return (
      <div className="pagination">
        <button
          className="btn--inline pagination__btn--next"
          onClick={nextPage}
        >
          <span>{page + 1}</span>
          <svg className="search__icon">
            <use href={`${icons}#icon-arrow-right`}></use>
          </svg>
        </button>
      </div>
    );
  }

  if (page === totalPages && totalPages > 1) {
    return (
      <div className="pagination">
        <button
          className="btn--inline pagination__btn--prev"
          onClick={prevPage}
        >
          <svg className="search__icon">
            <use href={`${icons}#icon-arrow-left`}></use>
          </svg>
          <span>{page - 1}</span>
        </button>
      </div>
    );
  }
  if (page < totalPages) {
    return (
      <div className="pagination">
        <button
          className="btn--inline pagination__btn--prev"
          onClick={prevPage}
        >
          <svg className="search__icon">
            <use href={`${icons}#icon-arrow-left`}></use>
          </svg>
          <span>{page - 1}</span>
        </button>

        <button
          className="btn--inline pagination__btn--next"
          onClick={nextPage}
        >
          <span>{page + 1}</span>
          <svg className="search__icon">
            <use href={`${icons}#icon-arrow-right`}></use>
          </svg>
        </button>
      </div>
    );
  }
  return '';
}

export default Pagination;
