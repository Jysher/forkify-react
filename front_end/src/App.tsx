import { useEffect, useState } from "react";
import "./App.css";
import {
  type IRecipe,
  type LoginBody,
  type LoginRes,
  type RegisterBody,
  type User,
} from "./types/types";
import Error from "./components/Error/Error";
import Navbar from "./components/Navbar/Navbar";
import Recipe from "./components/Recipe/Recipe";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Spinner from "./components/Spinner/Spinner";
import AddRecipeModal from "./components/AddRecipeModal/AddRecipeModal";
import LoginModal from "./components/LoginModal/LoginModal";
import RegisterModal from "./components/RegisterModal/RegisterModal";
import { useLocationHash } from "./utils/useLocationHash";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [recipeError, setRecipeError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSearchSpinner, setShowSearchSpinner] = useState(false);
  const [showRecipeSpinner, setShowRecipeSpinner] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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
        setShowRecipeSpinner(true);
        const res = await fetch(`${API_URL}/recipes/${locationHash}`, {
          signal: controller.signal,
        });
        const { data }: { data: IRecipe } = await res.json();
        setShowRecipeSpinner(false);
        if (!data) {
          setRecipe(null);
          setRecipeError("Could not find recipe");
          setSearchError(null);
          return;
        }
        setRecipe(data);
        setRecipeError(null);
        setSearchError(null);
      } catch {
        setRecipe(null);
        setRecipeError(
          "Could not fetch recipe at this time. Please try again later",
        );
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
      setShowSearchSpinner(true);

      const res = await fetch(`${API_URL}/recipes?search=${query}`);
      const { data }: { data: IRecipe[] } = await res.json();

      setShowSearchSpinner(false);

      if (data.length <= 0) {
        setSearchError(`No recipes found for "${query}".`);
        setSearchResults([]);
        return;
      }
      setSearchError(null);
      setSearchResults(data);
    } catch {
      setSearchError(
        "Could not fetch recipes at the moment. Please try again later.",
      );
    }
  };

  const loginHandler = async (formData: FormData): Promise<void> => {
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";

    if (!email || !password) {
      setLoginError("No email or password provided.");
      return;
    }

    const body: LoginBody = {
      email: email,
      password: password,
    };

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: LoginRes = await res.json();

      if (res.status !== 200) {
        setLoginError(data.message);
        setRecipeError(data.message);
        return;
      }

      localStorage.setItem("jwtToken", data.token);
      setUser({
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        email: data.user.email,
        role: data.user.role,
        photo: data.user.photo,
      });
      setShowLoginModal(false);
      setLoginError("");
    } catch {
      setLoginError("Could not log in at this moment. Please try again later.");
    }
  };

  const registerHandler = async (formData: FormData): Promise<void> => {
    const firstName = formData.get("first_name") || "";
    const lastName = formData.get("last_name") || "";
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";

    if (!firstName || !lastName || !email || !password) {
      setRegisterError("No details provided.");
      return;
    }

    const body: RegisterBody = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };
  };

  const logoutHandler = async (): Promise<void> => {
    localStorage.removeItem("jwtToken");
    setUser(null);
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
            user={user}
          />
        </header>
        <div className="search-results">
          {showSearchSpinner ? (
            <Spinner />
          ) : !searchError ? (
            <SearchResults
              recipes={searchResults}
              getRecipeHandler={setRecipe}
            />
          ) : (
            <Error message={searchError} />
          )}
          <div className="copyright">
            <p>
              &copy; Copyright by&nbsp;
              <a
                className="twitter-link"
                target="_blank"
                href="https://twitter.com/jonasschmedtman">
                Jonas Schmedtmann
              </a>
              . Use for learning or your portfolio. Don't use to teach. Don't
              claim as your own.
            </p>
          </div>
        </div>
        <div className="recipe">
          {showRecipeSpinner ? (
            <Spinner />
          ) : !recipeError ? (
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

      <LoginModal
        showModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
        login={loginHandler}
        loginError={loginError}
      />
      <RegisterModal
        showModal={showRegisterModal}
        setShowRegisterModal={setShowRegisterModal}
        setShowLoginModal={setShowLoginModal}
        register={registerHandler}
        registerError={registerError}
      />
    </>
  );
}

export default App;
