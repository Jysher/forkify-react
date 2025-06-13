import { useState } from 'react';
import icons from '/icons.svg';
import './App.css';
import { type IRecipe } from './types/types';
import Error from './components/Error';
import Navbar from './components/Navbar';
import Recipe from './components/Recipe';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchHandler = async (query: string): Promise<unknown> => {
    try {
      const res = await fetch(`${API_URL}/recipes?search=${query}`);
      const data = await res.json();

      if (data.data.length <= 0) {
        setError(`No recipes found for "${query}". Please try another search.`);
        setSearchResults([]);
        return;
      }
      setError(null);
      setSearchResults(data.data);
    } catch {
      setError(
        'Could not fetch recipes at the moment. Please try again later.'
      );
    }
  };

  return (
    <>
      <div className="container">
        <header className="header">
          <img src="/logo.png" alt="Logo" className="header__logo" />
          <SearchBar searchHandler={searchHandler} />
          <Navbar />
        </header>
        <div className="search-results">
          {!error ? (
            <SearchResults
              recipes={searchResults}
              getRecipeHandler={setRecipe}
            />
          ) : (
            <Error message={error} />
          )}
        </div>
        <div className="recipe">
          <Recipe recipe={recipe} />
        </div>
      </div>

      <div className="overlay hidden"></div>
      <div className="add-recipe-window hidden">
        <button className="btn--close-modal">&times;</button>
        <form className="upload">
          <div className="upload__column">
            <h3 className="upload__heading">Recipe data</h3>
            <label>Title</label>
            <input required name="title" type="text" />
            <label>URL</label>
            <input required name="sourceUrl" type="text" />
            <label>Image URL</label>
            <input required name="image" type="text" />
            <label>Publisher</label>
            <input required name="publisher" type="text" />
            <label>Prep time</label>
            <input required name="cookingTime" type="number" />
            <label>Servings</label>
            <input required name="servings" type="number" />
          </div>

          <div className="upload__column">
            <h3 className="upload__heading">Ingredients</h3>
            <label>Ingredient 1</label>
            <input
              type="text"
              required
              name="ingredient-1"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 2</label>
            <input
              type="text"
              name="ingredient-2"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 3</label>
            <input
              type="text"
              name="ingredient-3"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 4</label>
            <input
              type="text"
              name="ingredient-4"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 5</label>
            <input
              type="text"
              name="ingredient-5"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 6</label>
            <input
              type="text"
              name="ingredient-6"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
          </div>

          <button className="btn upload__btn">
            <svg>
              <use href={`${icons}#icon-upload-cloud`}></use>
            </svg>
            <span>Upload</span>
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
