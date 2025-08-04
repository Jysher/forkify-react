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
  const locationHash = useLocationHash().slice(1);

  useEffect(() => {
    const controller = new AbortController();
    if (!locationHash) {
      setRecipe(null);
      setRecipeError(null);
      setSearchError(null);
      return;
    }
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API_URL}/recipes/${locationHash}`, {
          signal: controller.signal,
        });
        const { data }: { data: IRecipe } = await res.json();
        if (!data) {
          setRecipe(null);
          setRecipeError('Could not find recipe');
          setSearchError(null);
          return;
        }
        setRecipe(data);
        setRecipeError(null);
        setSearchError(null);
      } catch {
        setRecipe(null);
        setRecipeError('Could not find recipe');
        setSearchError(null);
      }
    };

    fetchRecipe();

    return () => {
      controller.abort();
    };
  }, [locationHash]);

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
