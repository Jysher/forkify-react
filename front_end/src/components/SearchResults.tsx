import { useState } from 'react';
import icons from '/icons.svg';
import './SearchResults.css';
import { type IRecipe } from '../types/types';
import Pagination from './Pagination';

type SearchResultsProps = {
  recipes: IRecipe[];
  getRecipeHandler: (recipe: IRecipe) => void;
};

const RESULTS_PER_PAGE = 11;

function SearchResults({ recipes, getRecipeHandler }: SearchResultsProps) {
  const [page, setPage] = useState(1);

  const start = (page - 1) * RESULTS_PER_PAGE;
  const end = page * RESULTS_PER_PAGE;
  const recipesToDisplay = recipes.slice(start, end);
  const totalPages = Math.ceil(recipes.length / RESULTS_PER_PAGE);

  const nextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setPage(prevPage => prevPage - 1);
  };

  return recipesToDisplay.length > 0 ? (
    <>
      <ul className="results">
        {recipesToDisplay.map((recipe: IRecipe) => (
          <li
            className="preview"
            key={recipe._id}
            onClick={() => getRecipeHandler(recipe)}
          >
            <a
              className="preview__link preview__link--active"
              href={`#${recipe._id}`}
            >
              <figure className="preview__fig">
                <img src={recipe.image_url} alt={recipe.title} />
              </figure>
              <div className="preview__data">
                <h4 className="preview__title">{recipe.title}</h4>
                <p className="preview__publisher">{recipe.publisher}</p>
                <div className="preview__user-generated">
                  <svg>
                    <use href={`${icons}#icon-user`}></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={totalPages}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </>
  ) : null;
}

export default SearchResults;
