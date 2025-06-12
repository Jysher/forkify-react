import { useEffect, useState } from 'react';
import icons from '/icons.svg';
import './SearchResults.css';
import { type IRecipe } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL;

type SearchResultsProps = {
  query: string;
  onError: (error: string | null) => void;
  onGetRecipe: (recipe: IRecipe | null) => void;
};

function SearchResults({ query, onError, onGetRecipe }: SearchResultsProps) {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async (query: string) => {
      const res = await fetch(`${API_URL}/recipes?search=${query}`);
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setRecipes(data.data);
      if (data.data.length === 0) {
        onError(`No recipes found for "${query}". Please try again!`);
      }
    };

    fetchRecipes(query);
  }, [query, onError]);

  if (recipes.length === 0) {
    return <div className="search-results"></div>;
  }

  return (
    <div className="search-results">
      <ul className="results">
        {recipes.map((recipe: IRecipe) => (
          <li
            className="preview"
            key={recipe._id}
            onClick={() => onGetRecipe(recipe)}
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

      {/* <div className="pagination">
        <button className="btn--inline pagination__btn--prev">
          <svg className="search__icon">
            <use href={`${icons}#icon-arrow-left`}></use>
          </svg>
          <span>Page 1</span>
        </button>
        <button className="btn--inline pagination__btn--next">
          <span>Page 3</span>
          <svg className="search__icon">
            <use href={`${icons}#icon-arrow-right`}></use>
          </svg>
        </button>
      </div> */}
    </div>
  );
}

export default SearchResults;
