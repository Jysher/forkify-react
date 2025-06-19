import icons from '/icons.svg';
import './Recipe.css';
import { type IRecipe } from '../types/types';

type RecipeProps = {
  recipe: IRecipe | null;
  searchResults: IRecipe[];
};

function Recipe({ recipe, searchResults }: RecipeProps) {
  return (
    <>
      {!recipe ? (
        <div className="message">
          {!searchResults || searchResults.length <= 0 ? (
            <>
              <div>
                <svg>
                  <use href={`${icons}#icon-smile`}></use>
                </svg>
              </div>
              <p>Start by searching for a recipe or an ingredient. Have fun!</p>
            </>
          ) : (
            <p>Found {searchResults.length} recipes!</p>
          )}
        </div>
      ) : (
        <>
          <figure className="recipe__fig">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="recipe__img"
            />
            <h1 className="recipe__title">
              <span>{recipe.title}</span>
            </h1>
          </figure>

          <div className="recipe__details">
            <div className="recipe__info">
              <svg className="recipe__info-icon">
                <use href={`${icons}#icon-clock`}></use>
              </svg>
              <span className="recipe__info-data recipe__info-data--minutes">
                {recipe.cooking_time}
              </span>
              <span className="recipe__info-text">minutes</span>
            </div>
            <div className="recipe__info">
              <svg className="recipe__info-icon">
                <use href={`${icons}#icon-users`}></use>
              </svg>
              <span className="recipe__info-data recipe__info-data--people">
                {recipe.servings}
              </span>
              <span className="recipe__info-text">servings</span>

              <div className="recipe__info-buttons">
                <button className="btn--tiny btn--increase-servings">
                  <svg>
                    <use href={`${icons}#icon-minus-circle`}></use>
                  </svg>
                </button>
                <button className="btn--tiny btn--increase-servings">
                  <svg>
                    <use href={`${icons}#icon-plus-circle`}></use>
                  </svg>
                </button>
              </div>
            </div>

            <div className="recipe__user-generated">
              <svg>
                <use href={`${icons}#icon-user`}></use>
              </svg>
            </div>
            <button className="btn--round">
              <svg>
                <use href={`${icons}#icon-bookmark-fill`}></use>
              </svg>
            </button>
          </div>

          <div className="recipe__ingredients">
            <h2 className="heading--2">Recipe ingredients</h2>
            <ul className="recipe__ingredient-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li className="recipe__ingredient" key={index}>
                  <svg className="recipe__icon">
                    <use href={`${icons}#icon-check`}></use>
                  </svg>
                  <div className="recipe__quantity">{ingredient.quantity}</div>
                  <div className="recipe__description">
                    <span className="recipe__unit">{ingredient.unit} </span>
                    {ingredient.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="recipe__directions">
            <h2 className="heading--2">How to cook it</h2>
            <p className="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span className="recipe__publisher"> {recipe.publisher}</span>.
              Please check out directions at their website.
            </p>
            <a
              className="btn--small recipe__btn"
              href={recipe.source_url}
              target="_blank"
            >
              <span>Directions</span>
              <svg className="search__icon">
                <use href={`${icons}#icon-arrow-right`}></use>
              </svg>
            </a>
          </div>
        </>
      )}
    </>
  );
}

export default Recipe;
