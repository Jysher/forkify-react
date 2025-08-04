import { useEffect, useState } from 'react';
import './App.css';
import { type IRecipe } from './types/types';
import Error from './components/Error/Error';
import Navbar from './components/Navbar/Navbar';
import Recipe from './components/Recipe/Recipe';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import AddRecipeModal from './components/AddRecipeModal/AddRecipeModal';
import LoginModal from './components/LoginModal/LoginModal';
import { useLocationHash } from './utils/useLocationHash';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [recipeError, setRecipeError] = useState<string | null>(null);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const urlHash = useLocationHash().slice(1);

  useEffect(() => {
    let ignore = false;
    const fetchRecipe = async () => {
      if (!urlHash) {
        setRecipe(null);
        setRecipeError(null);
        return;
      }

      try {
        if (!ignore) {
          const res = await fetch(`${API_URL}/recipes/${urlHash}`);
          const { data }: { data: IRecipe[] } = await res.json();

          if (data.length <= 0) {
            setRecipeError(`No recipe found for "${urlHash}".`);
            return;
          }
          setRecipe(data[0]);
          setRecipeError(null);
        }
      } catch {
        setSearchError('Could not find recipe');
      }
    };

    fetchRecipe();

    return () => {
      ignore = true;
    };
  }, [urlHash]);

  const searchHandler = async (query: string): Promise<unknown> => {
    try {
      const res = await fetch(`${API_URL}/recipes?search=${query}`);
      const { data }: { data: IRecipe[] } = await res.json();

      if (data.length <= 0) {
        setSearchError(`No recipes found for "${query}".`);
        setSearchResults([]);
        return;
      }
      setSearchError(null);
      setSearchResults(data);
    } catch {
      setSearchError(
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
          <Navbar
            onAddRecipeClick={() => {
              setShowAddRecipeModal(true);
            }}
            onLoginClick={() => {
              setShowLoginModal(true);
            }}
          />
        </header>
        <div className="search-results">
          {!searchError ? (
            <SearchResults
              recipes={searchResults}
              getRecipeHandler={setRecipe}
            />
          ) : (
            <Error message={searchError} />
          )}
        </div>
        <div className="recipe">
          {!recipeError ? (
            <Recipe recipe={recipe} searchResults={searchResults} />
          ) : (
            <Error message={recipeError} />
          )}
        </div>
      </div>

      <AddRecipeModal
        showModal={showAddRecipeModal}
        hideModal={setShowAddRecipeModal}
      />

      <LoginModal showModal={showLoginModal} hideModal={setShowLoginModal} />
    </>
  );
}

export default App;
